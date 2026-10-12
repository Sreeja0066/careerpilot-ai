from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


Difficulty = Literal[
    "beginner",
    "intermediate",
    "advanced",
]

QuestionType = Literal[
    "multiple_choice",
    "short_answer",
    "scenario",
]


class AssessmentQuestionResponse(BaseModel):
    """Public question data. Never expose private answer rubrics."""

    model_config = ConfigDict(from_attributes=True)

    id: UUID
    question_order: int
    skill_name: str
    category: str | None
    difficulty: Difficulty
    question_type: QuestionType
    question_text: str
    options: list[str] | None
    answer_text: str | None
    score: int | None
    max_score: int
    feedback: str | None
    submitted_at: datetime | None


class AssessmentSkillResultResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    skill_name: str
    category: str | None
    score: int
    level: str
    gap_type: str
    evidence_summary: str | None
    recommendation: str | None


class AssessmentDetailResponse(BaseModel):
    id: UUID
    target_role: str
    target_company: str | None
    status: str
    overall_score: int | None
    summary: str | None
    strengths: list[Any] | None
    weaknesses: list[Any] | None
    missing_prerequisites: list[Any] | None
    recommendations: list[Any] | None
    created_at: datetime
    updated_at: datetime
    completed_at: datetime | None
    total_questions: int
    questions: list[AssessmentQuestionResponse]
    skill_results: list[AssessmentSkillResultResponse]


class AssessmentHistoryItem(BaseModel):
    id: UUID
    target_role: str
    status: str
    overall_score: int | None
    total_questions: int
    created_at: datetime
    completed_at: datetime | None


class AssessmentAnswerRequest(BaseModel):
    answer_text: str = Field(
        min_length=1,
        max_length=20000,
    )


class AssessmentAnswerResponse(BaseModel):
    assessment_id: UUID
    question: AssessmentQuestionResponse
    assessment_status: str