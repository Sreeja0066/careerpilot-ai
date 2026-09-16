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