import { FormEvent, useEffect, useState } from "react";

type Profile = {
  id: string;
  user_id: string;
  full_name: string;
  experience_level: string | null;
  experience_summary: string | null;
  target_role: string | null;
  target_company: string | null;
  weekly_hours: number | null;
  created_at: string;
  updated_at: string;
};

type Skill = {
  id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  self_assessed_level: string | null;
  created_at: string;
  updated_at: string;
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function OnboardingPage() {
  const [form, setForm] = useState({
    full_name: "",
    experience_level: "",
    experience_summary: "",
    target_role: "",
    target_company: "",
    weekly_hours: "",
  });

  const [profileExists, setProfileExists] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [skills, setSkills] = useState<Skill[]>([]);
  const [skillName, setSkillName] = useState("");
  const [skillCategory, setSkillCategory] = useState("");
  const [skillLevel, setSkillLevel] = useState("");
  const [skillLoading, setSkillLoading] = useState(false);
  const [skillError, setSkillError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      const token = sessionStorage.getItem("careerpilot_access_token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        // --------------------------------
        // Load profile
        // --------------------------------

        const profileResponse = await fetch(
          `${API_BASE_URL}/profile`,
          {
            headers: {
              "X-CareerPilot-Token": token,
            },
          },
        );

        if (profileResponse.status === 404) {
          setProfileExists(false);
        } else if (!profileResponse.ok) {
          const data = await profileResponse.json().catch(() => null);

          throw new Error(
            data?.detail || "Failed to load profile",
          );
        } else {
          const profile: Profile =
            await profileResponse.json();

          setForm({
            full_name: profile.full_name ?? "",
            experience_level:
              profile.experience_level ?? "",
            experience_summary:
              profile.experience_summary ?? "",
            target_role: profile.target_role ?? "",
            target_company:
              profile.target_company ?? "",
            weekly_hours:
              profile.weekly_hours !== null
                ? String(profile.weekly_hours)
                : "",
          });

          setProfileExists(true);
        }

        // --------------------------------
        // Load skills
        // --------------------------------

        const skillsResponse = await fetch(
          `${API_BASE_URL}/skills`,
          {
            headers: {
              "X-CareerPilot-Token": token,
            },
          },
        );

        if (!skillsResponse.ok) {
          const data =
            await skillsResponse.json().catch(() => null);

          throw new Error(
            data?.detail || "Failed to load skills",
          );
        }

        const skillsData: Skill[] =
          await skillsResponse.json();

        setSkills(skillsData);
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your onboarding data.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // --------------------------------
  // Profile field changes
  // --------------------------------

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  // --------------------------------
  // Save profile
  // --------------------------------

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const token = sessionStorage.getItem(
      "careerpilot_access_token",
    );

    if (!token) {
      setError("You are not logged in.");
      setSaving(false);
      return;
    }

    const payload = {
      full_name: form.full_name,
      experience_level:
        form.experience_level || null,
      experience_summary:
        form.experience_summary || null,
      target_role: form.target_role || null,
      target_company:
        form.target_company || null,
      weekly_hours: form.weekly_hours
        ? Number(form.weekly_hours)
        : null,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile`,
        {
          method: profileExists ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CareerPilot-Token": token,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to save profile",
        );
      }

      setProfileExists(true);
      setMessage("Profile saved successfully.");
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------
  // Add skill
  // --------------------------------

  const handleAddSkill = async (
    event: FormEvent,
  ) => {
    event.preventDefault();

    setSkillError("");

    if (!skillName.trim()) {
      setSkillError("Skill name is required.");
      return;
    }

    const token = sessionStorage.getItem(
      "careerpilot_access_token",
    );

    if (!token) {
      setSkillError("You are not logged in.");
      return;
    }

    setSkillLoading(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/skills`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CareerPilot-Token": token,
          },
          body: JSON.stringify({
            skill_name: skillName.trim(),
            category: skillCategory || null,
            self_assessed_level:
              skillLevel || null,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.detail || "Failed to add skill",
        );
      }

      setSkills((current) => [
        ...current,
        data as Skill,
      ]);

      setSkillName("");
      setSkillCategory("");
      setSkillLevel("");
    } catch (err) {
      console.error(err);

      setSkillError(
        err instanceof Error
          ? err.message
          : "Unable to add skill.",
      );
    } finally {
      setSkillLoading(false);
    }
  };

  // --------------------------------
  // Loading state
  // --------------------------------

  if (loading) {
    return (
      <div className="onboarding-page">
        <div className="onboarding-card">
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  // --------------------------------
  // UI
  // --------------------------------

  return (
    <div className="onboarding-page">
      <div className="onboarding-card">

        {/* ============================
            Profile Header
        ============================ */}

        <div className="onboarding-header">
          <span className="onboarding-badge">
            CAREERPILOT AI
          </span>

          <h1>Tell us about yourself</h1>

          <p>
            This information will help
            CareerPilot personalize your
            learning and interview preparation.
          </p>
        </div>

        {/* ============================
            Profile Form
        ============================ */}

        <form
          className="onboarding-form"
          onSubmit={handleSubmit}
        >
          <div className="form-group">
            <label htmlFor="full_name">
              Full name
            </label>

            <input
              id="full_name"
              name="full_name"
              type="text"
              value={form.full_name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="experience_level">
              Experience level
            </label>

            <select
              id="experience_level"
              name="experience_level"
              value={form.experience_level}
              onChange={handleChange}
            >
              <option value="">
                Select experience level
              </option>

              <option value="Student">
                Student
              </option>

              <option value="Fresher">
                Fresher
              </option>

              <option value="1 year">
                1 year
              </option>

              <option value="2–3 years">
                2–3 years
              </option>

              <option value="3–5 years">
                3–5 years
              </option>

              <option value="5+ years">
                5+ years
              </option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience_summary">
              Experience summary
            </label>

            <textarea
              id="experience_summary"
              name="experience_summary"
              value={form.experience_summary}
              onChange={handleChange}
              rows={5}
              placeholder="Tell us about your current work and experience"
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_role">
              Target role
            </label>

            <input
              id="target_role"
              name="target_role"
              type="text"
              value={form.target_role}
              onChange={handleChange}
              placeholder="e.g. AI Engineer"
            />
          </div>

          <div className="form-group">
            <label htmlFor="target_company">
              Target company
            </label>

            <input
              id="target_company"
              name="target_company"
              type="text"
              value={form.target_company}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label htmlFor="weekly_hours">
              Weekly learning hours
            </label>

            <input
              id="weekly_hours"
              name="weekly_hours"
              type="number"
              min="1"
              max="168"
              value={form.weekly_hours}
              onChange={handleChange}
              placeholder="e.g. 10"
            />

            <span className="field-hint">
              How much time can you realistically
              dedicate each week?
            </span>
          </div>

          {message && (
            <div className="form-success">
              {message}
            </div>
          )}

          {error && (
            <div className="form-error">
              {error}
            </div>
          )}

          <button
            className="onboarding-submit"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : profileExists
                ? "Update Profile"
                : "Save Profile"}
          </button>
        </form>

        {/* ============================
            Skills Section
        ============================ */}

        <div className="skills-section">
          <div className="skills-header">
            <div>
              <span className="section-label">
                YOUR SKILLS
              </span>

              <h2>Skills</h2>

              <p>
                Add the technologies and skills
                you currently know.
              </p>
            </div>
          </div>

          {/* Existing skills */}

          {skills.length > 0 && (
            <div className="skills-list">
              {skills.map((skill) => (
                <div
                  className="skill-item"
                  key={skill.id}
                >
                  <div className="skill-main">
                    <span className="skill-name">
                      {skill.skill_name}
                    </span>

                    {skill.category && (
                      <span className="skill-category">
                        {skill.category}
                      </span>
                    )}
                  </div>

                  {skill.self_assessed_level && (
                    <span className="skill-level">
                      {skill.self_assessed_level}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add skill form */}

          <form
            className="skill-form"
            onSubmit={handleAddSkill}
          >
            <div className="skill-form-row">
              <div className="form-group">
                <label htmlFor="skill_name">
                  Skill
                </label>

                <input
                  id="skill_name"
                  type="text"
                  value={skillName}
                  onChange={(event) =>
                    setSkillName(
                      event.target.value,
                    )
                  }
                  placeholder="e.g. Python"
                />
              </div>

              <div className="form-group">
                <label htmlFor="skill_category">
                  Category
                </label>

                <select
                  id="skill_category"
                  value={skillCategory}
                  onChange={(event) =>
                    setSkillCategory(
                      event.target.value,
                    )
                  }
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Programming">
                    Programming
                  </option>

                  <option value="Backend">
                    Backend
                  </option>

                  <option value="Frontend">
                    Frontend
                  </option>

                  <option value="Database">
                    Database
                  </option>

                  <option value="AI">
                    AI
                  </option>

                  <option value="Cloud">
                    Cloud
                  </option>

                  <option value="DevOps">
                    DevOps
                  </option>

                  <option value="Testing">
                    Testing
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="skill_level">
                Self-assessed level
              </label>

              <select
                id="skill_level"
                value={skillLevel}
                onChange={(event) =>
                  setSkillLevel(
                    event.target.value,
                  )
                }
              >
                <option value="">
                  Select level
                </option>

                <option value="Beginner">
                  Beginner
                </option>

                <option value="Intermediate">
                  Intermediate
                </option>

                <option value="Advanced">
                  Advanced
                </option>
              </select>
            </div>

            {skillError && (
              <div className="form-error">
                {skillError}
              </div>
            )}

            <button
              type="submit"
              className="skill-add-button"
              disabled={skillLoading}
            >
              {skillLoading
                ? "Adding..."
                : "Add Skill"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}