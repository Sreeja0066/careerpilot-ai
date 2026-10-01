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

export default function DashboardPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      const token = sessionStorage.getItem(
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
            fetch(`${API_BASE_URL}/profile`, {
              headers,
            }),
            fetch(`${API_BASE_URL}/skills`, {
              headers,
            }),
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
          Loading your dashboard...
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

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">

        <header className="dashboard-header">
          <div>
            <span className="dashboard-badge">
              CAREERPILOT AI
            </span>

            <h1>
              Welcome back,{" "}
              {profile?.full_name || "there"} 👋
            </h1>

            <p>
              Here's a snapshot of your current
              career preparation journey.
            </p>
          </div>
        </header>

        <section className="dashboard-grid">

          <div className="dashboard-card">
            <span className="dashboard-card-label">
              TARGET ROLE
            </span>

            <h2>
              {profile?.target_role || "Not set"}
            </h2>

            <p>
              Your current career target
            </p>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-card-label">
              EXPERIENCE
            </span>

            <h2>
              {profile?.experience_level || "Not set"}
            </h2>

            <p>
              Current experience level
            </p>
          </div>

          <div className="dashboard-card">
            <span className="dashboard-card-label">
              WEEKLY LEARNING
            </span>

            <h2>
              {profile?.weekly_hours
                ? `${profile.weekly_hours} hrs`
                : "Not set"}
            </h2>

            <p>
              Your planned learning time
            </p>
          </div>

        </section>

        <section className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-section-label">
                YOUR SKILLS
              </span>

              <h2>Current skills</h2>

              <p>
                Skills you've added to your
                CareerPilot profile.
              </p>
            </div>
          </div>

          {skills.length > 0 ? (
            <div className="dashboard-skills">
              {skills.map((skill) => (
                <div
                  className="dashboard-skill"
                  key={skill.id}
                >
                  <div>
                    <h3>{skill.skill_name}</h3>

                    {skill.category && (
                      <span>
                        {skill.category}
                      </span>
                    )}
                  </div>

                  <strong>
                    {skill.self_assessed_level ||
                      "Not assessed"}
                  </strong>
                </div>
              ))}
            </div>
          ) : (
            <div className="dashboard-empty">
              No skills added yet.
            </div>
          )}
        </section>

        <section className="dashboard-section">

          <div className="dashboard-section-header">
            <div>
              <span className="dashboard-section-label">
                PHASE 1
              </span>

              <h2>CareerPilot Foundation</h2>

              <p>
                Your foundation is ready. AI-powered
                assessment comes next.
              </p>
            </div>
          </div>

          <div className="dashboard-progress">
            <div className="dashboard-progress-item">
              <span className="progress-check">
                ✓
              </span>

              <span>Account</span>
            </div>

            <div className="dashboard-progress-item">
              <span className="progress-check">
                ✓
              </span>

              <span>Profile</span>
            </div>

            <div className="dashboard-progress-item">
              <span className="progress-check">
                ✓
              </span>

              <span>Skills</span>
            </div>

            <div className="dashboard-progress-item upcoming">
              <span className="progress-dot">
                →
              </span>

              <span>
                AI Career Assessment
              </span>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}