from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class ProfileCreate(BaseModel):
    full_name: str = Field(min_length=1, max_length=150)
    experience_level: Optional[str] = Field(default=None, max_length=50)
    experience_summary: Optional[str] = None
    target_role: Optional[str] = Field(default=None, max_length=150)
    target_company: Optional[str] = Field(default=None, max_length=150)
    weekly_hours: Optional[int] = Field(default=None, ge=1, le=168)


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = Field(default=None, min_length=1, max_length=150)
    experience_level: Optional[str] = Field(default=None, max_length=50)
    experience_summary: Optional[str] = None
    target_role: Optional[str] = Field(default=None, max_length=150)
    target_company: Optional[str] = Field(default=None, max_length=150)
    weekly_hours: Optional[int] = Field(default=None, ge=1, le=168)


class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    full_name: str
    experience_level: Optional[str]
    experience_summary: Optional[str]
    target_role: Optional[str]
    target_company: Optional[str]
    weekly_hours: Optional[int]
    created_at: datetime
    updated_at: datetime