from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.api.dependencies import get_current_user
from app.db.dependencies import get_db
from app.db.models import User, UserSkill
from app.schemas.skill import (
    SkillCreate,
    SkillResponse,
    SkillUpdate,
)

router = APIRouter(
    prefix="/skills",
    tags=["Skills"],
)


@router.post(
    "",
    response_model=SkillResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_skill(
    skill_data: SkillCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_name == skill_data.skill_name,
        )
        .first()
    )

    if existing_skill:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Skill already exists",
        )

    skill = UserSkill(
        user_id=current_user.id,
        **skill_data.model_dump(),
    )

    db.add(skill)

    try:
        db.commit()
        db.refresh(skill)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Skill already exists",
        )

    return skill


@router.get(
    "",
    response_model=list[SkillResponse],
)
def get_skills(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(UserSkill)
        .filter(UserSkill.user_id == current_user.id)
        .order_by(UserSkill.created_at.asc())
        .all()
    )


@router.get(
    "/{skill_id}",
    response_model=SkillResponse,
)
def get_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == skill_id,
            UserSkill.user_id == current_user.id,
        )
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    return skill


@router.put(
    "/{skill_id}",
    response_model=SkillResponse,
)
def update_skill(
    skill_id: UUID,
    skill_data: SkillUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == skill_id,
            UserSkill.user_id == current_user.id,
        )
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    update_data = skill_data.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        setattr(skill, field, value)

    try:
        db.commit()
        db.refresh(skill)
    except IntegrityError:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="A skill with this name already exists",
        )

    return skill


@router.delete(
    "/{skill_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_skill(
    skill_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == skill_id,
            UserSkill.user_id == current_user.id,
        )
        .first()
    )

    if not skill:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Skill not found",
        )

    db.delete(skill)
    db.commit()