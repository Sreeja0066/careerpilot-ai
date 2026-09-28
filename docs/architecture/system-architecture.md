# CareerPilot AI — System Architecture

## 1. Architecture Overview

CareerPilot AI is designed as a modular, cloud-first AI application.

The architecture separates:

- User interface
- Application/API layer
- AI orchestration
- Persistent data
- Retrieval and learning resources
- Evaluation
- Background processing
- External AI services

The initial MVP will use a relatively simple architecture. Advanced capabilities such as agentic workflows, voice interaction, multimodal learning, coding evaluation, and human interviewers will be introduced incrementally.

---

## 2. High-Level Architecture

```text
                         CareerPilot AI
                              |
                     +--------+--------+
                     |                 |
                 Frontend           Backend
                  React            FastAPI
                     |                 |
                     |          +------+------+
                     |          |             |
                     |       Application    AI Layer
                     |       Services       |
                     |                       |
                     |                    Gemini
                     |                       |
                     |              Future AI Orchestration
                     |                 LangGraph
                     |
                     +-----------------------+
                              |
                       PostgreSQL
                              |
                    +---------+---------+
                    |                   |
                 User Data          Learning Data
                    |
                 pgvector
                    |
             Semantic Retrieval
                    |
          Learning Resources / RAG

## 3. Component Responsibilities

### 3.1 Frontend

Technology:
- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

Responsibilities:
- User registration and profile setup
- Target role and career goal selection
- Resume and job description input
- Skill assessment interface
- Learning plan display
- AI tutor conversation interface
- Quiz and practice interfaces
- Progress and learning history visualization
- Future interview simulation and voice interfaces

The frontend is responsible for presentation and user interaction. Business logic and persistent state management remain in the backend.

---

### 3.2 API Layer

Technology:
- FastAPI
- Pydantic

Responsibilities:
- Expose REST API endpoints
- Validate incoming requests
- Authenticate and authorize users
- Route requests to application services
- Return structured API responses
- Handle API-level errors
- Provide health and system status endpoints

The API layer should remain thin and should not contain large amounts of business logic.

---

### 3.3 Application Service Layer

Responsibilities:
- Implement application and business workflows
- Coordinate database operations
- Coordinate AI operations
- Manage candidate profile updates
- Manage assessments
- Generate and update learning plans
- Record learning sessions and progress
- Apply adaptive learning rules
- Coordinate future interview workflows

This layer acts as the main orchestration point between the API, database, and AI components.

---

### 3.4 AI Layer

Initial technology:
- Gemini

Responsibilities:
- Generate explanations
- Analyze candidate responses
- Perform skill assessment reasoning
- Generate personalized learning content
- Generate quizzes and practice questions
- Provide feedback
- Analyze interview responses
- Support adaptive learning decisions

The AI layer should not be treated as the source of truth for persistent candidate data. Candidate state is stored in PostgreSQL.

---

### 3.5 AI Orchestration Layer

Initial MVP:
- Simple application-service-based orchestration

Future:
- LangChain
- LangGraph
- Agentic workflows

Responsibilities:
- Coordinate multi-step AI workflows
- Manage state between AI steps
- Invoke tools when required
- Route tasks to specialized AI components
- Support future multi-agent workflows

Advanced orchestration will be introduced only when the product requires multi-step or stateful workflows.

---

### 3.6 PostgreSQL Database

Initial technology:
- PostgreSQL
- Neon PostgreSQL for MVP

Responsibilities:
- Store user accounts
- Store candidate profiles
- Store career goals
- Store skills and skill assessments
- Store learning plans and learning tasks
- Store quiz attempts
- Store learning sessions
- Store progress history
- Store interview and evaluation data in future phases

PostgreSQL is the persistent source of truth for candidate state and application data.

---

### 3.7 Vector Retrieval Layer

Technology:
- pgvector

Responsibilities:
- Store vector embeddings
- Support semantic similarity search
- Retrieve relevant learning resources
- Support future RAG workflows
- Enable semantic matching between candidate needs and learning content

Vector retrieval will be introduced when resource intelligence and RAG functionality are implemented.

---

### 3.8 Learning Resource Layer

Responsibilities:
- Store or reference learning resources
- Organize resources by skill and topic
- Support resource recommendations
- Provide resources to the adaptive learning system
- Support future automated resource discovery

Examples of future resources:
- Documentation
- Tutorials
- Articles
- Videos
- Courses
- Practice problems

---

### 3.9 Adaptive Learning Engine

Responsibilities:
- Track candidate learning state
- Identify skill gaps
- Adjust learning difficulty
- Determine what the candidate should practice next
- Update learning plans based on performance
- Consider factors beyond correctness

Future evaluation signals may include:
- Accuracy
- Difficulty
- Completion time
- Attempts
- Hints requested
- Code complexity
- Code quality
- Interview response quality

---

### 3.10 Evaluation Layer

Responsibilities:
- Evaluate quiz responses
- Evaluate coding solutions in future phases
- Evaluate technical interview responses
- Evaluate behavioral/project interview responses
- Measure communication quality
- Generate structured feedback
- Update candidate progress

Evaluation results should be stored as structured candidate data rather than remaining only inside an LLM conversation.

---

### 3.11 Background Processing

Future responsibilities:
- Resource ingestion
- Embedding generation
- Document processing
- Long-running AI workflows
- Progress calculations
- Scheduled processing tasks

Background workers will be introduced when synchronous API processing is no longer appropriate.

---

### 3.12 External AI and Platform Services

Potential external services include:
- Gemini API
- Google Cloud
- Neon PostgreSQL
- Cloud Storage
- Future speech and multimodal AI services

External services should be accessed through well-defined application boundaries so they can be replaced or upgraded without redesigning the entire system.

---

## 4. Architecture Evolution

The architecture will evolve gradually.

### MVP

```text
React
   |
FastAPI
   |
Application Services
   |
Gemini + PostgreSQL

RAG-enabled system-----> 

React
   |
FastAPI
   |
Application Services
   |
AI Layer
   |
Gemini + pgvector
   |
Learning Resources


Agentic system ----->

React
   |
FastAPI
   |
Application Services
   |
LangGraph / Agentic Workflows
   |
+------------+-------------+
|            |             |
Assessment   Tutor      Resource
Agent       Agent        Agent
   |            |             |
        PostgreSQL + pgvector