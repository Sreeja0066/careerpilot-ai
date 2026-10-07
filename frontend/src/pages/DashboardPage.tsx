import {
  ArrowRight,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  Code2,
  Database,
  GraduationCap,
  History,
  Brain,
  Target,
} from "lucide-react";
import { useEffect, useState } from "react";

type Profile = {
  full_name: string;
  experience_level: string | null;
  target_role: string | null;
  weekly_hours: number | null;
};

type Skill = {
  id: string;
  skill_name: string;
  category: string | null;
  self_assessed_level: string | null;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function getSkillIcon(skillName: string) {
  const name = skillName.toLowerCase();

  if (name.includes("python")) return Code2;
  if (name.includes("fastapi")) return BriefcaseBusiness;
  if (name.includes("sql") || name.includes("database")) {
    return Database;
  }
  if (
    name.includes("llm") ||
    name.includes("genai") ||
    name.includes("ai")
  ) {
    return Brain;
  }

  return GraduationCap;
}

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const token = localStorage.getItem(
        "careerpilot_access_token",
      );

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const headers = {
          "X-CareerPilot-Token": token,
        };

        const [profileResponse, skillsResponse] =
          await Promise.all([
            fetch(`${API_BASE_URL}/profile`, { headers }),
            fetch(`${API_BASE_URL}/skills`, { headers }),
          ]);

        if (!profileResponse.ok) {
          const data = await profileResponse
            .json()
            .catch(() => null);

          throw new Error(
            data?.detail || "Failed to load profile",
          );
        }

        if (!skillsResponse.ok) {
          const data = await skillsResponse
            .json()
            .catch(() => null);

          throw new Error(
            data?.detail || "Failed to load skills",
          );
        }

        const profileData: Profile =
          await profileResponse.json();

        const skillsData: Skill[] =
          await skillsResponse.json();

        setProfile(profileData);
        setSkills(skillsData);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load dashboard.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-loading">
          Loading your career workspace...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-error">
          {error}
        </div>
      </div>
    );
  }

  const displaySkills = skills.slice(0, 6);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        {/* =================================================
            EDITORIAL MASTHEAD
        ================================================= */}

        <header className="dashboard-masthead">
          <div className="dashboard-masthead-meta">
            <span className="dashboard-intelligence">
              <span className="dashboard-status-dot" />
              CareerPilot Intelligence
            </span>

            <span className="dashboard-edition">
              Career workspace
            </span>
          </div>

          <h1>
            Welcome back,{" "}
            {profile?.full_name || "there"}{" "}
            <span className="dashboard-wave">👋</span>
          </h1>

          <p>
            Here’s a snapshot of your current career
            preparation journey.
          </p>
        </header>


        {/* =================================================
            METRIC STRIP
        ================================================= */}

        <section className="dashboard-metric-strip">

          <div className="dashboard-metric">
            <div className="dashboard-metric-top">
              <span>Target role</span>
              <Target size={15} />
            </div>

            <strong>
              {profile?.target_role || "Not set"}
            </strong>

            <small>
              Your current career target
            </small>
          </div>

          <div className="dashboard-metric">
            <div className="dashboard-metric-top">
              <span>Experience</span>
              <History size={15} />
            </div>

            <strong>
              {profile?.experience_level || "Not set"}
            </strong>

            <small>
              Current experience level
            </small>
          </div>

          <div className="dashboard-metric">
            <div className="dashboard-metric-top">
              <span>Weekly learning</span>
              <Clock3 size={15} />
            </div>

            <strong>
              {profile?.weekly_hours
                ? `${profile.weekly_hours} hrs`
                : "Not set"}
            </strong>

            <small>
              Your planned learning time
            </small>
          </div>

        </section>


        {/* =================================================
            NEXT STEP
        ================================================= */}

        <section className="dashboard-next-step">

          <div className="dashboard-next-step-content">
            <div className="dashboard-section-eyebrow">
              YOUR NEXT STEP
            </div>

            <h2>
              Complete your AI skill assessment
            </h2>

            <p>
              Take the assessment to identify your
              current strengths and gaps and receive
              personalized learning recommendations.
            </p>

            <div className="dashboard-next-step-meta">
              <span>
                <Clock3 size={14} />
                Takes approximately 12 minutes
              </span>

              <button
                type="button"
                className="dashboard-primary-action"
                disabled
              >
                <span>Start Assessment</span>
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

        </section>


        {/* =================================================
            SKILLS
        ================================================= */}

        <section className="dashboard-content-section">

          <div className="dashboard-section-heading">

            <div>
              <span className="dashboard-section-eyebrow">
                YOUR SKILLS
              </span>

              <h2>Current skills</h2>

              <p>
                Skills you’ve added to your
                CareerPilot profile.
              </p>
            </div>

            <span className="dashboard-count">
              {skills.length}{" "}
              {skills.length === 1 ? "skill" : "skills"}
            </span>

          </div>

          {displaySkills.length > 0 ? (
            <div className="dashboard-skill-list">
              {displaySkills.map((skill) => {
                const Icon = getSkillIcon(
                  skill.skill_name,
                );

                return (
                  <div
                    className="dashboard-skill-row"
                    key={skill.id}
                  >
                    <div className="dashboard-skill-info">

                      <div className="dashboard-skill-icon">
                        <Icon size={16} />
                      </div>

                      <div className="dashboard-skill-copy">
                        <strong>
                          {skill.skill_name}
                        </strong>

                        <span>
                          {skill.category ||
                            "Career skill"}
                        </span>
                      </div>

                    </div>

                    <span className="dashboard-skill-level">
                      {skill.self_assessed_level ||
                        "Not assessed"}
                    </span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="dashboard-empty">
              No skills added yet.
            </div>
          )}

          {skills.length > 6 && (
            <div className="dashboard-section-footer">
              <button
                type="button"
                className="dashboard-text-action"
                disabled
              >
                Manage all skills
                <ArrowRight size={14} />
              </button>
            </div>
          )}

        </section>


        {/* =================================================
            PROGRESS
        ================================================= */}

        <section className="dashboard-content-section">

          <div className="dashboard-progress-header">

            <div>
              <span className="dashboard-section-eyebrow">
                CAREER READINESS
              </span>

              <h2>Overall progress</h2>

              <p>
                Track your journey toward interview
                readiness.
              </p>
            </div>

            <strong className="dashboard-progress-value">
              68%
            </strong>

          </div>

          <div className="dashboard-progress-track">
            <div
              className="dashboard-progress-fill"
              style={{ width: "68%" }}
            />
          </div>

          <div className="dashboard-progress-list">

            <div className="dashboard-progress-row">
              <div>
                <CheckCircle2 size={17} />
                <span>Profile setup</span>
              </div>

              <span className="dashboard-progress-status completed">
                Completed
              </span>
            </div>

            <div className="dashboard-progress-row">
              <div>
                <CheckCircle2 size={17} />
                <span>Skills added</span>
              </div>

              <span className="dashboard-progress-status completed">
                Completed
              </span>
            </div>

            <div className="dashboard-progress-row">
              <div>
                <Clock3 size={17} />
                <span>Learning path</span>
              </div>

              <span className="dashboard-progress-status active">
                In progress
              </span>
            </div>

            <div className="dashboard-progress-row">
              <div>
                <Clock3 size={17} />
                <span>Interview preparation</span>
              </div>

              <span className="dashboard-progress-status pending">
                Pending
              </span>
            </div>

          </div>

        </section>

      </div>
    </div>
  );
}