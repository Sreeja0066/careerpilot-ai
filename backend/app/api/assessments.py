import logging
from datetime import datetime, timezone
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session, selectinload

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.db.models import (
    Assessment,
    AssessmentItem,
    AssessmentSkillResult,
    Profile,
    User,
    UserSkill,
)
from app.schemas.assessment import (
    AssessmentDetailResponse,
    AssessmentHistoryItem,
    AssessmentQuestionResponse,
)
from app.services.assessment_ai import (
    AssessmentAIConfigurationError,
    AssessmentAIGenerationError,
    generate_assessment_questions,
)

logger = logging.getLogger(__name__)

router = APIRouter(
    prefix="/assessments",
    tags=["Assessments"],
)


def build_assessment_response(
    assessment: Assessment,
) -> AssessmentDetailResponse:
    """Return public assessment fields without exposing rubrics."""

    questions = [
        AssessmentQuestionResponse(
            id=item.id,
            question_order=item.question_order,
            skill_name=item.skill_name,
            category=item.category,
            difficulty=item.difficulty,
            question_type=item.question_type,
            question_text=item.question_text,
            options=item.options,
            answer_text=item.answer_text,
            score=item.score,
            max_score=item.max_score,
            feedback=item.feedback,
            submitted_at=item.submitted_at,
        )
        for item in assessment.items
    ]

    results = [
        {
            "id": result.id,
            "skill_name": result.skill_name,
            "category": result.category,
            "score": result.score,
            "level": result.level,
            "gap_type": result.gap_type,
            "evidence_summary": result.evidence_summary,
            "recommendation": result.recommendation,
        }
        for result in assessment.skill_results
    ]

    return AssessmentDetailResponse(
        id=assessment.id,
        target_role=assessment.target_role,
        target_company=assessment.target_company,
        status=assessment.status,
        overall_score=assessment.overall_score,
        summary=assessment.summary,
        strengths=assessment.strengths,
        weaknesses=assessment.weaknesses,
        missing_prerequisites=assessment.missing_prerequisites,
        recommendations=assessment.recommendations,
        created_at=assessment.created_at,
        updated_at=assessment.updated_at,
        completed_at=assessment.completed_at,
        total_questions=len(questions),
        questions=questions,
        skill_results=results,
    )


@router.post(
    "/start",
    response_model=AssessmentDetailResponse,
    status_code=status.HTTP_201_CREATED,
)
def start_assessment(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    profile = (
        db.query(Profile)
        .filter(Profile.user_id == current_user.id)
        .first()
    )

    if not profile:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Complete your profile before starting an assessment.",
        )

    target_role = (profile.target_role or "").strip()

    if not target_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Add a target role to your profile first.",
        )

    # Resume an existing assessment instead of creating duplicates.
    existing = (
        db.query(Assessment)
        .options(
            selectinload(Assessment.items),
            selectinload(Assessment.skill_results),
        )
        .filter(
            Assessment.user_id == current_user.id,
            Assessment.status == "in_progress",
        )
        .order_by(Assessment.created_at.desc())
        .first()
    )

    if existing and existing.items:
        return build_assessment_response(existing)

    # Retire an empty in-progress session if an earlier attempt
    # was created without questions.
    if existing:
        existing.status = "cancelled"
        db.commit()

    user_skills = (
        db.query(UserSkill)
        .filter(UserSkill.user_id == current_user.id)
        .order_by(UserSkill.created_at.asc())
        .all()
    )

    skills_context = [
        {
            "skill_name": skill.skill_name,
            "category": skill.category,
            "self_assessed_level": skill.self_assessed_level,
        }
        for skill in user_skills
    ]

    try:
        generated = generate_assessment_questions(
            target_role=target_role,
            target_company=profile.target_company,
            experience_level=profile.experience_level,
            experience_summary=profile.experience_summary,
            skills=skills_context,
        )
    except AssessmentAIConfigurationError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(exc),
        ) from exc
    except AssessmentAIGenerationError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc

    assessment = Assessment(
        user_id=current_user.id,
        target_role=target_role,
        target_company=profile.target_company,
        status="in_progress",
    )

    try:
        db.add(assessment)
        db.flush()

        for order, question in enumerate(
            generated.questions,
            start=1,
        ):
            private_rubric = {
                "expected_answer": question.expected_answer,
                "criteria": question.evaluation_rubric,
            }

            db.add(
                AssessmentItem(
                    assessment_id=assessment.id,
                    question_order=order,
                    skill_name=question.skill_name,
                    category=question.category,
                    difficulty=question.difficulty,
                    question_type=question.question_type,
                    question_text=question.question_text,
                    options=question.options,
                    rubric=private_rubric,
                    max_score=100,
                )
            )

        db.commit()

    except Exception as exc:
        db.rollback()
        logger.exception("Failed to persist assessment.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to save the generated assessment.",
        ) from exc

    assessment = (
        db.query(Assessment)
        .options(
            selectinload(Assessment.items),
            selectinload(Assessment.skill_results),
        )
        .filter(
            Assessment.id == assessment.id,
            Assessment.user_id == current_user.id,
        )
        .one()
    )

    return build_assessment_response(assessment)


@router.get(
    "",
    response_model=list[AssessmentHistoryItem],
)
def list_assessments(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assessments = (
        db.query(Assessment)
        .options(selectinload(Assessment.items))
        .filter(Assessment.user_id == current_user.id)
        .order_by(Assessment.created_at.desc())
        .all()
    )

    return [
        AssessmentHistoryItem(
            id=assessment.id,
            target_role=assessment.target_role,
            status=assessment.status,
            overall_score=assessment.overall_score,
            total_questions=len(assessment.items),
            created_at=assessment.created_at,
            completed_at=assessment.completed_at,
        )
        for assessment in assessments
    ]


@router.get(
    "/{assessment_id}",
    response_model=AssessmentDetailResponse,
)
def get_assessment(
    assessment_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    assessment = (
        db.query(Assessment)
        .options(
            selectinload(Assessment.items),
            selectinload(Assessment.skill_results),
        )
        .filter(
            Assessment.id == assessment_id,
            Assessment.user_id == current_user.id,
        )
        .first()
    )

    if not assessment:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Assessment not found.",
        )

    return build_assessment_response(assessment)