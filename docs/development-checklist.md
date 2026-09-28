# CareerPilot AI — Development Checklist

## 1. Phase 0 — Product & Architecture

### Product
- [x] Product vision documented
- [x] MVP scope defined
- [x] MVP non-goals defined
- [x] Core user journey documented
- [x] Adaptive learning principle documented
- [x] Future product direction documented

### Architecture
- [x] High-level architecture diagram
- [x] Component responsibilities
- [x] Frontend/backend boundary
- [x] AI layer responsibilities
- [x] Database responsibilities
- [x] Future architecture evolution documented

### Data
- [x] Initial database architecture
- [x] Initial ERD/schema
- [x] Entity responsibilities
- [x] Entity relationships
- [x] Candidate state model

### API
- [x] API base path defined
- [x] Health endpoints defined
- [x] Profile API defined
- [x] Skill API defined
- [x] Assessment API defined
- [x] Learning-plan API defined
- [x] Learning-task API defined
- [x] AI tutor API defined
- [x] Quiz API defined
- [x] Progress API defined
- [x] Error response structure defined
- [x] HTTP status conventions defined
- [x] API versioning defined

### Technology
- [x] Development environment selected
- [x] Source control strategy defined
- [x] Frontend technology selected
- [x] Backend technology selected
- [x] Database technology selected
- [x] Database hosting strategy defined
- [x] AI provider selected
- [x] LLM orchestration strategy defined
- [x] Vector search strategy defined
- [x] Containerization strategy defined
- [x] Deployment strategy defined
- [x] File-storage strategy defined
- [x] Production secrets strategy defined
- [x] Cost/free-development strategy defined
- [x] Supabase removed from architecture
- [x] Modular-monolith strategy defined

---

# 2. Phase 1 — Foundation

## Cloud & Repository

- [x] Google Cloud project created
- [x] Cloud Shell configured
- [x] GitHub repository created
- [x] Repository cloned into Cloud Shell
- [x] GitHub remote verified
- [x] `.gitignore` configured
- [x] Secrets excluded from Git
- [x] `.env.example` created

## Backend Foundation

- [x] FastAPI application created
- [x] `/health` endpoint created
- [x] `/db-health` endpoint created
- [x] Environment configuration created
- [x] SQLAlchemy configured
- [x] PostgreSQL connection established
- [x] Database dependency created
- [x] Temporary database connectivity model created

## Database

- [x] Neon PostgreSQL created
- [x] Database connection tested
- [ ] Alembic configured
- [ ] MVP SQLAlchemy models implemented
- [ ] Initial migration created
- [ ] Initial migration tested
- [ ] Seed skill data created

## Frontend

- [ ] React application initialized
- [ ] TypeScript configured
- [ ] Vite configured
- [ ] Tailwind CSS configured
- [ ] shadcn/ui configured
- [ ] Frontend development server verified
- [ ] Frontend → backend connection established

## Project Structure

- [x] Backend structure created
- [x] Frontend directory created
- [x] Documentation structure created
- [ ] Final backend modules created
- [ ] Backend tests directory created
- [ ] Frontend source structure created
- [ ] Frontend tests directory created

## Containerization

- [ ] Backend Dockerfile created
- [ ] Frontend container configuration created
- [ ] Container build tested
- [ ] Application runs successfully in container

## Testing

- [ ] Pytest configured
- [ ] Database tests added
- [ ] API tests added
- [ ] Frontend tests added
- [ ] End-to-end test setup added later with Playwright

## Documentation

- [x] Product requirements
- [x] System architecture
- [x] Database design
- [x] API contract
- [x] Technology decisions
- [ ] README finalized
- [ ] Phase 1 documentation finalized

---

# 3. Phase 2 — Candidate Profile & Onboarding

- [ ] User authentication
- [ ] Candidate profile creation
- [ ] Candidate profile retrieval
- [ ] Candidate profile updates
- [ ] Career goal creation
- [ ] Target role selection
- [ ] Experience capture
- [ ] Current skill capture
- [ ] Available study-time capture
- [ ] Learning preference capture
- [ ] Basic candidate dashboard

---

# 4. Phase 3 — AI Skill Assessment

- [ ] Gemini backend integration
- [ ] Assessment question generation
- [ ] Structured assessment response schema
- [ ] Pydantic validation
- [ ] Skill extraction
- [ ] Skill-gap analysis
- [ ] Assessment result persistence
- [ ] Candidate skill-state update
- [ ] Assessment history
- [ ] Initial skill-gap report

---

# 5. Phase 4 — Personalized Learning Planner

- [ ] Learning-plan generation
- [ ] Skill prioritization
- [ ] Learning-task generation
- [ ] Task ordering
- [ ] Difficulty assignment
- [ ] Study schedule generation
- [ ] Task completion tracking
- [ ] Adaptive plan update

---

# 6. Phase 5 — AI Tutor & Quiz Engine

- [ ] AI tutor session
- [ ] Candidate-state-aware explanations
- [ ] Difficulty-aware tutoring
- [ ] Follow-up understanding checks
- [ ] Quiz generation
- [ ] Quiz submission
- [ ] Answer evaluation
- [ ] Quiz attempt persistence
- [ ] Hint tracking
- [ ] Skill-state updates
- [ ] Progress tracking

---

# 7. Future Development Phases

## Phase 6 — Coding Intelligence
- [ ] DSA practice
- [ ] SQL practice
- [ ] Attempt tracking
- [ ] Time tracking
- [ ] Progressive hints
- [ ] Complexity evaluation
- [ ] Code-quality evaluation

## Phase 7 — RAG & Resource Intelligence
- [ ] pgvector
- [ ] Embeddings
- [ ] Resource ingestion
- [ ] Semantic retrieval
- [ ] Resource ranking
- [ ] Personalized resource recommendations

## Phase 8 — Agentic Career Coach
- [ ] Stateful workflow design
- [ ] LangGraph integration
- [ ] Tool usage
- [ ] Candidate-state-aware workflow
- [ ] Adaptive replanning

## Phase 9 — AI Interview Simulator
- [ ] Technical interviews
- [ ] Behavioral interviews
- [ ] Project interviews
- [ ] DSA interviews
- [ ] SQL interviews
- [ ] System-design interviews
- [ ] Interview evaluation
- [ ] Interview history

## Phase 10 — Voice Interview Coach
- [ ] Speech-to-text
- [ ] Text-to-speech
- [ ] Voice conversation
- [ ] Communication analysis
- [ ] Filler-word analysis
- [ ] Pace analysis
- [ ] Clarity analysis

## Phase 11 — Personalized Multimodal Teaching
- [ ] Visual explanations
- [ ] Audio explanations
- [ ] Personalized diagrams
- [ ] Personalized video experiments

## Phase 12 — Productization
- [ ] Subscriptions
- [ ] Usage quotas
- [ ] Notifications/reminders
- [ ] Analytics
- [ ] Human interviewer workflows
- [ ] Commercial hardening

---

# 8. Development Rules

- [ ] Keep PostgreSQL as the source of truth for persistent candidate state.
- [ ] Keep API routes thin.
- [ ] Keep business logic in services.
- [ ] Keep AI provider calls behind backend interfaces.
- [ ] Validate structured AI output before storing it.
- [ ] Do not expose AI credentials in the frontend.
- [ ] Do not introduce microservices prematurely.
- [ ] Do not introduce agents when normal services are sufficient.
- [ ] Keep secrets outside Git.
- [ ] Keep GitHub as the source of truth.
- [ ] Add database migrations for schema changes.
- [ ] Add tests alongside meaningful functionality.
- [ ] Update documentation when architecture changes.
- [ ] Complete one meaningful milestone before adding unrelated infrastructure.