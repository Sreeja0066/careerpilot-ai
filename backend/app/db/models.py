
from __future__ import annotations

from datetime import datetime
from typing import Any, Optional
from uuid import UUID, uuid4

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Text,
    UniqueConstraint,
    func,
)
from sqlalchemy.dialects.postgresql import (
    JSONB,
    UUID as PostgreSQLUUID,
)
from sqlalchemy.orm import (
    Mapped,
    mapped_column,
    relationship,
)

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    profile: Mapped[Optional["Profile"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


class Profile(Base):
    __tablename__ = "profiles"

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True,
    )

    full_name: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    experience_level: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )

    experience_summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    target_role: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    target_company: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    weekly_hours: Mapped[Optional[int]] = mapped_column(
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="profile",
    )


class UserSkill(Base):
    __tablename__ = "user_skills"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "skill_name",
            name="uq_user_skill",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    skill_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    category: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )

    self_assessed_level: Mapped[Optional[str]] = mapped_column(
        String(30),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )


# ============================================================
# PHASE 2: AI CAREER ASSESSMENT
# ============================================================

class Assessment(Base):
    __tablename__ = "assessments"

    __table_args__ = (
        CheckConstraint(
            "status IN "
            "('in_progress', 'completed', 'failed', 'cancelled')",
            name="ck_assessment_status",
        ),
        CheckConstraint(
            "overall_score IS NULL OR "
            "overall_score BETWEEN 0 AND 100",
            name="ck_assessment_overall_score",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    user_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    # Snapshot the career target for this assessment.
    target_role: Mapped[str] = mapped_column(
        String(150),
        nullable=False,
    )

    target_company: Mapped[Optional[str]] = mapped_column(
        String(150),
        nullable=True,
    )

    status: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="in_progress",
    )

    overall_score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    strengths: Mapped[Optional[list[Any]]] = mapped_column(
        JSONB,
        nullable=True,
    )

    weaknesses: Mapped[Optional[list[Any]]] = mapped_column(
        JSONB,
        nullable=True,
    )

    missing_prerequisites: Mapped[
        Optional[list[Any]]
    ] = mapped_column(
        JSONB,
        nullable=True,
    )

    recommendations: Mapped[
        Optional[list[Any]]
    ] = mapped_column(
        JSONB,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )

    completed_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    items: Mapped[list["AssessmentItem"]] = relationship(
        back_populates="assessment",
        cascade="all, delete-orphan",
        order_by="AssessmentItem.question_order",
    )

    skill_results: Mapped[
        list["AssessmentSkillResult"]
    ] = relationship(
        back_populates="assessment",
        cascade="all, delete-orphan",
    )


class AssessmentItem(Base):
    __tablename__ = "assessment_items"

    __table_args__ = (
        UniqueConstraint(
            "assessment_id",
            "question_order",
            name="uq_assessment_question_order",
        ),
        CheckConstraint(
            "question_order >= 1",
            name="ck_assessment_question_order",
        ),
        CheckConstraint(
            "score IS NULL OR score BETWEEN 0 AND 100",
            name="ck_assessment_item_score",
        ),
        CheckConstraint(
            "max_score > 0",
            name="ck_assessment_item_max_score",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    assessment_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    question_order: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    skill_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    category: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )

    difficulty: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    question_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
        default="short_answer",
    )

    question_text: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    # Choices for multiple-choice questions.
    options: Mapped[Optional[list[Any]]] = mapped_column(
        JSONB,
        nullable=True,
    )

    # Private evaluation guidance. Never return this
    # field in the public question response.
    rubric: Mapped[Optional[dict[str, Any]]] = mapped_column(
        JSONB,
        nullable=True,
    )

    answer_text: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    score: Mapped[Optional[int]] = mapped_column(
        Integer,
        nullable=True,
    )

    max_score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=100,
    )

    feedback: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    evaluation: Mapped[
        Optional[dict[str, Any]]
    ] = mapped_column(
        JSONB,
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    submitted_at: Mapped[Optional[datetime]] = mapped_column(
        DateTime(timezone=True),
        nullable=True,
    )

    assessment: Mapped["Assessment"] = relationship(
        back_populates="items",
    )


class AssessmentSkillResult(Base):
    __tablename__ = "assessment_skill_results"

    __table_args__ = (
        UniqueConstraint(
            "assessment_id",
            "skill_name",
            name="uq_assessment_skill_result",
        ),
        CheckConstraint(
            "score BETWEEN 0 AND 100",
            name="ck_assessment_skill_score",
        ),
    )

    id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )

    assessment_id: Mapped[UUID] = mapped_column(
        PostgreSQLUUID(as_uuid=True),
        ForeignKey("assessments.id", ondelete="CASCADE"),
        nullable=False,
        index=True,
    )

    skill_name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    category: Mapped[Optional[str]] = mapped_column(
        String(50),
        nullable=True,
    )

    score: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
    )

    level: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    gap_type: Mapped[str] = mapped_column(
        String(30),
        nullable=False,
    )

    evidence_summary: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    recommendation: Mapped[Optional[str]] = mapped_column(
        Text,
        nullable=True,
    )

    assessment: Mapped["Assessment"] = relationship(
        back_populates="skill_results",
    )