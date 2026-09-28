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

---

## 13. Database Hosting Strategy

### Decision

Use hosted PostgreSQL through Neon for the initial MVP development stage.

Use Google Cloud SQL for PostgreSQL as the planned production database when the application requires a more production-oriented Google Cloud environment.

### Reason

Neon provides a hosted PostgreSQL database that can be used during the early MVP stage without introducing Cloud SQL infrastructure costs.

The application remains PostgreSQL-based, so moving from Neon PostgreSQL to Cloud SQL PostgreSQL does not require changing the application's database model or ORM approach.

The application code should therefore depend on PostgreSQL rather than depending on provider-specific database functionality.

---

## 14. Supabase

### Decision

Supabase is not part of the core CareerPilot architecture.

### Reason

The project will keep its application architecture centered around:

```text
Frontend
   ↓
FastAPI
   ↓
Application Services
   ↓
PostgreSQL

15. AI Orchestration
Decision

Use normal application services for the initial MVP.

Use LangChain selectively when reusable LLM components provide clear value.

Introduce LangGraph later when CareerPilot requires stateful, multi-step, branching, or iterative workflows.

Reason

The MVP does not require a complex agent architecture.

The initial learning loop can be implemented using normal backend services:

Assessment
    ↓
Plan
    ↓
Teach
    ↓
Practice
    ↓
Evaluate
    ↓
Update State

LangGraph becomes useful when this workflow needs persistent orchestration, branching decisions, tool usage, retries, or multiple specialized AI steps.

Agents should not be introduced merely for the sake of using an agent framework.

16. Application Architecture
Decision

Use a modular monolith for the initial application.

Reason

The initial application will be easier to develop, understand, test, and debug as one FastAPI application with clear internal boundaries.

The backend should be organized into logical areas such as:

API
Services
AI
Database
Schemas
Core

Microservices should only be introduced when actual scale or operational requirements justify separating components.

17. Containerization
Decision

Use Docker for application packaging and reproducible environments.

Reason

Docker provides a consistent environment between development, testing, and future deployment.

The application should be able to run independently of a particular development laptop.

18. Deployment
Decision

Use Google Cloud Run as the planned application deployment platform.

Reason

Cloud Run fits the project's cloud-first direction and allows the containerized FastAPI application to be deployed without maintaining traditional servers.

The application should remain portable so it is not tightly coupled to Cloud Run-specific implementation details.

19. Persistent File Storage
Decision

Use Google Cloud Storage for persistent application files when file storage becomes part of the product.

Future use cases
Resume uploads
Job description documents
Learning resources
Audio recordings
Generated learning assets
Future video assets

Uploaded files should not be treated as the primary relational database storage mechanism.

20. Production Secrets
Decision

Use Google Secret Manager for production secrets.

Reason

Secrets such as:

Database credentials
Gemini API keys
Authentication secrets
External service credentials

must remain outside source control.

Development environments may use environment variables and local .env configuration, while production deployments should use managed secret storage.

21. AI Provider Strategy
Decision

Use Gemini as the initial LLM provider.

The application should access the LLM through the backend rather than directly from the browser.

Reason

Keeping the LLM integration behind a backend service:

Protects API credentials
Keeps prompts and provider logic centralized
Allows structured output validation
Makes future provider changes easier

The architecture should allow additional or replacement model providers later.

22. Vector Search
Decision

Use PostgreSQL with pgvector for future vector retrieval requirements.

Do not introduce a separate vector database for the MVP.

Reason

CareerPilot already depends on PostgreSQL for relational candidate state.

Using pgvector later allows relational candidate data and vector-based retrieval to coexist within the same database technology.

Vector search will be introduced when RAG and learning-resource intelligence are implemented.

23. Model Experimentation
Decision

Use Google Colab for isolated AI/ML/RAG experimentation when appropriate.

Colab experiments should not become a dependency of the production application.

Reason

Experiments may include:

Embedding evaluation
Retrieval experiments
Model comparisons
Fine-tuning experiments
Prompt experiments
RAG experiments

Production application logic should remain inside the CareerPilot repository and backend architecture.

24. Development Cost Strategy
Decision

Keep the initial development environment within free or no-cost resources wherever practical.

Google Cloud billing should not be enabled merely to build the early MVP unless a feature specifically requires a paid service.

Reason

The initial goal is to validate the product and build a functional portfolio-quality MVP before introducing unnecessary infrastructure costs.

The architecture should therefore distinguish between:

MVP / low-cost development
        ↓
Production infrastructure

The future production architecture may use paid Google Cloud resources when justified by actual usage and product requirements.

25. Source of Truth
Decision

GitHub is the permanent source of truth for the project.

Repository:

https://github.com/Sreeja0066/careerpilot-ai
Reason

The development environment may change between:

Google Cloud Shell
        ↓
Google Cloud Workstations
        ↓
Other development environments

The project should remain reproducible from the GitHub repository.

Secrets and runtime data must remain outside the repository.

26. Final Technology Direction
SOURCE CONTROL
GitHub

DEVELOPMENT
Google Cloud Shell initially
        ↓
Cloud Workstations later when needed

FRONTEND
React + TypeScript
Vite
Tailwind CSS
shadcn/ui

BACKEND
Python
FastAPI
Pydantic
SQLAlchemy
Alembic

DATABASE
PostgreSQL
        ↓
Neon for MVP
        ↓
Cloud SQL PostgreSQL later

AI
Gemini initially

LLM COMPONENTS
LangChain where useful

AGENT ORCHESTRATION
LangGraph later

VECTOR SEARCH
pgvector later

CONTAINERIZATION
Docker

DEPLOYMENT
Cloud Run

FILE STORAGE
Cloud Storage later

SECRETS
Secret Manager later

EXPERIMENTATION
Google Colab

SOURCE OF TRUTH
GitHub
27. Technology Decision Principle

Technology choices should support the product architecture rather than define the product architecture.

CareerPilot should remain:

Modular
Cloud-first
PostgreSQL-centered
Provider-flexible where practical
Simple during the MVP
Extensible for future AI capabilities

New infrastructure or frameworks should be introduced when they solve a real product or engineering problem.