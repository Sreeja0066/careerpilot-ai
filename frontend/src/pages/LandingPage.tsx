import "../App.css";

function LandingPage() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">CareerPilot AI</div>

        <nav className="nav-links">
          <a href="#features">Features</a>
          <a href="#how-it-works">How it works</a>
          <button className="nav-button">Get Started</button>
        </nav>
      </header>

      <main>
        <section className="hero">
          <div className="hero-content">
            <span className="eyebrow">ADAPTIVE AI CAREER PREPARATION</span>

            <h1>
              Prepare smarter.
              <br />
              <span>Improve continuously.</span>
            </h1>

            <p className="hero-description">
              CareerPilot AI helps you understand your skill gaps, build a
              personalized learning plan, practice with an AI tutor, and
              continuously adapt your preparation based on your progress.
            </p>

            <div className="hero-actions">
              <button className="primary-button">Start your journey</button>
              <a href="#how-it-works" className="secondary-button">
                See how it works
              </a>
            </div>
          </div>

          <div className="hero-card">
            <div className="card-header">
              <span>Candidate Progress</span>
              <span className="status">● Active</span>
            </div>

            <div className="progress-section">
              <div className="progress-label">
                <span>Interview readiness</span>
                <strong>68%</strong>
              </div>

              <div className="progress-bar">
                <div className="progress-fill" />
              </div>
            </div>

            <div className="skill-grid">
              <div className="skill-card">
                <span>Python</span>
                <strong>82%</strong>
              </div>

              <div className="skill-card">
                <span>SQL</span>
                <strong>61%</strong>
              </div>

              <div className="skill-card">
                <span>AI / LLM</span>
                <strong>76%</strong>
              </div>

              <div className="skill-card">
                <span>System Design</span>
                <strong>48%</strong>
              </div>
            </div>

            <div className="next-step">
              <span className="next-step-label">Next recommended activity</span>
              <strong>Practice SQL JOINs</strong>
              <span className="next-step-meta">20 min · Intermediate</span>
            </div>
          </div>
        </section>

        <section className="section" id="features">
          <div className="section-heading">
            <span className="eyebrow">WHY CAREERPILOT</span>
            <h2>More than an AI chatbot.</h2>
            <p>
              CareerPilot remembers your preparation journey and uses your
              learning evidence to decide what you should work on next.
            </p>
          </div>

          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-number">01</div>
              <h3>Understand your gaps</h3>
              <p>
                Assess your current skills against your target role and
                identify the areas that need attention.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">02</div>
              <h3>Learn with a plan</h3>
              <p>
                Turn skill gaps into a personalized sequence of topics,
                practice tasks, quizzes, and study sessions.
              </p>
            </article>

            <article className="feature-card">
              <div className="feature-number">03</div>
              <h3>Adapt as you improve</h3>
              <p>
                Your performance becomes evidence that updates your skill
                state and changes what you should practice next.
              </p>
            </article>
          </div>
        </section>

        <section className="section workflow-section" id="how-it-works">
          <div className="section-heading">
            <span className="eyebrow">THE LEARNING LOOP</span>
            <h2>Your preparation evolves with you.</h2>
          </div>

          <div className="workflow">
            <div className="workflow-step">
              <span>01</span>
              <strong>Assess</strong>
              <p>Understand your current skill level.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <span>02</span>
              <strong>Plan</strong>
              <p>Build a personalized preparation path.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <span>03</span>
              <strong>Learn</strong>
              <p>Study with level-aware AI tutoring.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <span>04</span>
              <strong>Practice</strong>
              <p>Test what you actually know.</p>
            </div>

            <div className="workflow-arrow">→</div>

            <div className="workflow-step">
              <span>05</span>
              <strong>Adapt</strong>
              <p>Use performance to decide what comes next.</p>
            </div>
          </div>
        </section>

        <section className="cta-section">
          <div>
            <span className="eyebrow">CAREERPILOT AI</span>
            <h2>Build skills with a system that remembers.</h2>
            <p>
              From your first assessment to interview preparation, every step
              contributes to your evolving candidate profile.
            </p>
          </div>

          <button className="primary-button">Start preparing</button>
        </section>
      </main>

      <footer className="footer">
        <span>CareerPilot AI</span>
        <span>Adaptive AI Career & Interview Preparation</span>
      </footer>
    </div>
  );
}

export default LandingPage;