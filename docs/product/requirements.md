# CareerPilot AI — Product Requirements

## 1. Product Overview

CareerPilot AI is an adaptive AI-powered career and interview preparation platform.

The goal is to provide a persistent AI tutor, career guide, practice coach, and eventually an AI interviewer that adapts to each candidate's demonstrated skills and learning progress.

CareerPilot is not intended to be only a chatbot or mock interview application. Its core capability is maintaining a candidate state and using learning evidence to continuously adapt the candidate's preparation journey.

---

## 2. Target Users

CareerPilot is designed for:

- Freshers preparing for placements and entry-level roles.
- Early-career professionals preparing for a role change.
- Experienced professionals preparing for specific roles or companies.
- Candidates preparing for technical, coding, SQL, system-design, project, behavioral, and HR interviews.

---

## 3. Core User Journey

The initial user journey is:

1. User creates a profile.
2. User specifies their target role.
3. User provides experience and current skill information.
4. User optionally provides a resume and job description.
5. CareerPilot performs an initial skill assessment.
6. CareerPilot identifies knowledge and skill gaps.
7. CareerPilot generates a personalized learning plan.
8. User studies using the AI tutor.
9. User completes quizzes and practice tasks.
10. CareerPilot evaluates performance.
11. Candidate state is updated.
12. The learning plan adapts based on new evidence.
13. The candidate eventually practices simulated interviews.
14. CareerPilot measures interview readiness.

---

## 4. MVP Features

The MVP will include:

### 4.1 Candidate Profile

The system should store:

- Target role.
- Experience level.
- Career goal.
- Current skills.
- Target skills.
- Available study time.
- Learning preferences.

### 4.2 Skill Assessment

CareerPilot should:

- Assess the candidate's current knowledge.
- Identify strengths.
- Identify weaknesses.
- Identify missing prerequisites.
- Produce structured skill information.
- Generate an understandable skill-gap report.

### 4.3 Personalized Learning Plan

The system should generate:

- Topics to learn.
- Topic priority.
- Learning tasks.
- Practice tasks.
- Suggested sequence.
- Study schedule.

The plan should be adaptable based on subsequent performance.

### 4.4 AI Tutor

The tutor should:

- Answer candidate questions.
- Explain concepts according to the candidate's level.
- Use simple examples when required.
- Use analogies where useful.
- Explain concepts step-by-step.
- Ask follow-up questions to verify understanding.
- Avoid unnecessarily giving complete solutions.

### 4.5 Quiz System

The system should:

- Generate topic-based quizzes.
- Record attempts.
- Evaluate answers.
- Identify weak areas.
- Update candidate skill evidence.

### 4.6 Progress Tracking

CareerPilot should maintain:

- Learning history.
- Quiz performance.
- Skill progression.
- Completed tasks.
- Weak areas.
- Improvement trends.

---

## 5. Adaptive Learning Principle

CareerPilot should evaluate learning based on evidence rather than only self-reported ability.

Example:

A candidate solves an Easy coding problem correctly but requires one hour and several hints.

The system should consider:

- Problem difficulty.
- Time taken.
- Number of attempts.
- Number of hints.
- Correctness.
- Time complexity.
- Space complexity.
- Code quality where applicable.

The result should influence future recommendations.

The system should not immediately provide the complete solution when guided problem-solving would better support learning.

---

## 6. Progressive Coding Assistance

For coding problems, CareerPilot should prefer:

1. Clarifying the problem.
2. Giving a conceptual hint.
3. Giving an approach hint.
4. Giving pseudocode-level guidance.
5. Giving stronger guidance if necessary.
6. Providing the complete solution only when appropriate.

The objective is skill development rather than answer generation.

---

## 7. Project Interview Coaching

CareerPilot should help candidates improve answers about their real projects.

The system should evaluate:

- Problem explanation.
- Candidate's personal contribution.
- Technical approach.
- Technology decisions.
- Challenges.
- Problem-solving.
- Results.
- Technical depth.
- Clarity.
- Conciseness.

When improving an answer, CareerPilot should:

- Explain what is weak or missing.
- Provide a natural example answer.
- Use simple human-understandable language.
- Avoid inventing technologies, responsibilities, metrics, or achievements.
- Ask the candidate to answer again in their own words.

---

## 8. Adaptive Explanation

CareerPilot should eventually determine how a candidate best understands a concept.

Possible explanation formats include:

- Text.
- Example.
- Analogy.
- Diagram.
- Interactive example.
- Audio.
- Personalized video.

The system should not automatically use complex multimedia when a simple explanation is sufficient.

---

## 9. Technical Preparation

Preparation should eventually be customized to the candidate's target role.

Possible technical areas include:

- Python.
- Data Structures and Algorithms.
- SQL.
- Backend development.
- APIs.
- Databases.
- System design.
- AI/ML.
- LLM applications.
- RAG.
- Agentic AI.
- Cloud.
- Role-specific technologies.

The system should not force irrelevant topics onto a candidate.

---

## 10. Future Interview Simulation

Future versions should support:

- Technical interviews.
- Coding interviews.
- SQL interviews.
- Project interviews.
- Behavioral interviews.
- HR interviews.
- System-design interviews.

The AI interviewer should ask follow-up questions based on the candidate's previous response rather than following only a fixed question list.

---

## 11. Communication Coaching

Future versions should evaluate communication characteristics such as:

- Clarity.
- Structure.
- Conciseness.
- Pace.
- Pauses.
- Filler words.
- Relevance.
- Confidence indicators.

Feedback should be actionable and focused on improvement.

---

## 12. Voice AI

Future versions may support:

- Speech-to-text.
- Real-time conversational interviews.
- Text-to-speech.
- Voice-based tutoring.
- Voice-based interview simulation.
- Communication feedback.

---

## 13. Learning Resources

CareerPilot should eventually identify relevant public learning resources based on:

- Candidate question.
- Target skill.
- Knowledge gap.
- Candidate level.
- Learning preference.

Potential resources include:

- YouTube videos.
- Documentation.
- Articles.
- Tutorials.
- Open-source projects.

Resources should be ranked for relevance rather than simply returning search results.

---

## 14. Candidate State

The system should maintain a persistent candidate state containing:

- Career goals.
- Skills.
- Skill levels.
- Assessment results.
- Learning plans.
- Learning tasks.
- Quiz attempts.
- Coding attempts.
- Interview performance.
- Communication feedback.
- Learning history.

This state forms the foundation of CareerPilot's adaptive behavior.

---

## 15. MVP Non-Goals

The following will NOT be implemented in the initial MVP:

- Real-time voice interviews.
- Personalized AI-generated videos.
- Human interviewer marketplace.
- Subscription billing.
- Mobile application.
- Complex multi-agent architecture.
- Advanced coding execution infrastructure.
- Graph RAG.
- AI avatars.
- Large-scale production infrastructure.

These capabilities may be introduced in later phases.

---

## 16. Product Principles

CareerPilot should follow these principles:

1. Build for learning, not answer generation.
2. Adapt to demonstrated ability.
3. Prefer evidence over assumptions.
4. Never invent candidate achievements.
5. Give progressive guidance for coding problems.
6. Keep AI decisions explainable where practical.
7. Store important candidate state persistently.
8. Use the simplest architecture that solves the current problem.
9. Introduce advanced AI technologies when they provide real product value.
10. Validate the product with real users before scaling infrastructure.

---

## 17. Success Criteria

The MVP should allow a candidate to:

- Create a career profile.
- Identify their target role.
- Complete an initial assessment.
- Receive a skill-gap report.
- Receive a personalized learning plan.
- Ask the AI tutor questions.
- Complete quizzes.
- See their progress.
- Receive updated recommendations based on performance.

The MVP is successful when real users can complete this journey and find the recommendations useful enough to continue using the platform.
