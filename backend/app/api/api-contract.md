# CareerPilot AI — Initial API Contract

## 1. Purpose

This document defines the initial REST API contract for the CareerPilot AI MVP.

The API provides the boundary between the React frontend and the FastAPI backend.

The contract defines:

- Endpoint structure
- HTTP methods
- Request format
- Response format
- Basic error format
- MVP API responsibilities

The API is designed as a versioned REST API so the frontend can evolve independently from backend implementation details.

---

## 2. API Base URL

Development:

```text
http://localhost:8000/api/v1


Production:

```text
https://<careerpilot-domain>/api/v1 ```

3. API Design Principles
REST-oriented

Resources are represented using nouns.

Example:

/profiles
/skills
/assessments
/learning-plans
JSON

Requests and responses use JSON unless explicitly documented otherwise.

Stateless HTTP requests

Each request should contain the information necessary for the backend to process it.

Persistent candidate state is stored in PostgreSQL.

Structured responses

Responses should have predictable structures so the frontend does not depend on raw database models.

Thin API layer

FastAPI routes should handle:

HTTP request validation
Authentication/authorization
Calling application services
Returning HTTP responses

Business logic belongs in the service layer.

4. Health Endpoints
GET /health

Checks whether the API process is running.

Response
{
  "status": "ok"
}
GET /db-health

Checks whether the backend can connect to PostgreSQL.

Response
{
  "database": "connected"
}

These endpoints are intended primarily for development, deployment, and infrastructure monitoring.

5. Candidate Profile API
POST /profiles

Creates a candidate profile.

Request
{
  "full_name": "Sreeja",
  "experience_level": "junior",
  "experience_summary": "Software engineer with Python and AI application experience.",
  "target_role": "AI Engineer",
  "target_company": null,
  "weekly_hours": 10
}
Response
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Sreeja",
  "experience_level": "junior",
  "experience_summary": "Software engineer with Python and AI application experience.",
  "target_role": "AI Engineer",
  "target_company": null,
  "weekly_hours": 10,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
GET /profiles/{profile_id}

Returns a candidate profile.

Response
{
  "id": "uuid",
  "user_id": "uuid",
  "full_name": "Sreeja",
  "experience_level": "junior",
  "experience_summary": "...",
  "target_role": "AI Engineer",
  "target_company": null,
  "weekly_hours": 10,
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
PATCH /profiles/{profile_id}

Updates candidate profile information.

Request

Only fields being changed need to be provided.

{
  "experience_level": "junior",
  "weekly_hours": 12
}
Response

Returns the updated profile.

6. Skills API
GET /skills

Returns the available skill catalogue.

Optional query parameters
?category=AI
Response
{
  "items": [
    {
      "id": "uuid",
      "name": "Python",
      "category": "Programming",
      "description": "Python programming language"
    },
    {
      "id": "uuid",
      "name": "SQL",
      "category": "Database",
      "description": "SQL and relational database concepts"
    }
  ]
}
GET /profiles/{profile_id}/skills

Returns the candidate's current skill state.

Response
{
  "items": [
    {
      "skill_id": "uuid",
      "skill_name": "Python",
      "proficiency_level": 7.5,
      "source": "assessment",
      "last_assessed_at": "timestamp"
    }
  ]
}
PUT /profiles/{profile_id}/skills/{skill_id}

Creates or updates the candidate's current state for a skill.

Request
{
  "proficiency_level": 6.5,
  "source": "self_reported"
}
Response
{
  "skill_id": "uuid",
  "proficiency_level": 6.5,
  "source": "self_reported"
}
7. Skill Assessment API
POST /assessments

Creates a new assessment.

Request
{
  "profile_id": "uuid",
  "skill_ids": [
    "uuid",
    "uuid"
  ]
}
Response
{
  "id": "uuid",
  "profile_id": "uuid",
  "status": "created",
  "created_at": "timestamp"
}
POST /assessments/{assessment_id}/submit

Submits assessment responses for evaluation.

Request
{
  "responses": [
    {
      "skill_id": "uuid",
      "question_id": "uuid",
      "answer": "candidate answer"
    }
  ]
}
Response
{
  "assessment_id": "uuid",
  "status": "completed",
  "overall_score": 72.5,
  "results": [
    {
      "skill_id": "uuid",
      "score": 78.0,
      "result_level": "intermediate",
      "evidence": "..."
    }
  ]
}
GET /assessments/{assessment_id}

Returns an assessment and its results.

Response
{
  "id": "uuid",
  "profile_id": "uuid",
  "status": "completed",
  "overall_score": 72.5,
  "results": [
    {
      "skill_id": "uuid",
      "score": 78.0,
      "result_level": "intermediate"
    }
  ]
}
GET /profiles/{profile_id}/assessments

Returns the candidate's assessment history.

Response
{
  "items": [
    {
      "id": "uuid",
      "status": "completed",
      "overall_score": 72.5,
      "assessed_at": "timestamp"
    }
  ]
}
8. Learning Plan API
POST /learning-plans

Creates a learning plan for a candidate.

Request
{
  "profile_id": "uuid",
  "title": "AI Engineer Preparation",
  "goal": "Prepare for an AI Engineer role",
  "start_date": "2026-09-20",
  "target_date": "2026-12-20"
}
Response
{
  "id": "uuid",
  "profile_id": "uuid",
  "title": "AI Engineer Preparation",
  "goal": "Prepare for an AI Engineer role",
  "status": "draft",
  "start_date": "2026-09-20",
  "target_date": "2026-12-20"
}
GET /learning-plans/{plan_id}

Returns a learning plan.

Response
{
  "id": "uuid",
  "profile_id": "uuid",
  "title": "AI Engineer Preparation",
  "goal": "Prepare for an AI Engineer role",
  "status": "active",
   "tasks": []
}
GET /profiles/{profile_id}/learning-plans

Returns the candidate's learning plans.

Response
{
  "items": [
    {
      "id": "uuid",
      "title": "AI Engineer Preparation",
      "status": "active"
    }
  ]
}
PATCH /learning-plans/{plan_id}

Updates the plan status or schedule.

Request
{
  "status": "active"
}
Response

Returns the updated learning plan.

9. Learning Task API
POST /learning-plans/{plan_id}/tasks

Adds a learning task to a plan.

Request
{
  "skill_id": "uuid",
  "title": "Practice SQL JOINs",
  "description": "Solve JOIN-based SQL problems",
  "task_type": "practice",
  "difficulty": 2,
  "order_index": 3
}
Response
{
  "id": "uuid",
  "learning_plan_id": "uuid",
  "skill_id": "uuid",
  "title": "Practice SQL JOINs",
  "task_type": "practice",
  "difficulty": 2,
  "status": "pending",
  "order_index": 3
}
GET /learning-plans/{plan_id}/tasks

Returns all tasks in a learning plan.

Response
{
  "items": [
    {
      "id": "uuid",
      "title": "Python Fundamentals",
      "task_type": "learn",
      "difficulty": 1,
      "status": "completed"
    }
  ]
}
PATCH /learning-tasks/{task_id}

Updates task state.

Request
{
  "status": "completed"
}
Response

Returns the updated task.

10. AI Tutor API
POST /tutor/sessions

Creates an AI tutor session.

Request
{
  "profile_id": "uuid",
  "skill_id": "uuid",
  "learning_task_id": "uuid"
}
Response
{
  "session_id": "uuid",
  "status": "active"
}
POST /tutor/sessions/{session_id}/messages

Sends a message to the AI tutor.

Request
{
  "message": "Explain Python decorators with a simple example."
}
Response
{
  "message": {
    "role": "assistant",
    "content": "..."
  },
  "session_state": {
    "skill_id": "uuid",
    "difficulty": 2
  }
}

The tutor may use the candidate's persisted skill state to adapt explanations.

The API should not expose internal prompts, hidden reasoning, or provider-specific implementation details.

11. Quiz API

The quiz API is part of the MVP product contract even though the initial database schema can be extended when quiz implementation begins.

POST /quizzes

Creates or requests a quiz for a skill.

Request
{
  "profile_id": "uuid",
  "skill_id": "uuid",
  "difficulty": 2,
  "question_count": 5
}
Response
{
  "quiz_id": "uuid",
  "skill_id": "uuid",
  "difficulty": 2,
  "questions": [
    {
      "id": "uuid",
      "question": "...",
      "question_type": "multiple_choice",
      "options": [
        "A",
        "B",
        "C",
        "D"
      ]
    }
  ]
}
POST /quizzes/{quiz_id}/submit

Submits a quiz attempt.

Request
{
  "answers": [
    {
      "question_id": "uuid",
      "answer": "B"
    }
  ]
}
Response
{
  "quiz_id": "uuid",
  "score": 80.0,
  "correct_answers": 4,
  "total_questions": 5,
  "feedback": "..."
}
12. Progress API
GET /profiles/{profile_id}/progress

Returns the candidate's current progress.

Response
{
  "overall_progress": 62.5,
  "tasks_completed": 18,
  "quiz_attempts": 12,
  "skills": [
    {
      "skill_id": "uuid",
      "skill_name": "Python",
      "proficiency_level": 7.5
    }
  ]
}
GET /profiles/{profile_id}/progress/history

Returns historical progress snapshots.

Response
{
  "items": [
    {
      "captured_at": "timestamp",
      "overall_progress": 42.0,
      "skill_gap_score": 58.0
    },
    {
      "captured_at": "timestamp",
      "overall_progress": 62.5,
      "skill_gap_score": 37.5
    }
  ]
}
13. Common Error Response

All API errors should follow a predictable structure.

Example
{
  "error": {
    "code": "PROFILE_NOT_FOUND",
    "message": "Candidate profile was not found.",
    "details": null
  }
}

Possible error codes include:

VALIDATION_ERROR
UNAUTHORIZED
FORBIDDEN
NOT_FOUND
PROFILE_NOT_FOUND
SKILL_NOT_FOUND
ASSESSMENT_NOT_FOUND
LEARNING_PLAN_NOT_FOUND
TASK_NOT_FOUND
INTERNAL_ERROR
AI_SERVICE_ERROR
DATABASE_ERROR
14. HTTP Status Codes
Status	Meaning
200	Successful request
201	Resource created
204	Successful request with no response body
400	Invalid request
401	Authentication required
403	Access denied
404	Resource not found
409	Resource conflict
422	Validation failure
500	Internal server error
502	External AI/service failure

15. API Layer vs Service Layer

The API layer should not directly contain complex AI or business logic.
Frontend
   |
   v
FastAPI Route
   |
   v
Pydantic Validation
   |
   v
Application Service
   |
   +------------------+
   |                  |
   v                  v
PostgreSQL          AI Service

Example: 
POST /assessments/{id}/submit
            |
            v
Assessment API
            |
            v
Assessment Service
            |
       +----+----+
       |         |
       v         v
   Database    Gemini
       |         |
       +----+----+
            |
            v
      Structured Result

Authentication

Authentication is part of the overall application architecture but the exact authentication provider is intentionally not fixed in this initial contract.

Once authentication is implemented:

Protected endpoints require an authenticated user.
A user may access only their own candidate data.
profile_id ownership must be verified by the backend.
The frontend must never be trusted to enforce authorization

19. API Contract Principle

The API contract should remain stable even when the internal implementation changes.

Frontend
    |
    | POST /api/v1/tutor/sessions/{id}/messages
    v
FastAPI
    |
    v
Tutor Service
    |
    +---- Gemini today
    |
    +---- LangChain later
    |
    +---- LangGraph in future

The frontend should not need to know which AI orchestration technology is being used internally.