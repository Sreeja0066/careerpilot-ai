# CareerPilot AI — Database Design

## 1. Database Overview

CareerPilot AI will use PostgreSQL as its primary relational database.

The database is responsible for storing persistent application state and measurable candidate activity.

The database should remain the source of truth for candidate progress rather than relying on the LLM's conversational memory.

---

## 2. Initial Database Architecture

```text
User
 |
 └── CandidateProfile
       |
       +── Skills
       |     |
       |     └── SkillAssessments
       |
       └── LearningPlans
             |
             └── LearningTasks