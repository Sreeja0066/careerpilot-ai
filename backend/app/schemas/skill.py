from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class SkillCreate(BaseModel):
    skill_name: str = Field(min_length=1, max_length=100)
    category: Optional[str] = Field(default=None, max_length=50)
    self_assessed_level: Optional[str] = Field(default=None, max_length=30)


class SkillUpdate(BaseModel):
    skill_name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    category: Optional[str] = Field(default=None, max_length=50)
    self_assessed_level: Optional[str] = Field(default=None, max_length=30)


class SkillResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    user_id: UUID
    skill_name: str
    category: Optional[str]
    self_assessed_level: Optional[str]
    created_at: datetime
    updated_at: datetime