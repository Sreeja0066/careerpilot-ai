# CareerPilot AI — Technology Decisions

## 1. Purpose

This document records the major technology choices for CareerPilot AI and the reasoning behind them.

Technology will be introduced based on actual product requirements rather than complexity for its own sake.

---

## 2. Development Environment

### Decision

Use Google Cloud Shell and Cloud Shell Editor as the primary development environment during the initial development phase.

### Reason

- Code is accessible from different laptops.
- Development environment is cloud-based.
- GitHub provides version control.
- Reduces dependency on a single local machine.
- Google Cloud will eventually be used for deployment.

---

## 3. Source Control

### Decision

Use GitHub as the source-control platform.

Repository:

`Sreeja0066/careerpilot-ai`

### Reason

- Version control.
- Portfolio visibility.
- Collaboration.
- Issue tracking.
- CI/CD integration.
- Demonstration of engineering practices.

---

## 4. Frontend

### Decision

Use:

- React.js
- TypeScript
- Vite
- Tailwind CSS

### Reason

React provides a strong ecosystem for building interactive web applications.

TypeScript improves maintainability and reduces runtime errors.

Vite provides a lightweight development experience.

Tailwind CSS allows rapid UI development without spending excessive time on custom styling.

---

## 5. Backend

### Decision

Use Python with FastAPI.

### Reason

Python aligns strongly with the AI ecosystem and allows the backend and AI development to use the same primary language.

FastAPI provides:

- High-performance APIs.
- Automatic OpenAPI documentation.
- Pydantic integration.
- Async support.
- Strong Python ecosystem compatibility.

---

## 6. Data Validation

### Decision

Use Pydantic.

### Reason

Pydantic provides structured validation for:

- API requests.
- API responses.
- AI-generated structured outputs.
- Configuration.

This is particularly useful because LLM responses should not be trusted as arbitrary unstructured application data.

---

## 7. ORM

### Decision

Use SQLAlchemy.

### Reason

SQLAlchemy provides a mature Python ORM and database abstraction layer.

It will allow the application to interact with PostgreSQL without coupling business logic directly to SQL queries.

---

## 8. Database Migrations

### Decision

Use Alembic.

### Reason

CareerPilot's database schema will evolve throughout development.

Alembic will allow us to:

- Create migrations.
- Track schema changes.
- Upgrade databases.
- Roll back changes when required.

---

## 9. Primary Database

### Decision

Use PostgreSQL.

### Reason

CareerPilot contains significant structured relational data:

- Users.
- Candidate profiles.
- Skills.
- Assessments.
- Learning plans.
- Learning tasks.
- Coding attempts.
- Interview sessions.

PostgreSQL is mature, reliable, relational, and well supported by the Python ecosystem.

It also provides an extension ecosystem that allows us to add vector search without immediately introducing a separate vector database.

---

## 10. Vector Search

### Decision

Use pgvector with PostgreSQL when semantic retrieval becomes necessary.

### Reason

The MVP does not need a dedicated vector database.

Using pgvector initially:

- Reduces infrastructure complexity.
- Reduces operational overhead.
- Keeps structured and vector data close together.
- Allows the project to scale the architecture later if required.

A dedicated vector database may be evaluated only if real scale or retrieval requirements justify it.

---

## 11. Initial LLM

### Decision

Use Google's Gemini API for the initial AI functionality.

### Reason

The developer already has access to Gemini services and Google Cloud infrastructure.

Gemini will initially support:

- AI tutoring.
- Skill-gap analysis.
- Learning-plan generation.
- Quiz generation.
- Answer evaluation.
- Interview question generation.

The LLM will be accessed from the backend.

API credentials will never be exposed in the frontend.

---

## 12. Structured LLM Output

AI responses that are consumed by application logic should use structured schemas wherever practical.

Example:

```text
LLM
 ↓
Structured response
 ↓
Pydantic validation
 ↓
Application logic
 ↓
PostgreSQL