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

---

## 3. Initial MVP Entities

### 3.1 User

Stores the application's basic user identity.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique user identifier |
| email | VARCHAR(255) | Unique, Not Null | User email |
| created_at | TIMESTAMP | Not Null | Account creation time |
| updated_at | TIMESTAMP | Not Null | Last update time |

---

### 3.2 CandidateProfile

Stores information about the candidate and their preparation context.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique profile identifier |
| user_id | UUID | Foreign Key → User.id, Unique | Owning user |
| full_name | VARCHAR(150) | Not Null | Candidate name |
| experience_level | VARCHAR(50) | Nullable | Fresher / Junior / Mid / Senior |
| experience_summary | TEXT | Nullable | Candidate's experience |
| target_role | VARCHAR(150) | Nullable | Current target role |
| target_company | VARCHAR(150) | Nullable | Optional target company |
| weekly_hours | INTEGER | Nullable | Available preparation time |
| created_at | TIMESTAMP | Not Null | Profile creation time |
| updated_at | TIMESTAMP | Not Null | Last update time |

---

### 3.3 Skill

Stores the reusable skill catalogue.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique skill identifier |
| name | VARCHAR(100) | Unique, Not Null | Skill name |
| category | VARCHAR(100) | Nullable | Technical / Programming / AI / Database / etc. |
| description | TEXT | Nullable | Skill description |
| created_at | TIMESTAMP | Not Null | Creation time |

Examples:

- Python
- SQL
- FastAPI
- React
- Machine Learning
- RAG
- LangChain
- System Design

---

### 3.4 UserSkill

Represents the candidate's current state for a particular skill.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique record |
| profile_id | UUID | Foreign Key → CandidateProfile.id | Candidate |
| skill_id | UUID | Foreign Key → Skill.id | Skill |
| proficiency_level | DECIMAL(4,2) | Nullable | Current estimated proficiency |
| source | VARCHAR(50) | Nullable | Self-reported / Assessment / Practice |
| last_assessed_at | TIMESTAMP | Nullable | Last assessment time |
| created_at | TIMESTAMP | Not Null | Creation time |
| updated_at | TIMESTAMP | Not Null | Last update time |

A candidate can have many skills, and a skill can belong to many candidates.

---

### 3.5 SkillAssessment

Stores an assessment performed for a candidate skill.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique assessment |
| profile_id | UUID | Foreign Key → CandidateProfile.id | Candidate |
| skill_id | UUID | Foreign Key → Skill.id | Skill being assessed |
| score | DECIMAL(5,2) | Nullable | Assessment score |
| difficulty | INTEGER | Nullable | Difficulty of assessment |
| result_level | VARCHAR(50) | Nullable | Beginner / Intermediate / Advanced |
| evidence | TEXT | Nullable | Evidence supporting the result |
| assessed_at | TIMESTAMP | Not Null | Assessment time |

Multiple assessments can exist for the same candidate and skill so progress can be tracked over time.

---

### 3.6 LearningPlan

Represents a personalized preparation plan for a candidate.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique plan identifier |
| profile_id | UUID | Foreign Key → CandidateProfile.id | Candidate |
| title | VARCHAR(200) | Not Null | Plan name |
| goal | TEXT | Nullable | Purpose of the plan |
| status | VARCHAR(30) | Not Null | Draft / Active / Completed / Paused |
| start_date | DATE | Nullable | Plan start |
| target_date | DATE | Nullable | Target completion |
| created_at | TIMESTAMP | Not Null | Creation time |
| updated_at | TIMESTAMP | Not Null | Last update |

---

### 3.7 LearningTask

Represents an individual task inside a learning plan.

| Field | Type | Constraints | Description |
|---|---|---|---|
| id | UUID | Primary Key | Unique task identifier |
| learning_plan_id | UUID | Foreign Key → LearningPlan.id | Parent plan |
| skill_id | UUID | Foreign Key → Skill.id | Related skill |
| title | VARCHAR(200) | Not Null | Task title |
| description | TEXT | Nullable | Task instructions |
| task_type | VARCHAR(50) | Not Null | Learn / Practice / Quiz / Review |
| difficulty | INTEGER | Nullable | Task difficulty |
| order_index | INTEGER | Not Null | Task sequence |
| status | VARCHAR(30) | Not Null | Pending / In Progress / Completed |
| completed_at | TIMESTAMP | Nullable | Completion time |
| created_at | TIMESTAMP | Not Null | Creation time |
| updated_at | TIMESTAMP | Not Null | Last update |

---

## 4. Entity Relationships

```text
User
 |
 └── CandidateProfile
       |
       ├── UserSkill
       |      |
       |      └── Skill
       |
       ├── SkillAssessment
       |      |
       |      └── Skill
       |
       └── LearningPlan
              |
              └── LearningTask
                     |
                     └── Skill

Relationship rules
One User has one CandidateProfile.
One CandidateProfile can have many UserSkill records.
One Skill can be associated with many candidates through UserSkill.
One CandidateProfile can have many SkillAssessment records.
One Skill can have many assessments across candidates and over time.
One CandidateProfile can have multiple LearningPlan records.
One LearningPlan contains multiple LearningTask records.
Each LearningTask can be associated with one primary Skill.'

# Candidate Learning State

The database supports the core CareerPilot learning loop:

CandidateProfile
       |
       v
UserSkill
       |
       v
SkillAssessment
       |
       v
Updated Skill State
       |
       v
LearningPlan
       |
       v
LearningTask
       |
       v
Practice / Learning
       |
       v
New Assessment
       |
       +----> Updated UserSkill

6. Database Design Principles
Persistent source of truth

PostgreSQL stores the application's persistent candidate state.

Historical assessment data

Assessments are stored as separate records rather than overwriting previous scores.

Reusable skills

Skills are stored independently so the same skill can be used across many candidates, assessments, and learning tasks.

Adaptive learning support

Skill proficiency, assessment history, task difficulty, and task completion state provide the foundation for future adaptive learning.

