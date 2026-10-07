import {
  Brain,
  Check,
  Cloud,
  Code2,
  Database,
  Pencil,
  Plus,
  Save,
  Server,
  Trash2,
  X,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY =
  "careerpilot_access_token";

type Skill = {
  id: string;
  user_id: string;
  skill_name: string;
  category: string | null;
  self_assessed_level: string | null;
  created_at: string;
  updated_at: string;
};

type SkillForm = {
  skill_name: string;
  category: string;
  self_assessed_level: string;
};

const emptyForm: SkillForm = {
  skill_name: "",
  category: "",
  self_assessed_level: "",
};

async function parseResponse(
  response: Response,
) {
  const text = await response.text();

  if (!text.trim()) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function getSkillIcon(
  skill: Skill,
) {
  const name =
    skill.skill_name.toLowerCase();

  const category =
    skill.category?.toLowerCase() ?? "";

  if (
    name.includes("sql") ||
    name.includes("database") ||
    category === "database"
  ) {
    return Database;
  }

  if (
    name.includes("fastapi") ||
    name.includes("api") ||
    category === "backend"
  ) {
    return Server;
  }

  if (
    name.includes("llm") ||
    name.includes("genai") ||
    name.includes("ai") ||
    category === "ai"
  ) {
    return Brain;
  }

  if (
    category === "cloud" ||
    name.includes("aws") ||
    name.includes("azure") ||
    name.includes("gcp") ||
    name.includes("cloud")
  ) {
    return Cloud;
  }

  return Code2;
}

export default function SkillsPage() {
  const [skills, setSkills] =
    useState<Skill[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [formOpen, setFormOpen] =
    useState(false);

  const [editingSkillId, setEditingSkillId] =
    useState<string | null>(null);

  const [form, setForm] =
    useState<SkillForm>(emptyForm);

  const [deletingSkillId, setDeletingSkillId] =
    useState<string | null>(null);

  // --------------------------------------------------
  // Load skills
  // --------------------------------------------------

  useEffect(() => {
    const loadSkills = async () => {
      const token =
        localStorage.getItem(TOKEN_KEY);

      if (!token) {
        setError(
          "You are not logged in.",
        );
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `${API_BASE_URL}/skills`,
          {
            headers: {
              "X-CareerPilot-Token":
                token,
            },
          },
        );

        const data =
          await parseResponse(response);

        if (response.status === 401) {
          localStorage.removeItem(
            TOKEN_KEY,
          );

          throw new Error(
            "Your session has expired. Please log in again.",
          );
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Failed to load skills.",
          );
        }

        setSkills(
          Array.isArray(data)
            ? (data as Skill[])
            : [],
        );
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your skills.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadSkills();
  }, []);

  // --------------------------------------------------
  // Derived stats
  // --------------------------------------------------

  const skillStats = useMemo(() => {
    const intermediate =
      skills.filter(
        (skill) =>
          skill.self_assessed_level?.toLowerCase() ===
          "intermediate",
      ).length;

    const advanced =
      skills.filter(
        (skill) =>
          skill.self_assessed_level?.toLowerCase() ===
          "advanced",
      ).length;

    const categories = new Set(
      skills
        .map(
          (skill) =>
            skill.category?.trim(),
        )
        .filter(Boolean),
    );

    return {
      total: skills.length,
      intermediate,
      advanced,
      categories: categories.size,
    };
  }, [skills]);

  // --------------------------------------------------
  // Form helpers
  // --------------------------------------------------

  const resetForm = () => {
    setForm(emptyForm);
    setEditingSkillId(null);
    setFormOpen(false);
    setMessage("");
    setError("");
  };

  const openAddForm = () => {
    setForm(emptyForm);
    setEditingSkillId(null);
    setFormOpen(true);
    setMessage("");
    setError("");
  };

  const openEditForm = (
    skill: Skill,
  ) => {
    setForm({
      skill_name:
        skill.skill_name ?? "",
      category:
        skill.category ?? "",
      self_assessed_level:
        skill.self_assessed_level ??
        "",
    });

    setEditingSkillId(skill.id);
    setFormOpen(true);
    setMessage("");
    setError("");
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >,
  ) => {
    const {
      name,
      value,
    } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // --------------------------------------------------
  // Add / edit skill
  // --------------------------------------------------

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    const token =
      localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setError(
        "You are not logged in.",
      );
      return;
    }

    if (!form.skill_name.trim()) {
      setError(
        "Skill name is required.",
      );
      return;
    }

    setSaving(true);
    setError("");
    setMessage("");

    const payload = {
      skill_name:
        form.skill_name.trim(),
      category:
        form.category || null,
      self_assessed_level:
        form.self_assessed_level ||
        null,
    };

    try {
      const url = editingSkillId
        ? `${API_BASE_URL}/skills/${editingSkillId}`
        : `${API_BASE_URL}/skills`;

      const method = editingSkillId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
            "X-CareerPilot-Token":
              token,
          },
          body: JSON.stringify(payload),
        },
      );

      const data =
        await parseResponse(response);

      if (response.status === 401) {
        localStorage.removeItem(
          TOKEN_KEY,
        );

        throw new Error(
          "Your session has expired. Please log in again.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            `Failed to ${
              editingSkillId
                ? "update"
                : "add"
            } skill.`,
        );
      }

      const savedSkill =
        data as Skill;

      if (editingSkillId) {
        setSkills((current) =>
          current.map((skill) =>
            skill.id ===
            editingSkillId
              ? savedSkill
              : skill,
          ),
        );

        setMessage(
          "Skill updated successfully.",
        );
      } else {
        setSkills((current) => [
          ...current,
          savedSkill,
        ]);

        setMessage(
          "Skill added successfully.",
        );
      }

      setForm(emptyForm);
      setEditingSkillId(null);
      setFormOpen(false);
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to save skill.",
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Delete skill
  // --------------------------------------------------

  const handleDelete = async (
    skillId: string,
  ) => {
    const token =
      localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setError(
        "You are not logged in.",
      );
      return;
    }

    const confirmed =
      window.confirm(
        "Delete this skill from your profile?",
      );

    if (!confirmed) {
      return;
    }

    setDeletingSkillId(skillId);
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `${API_BASE_URL}/skills/${skillId}`,
        {
          method: "DELETE",
          headers: {
            "X-CareerPilot-Token":
              token,
          },
        },
      );

      if (response.status === 401) {
        localStorage.removeItem(
          TOKEN_KEY,
        );

        throw new Error(
          "Your session has expired. Please log in again.",
        );
      }

      if (!response.ok) {
        const data =
          await parseResponse(response);

        throw new Error(
          data?.detail ||
            "Failed to delete skill.",
        );
      }

      setSkills((current) =>
        current.filter(
          (skill) =>
            skill.id !== skillId,
        ),
      );

      if (
        editingSkillId === skillId
      ) {
        resetForm();
      }

      setMessage(
        "Skill removed successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to delete skill.",
      );
    } finally {
      setDeletingSkillId(null);
    }
  };

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <div className="skills-page">
        <div className="skills-page-container">
          <div className="skills-page-loading">
            Loading your skills...
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="skills-page">
      <div className="skills-page-container">

        {/* Header */}
        <section className="skills-page-masthead">
          <div className="skills-page-label">
            <Brain
              size={15}
              strokeWidth={1.8}
            />

            <span>
              CareerPilot Skills
            </span>
          </div>

          <div className="skills-page-heading-row">
            <div>
              <h1>
                Your skills
              </h1>

              <p>
                Keep your current capabilities
                up to date so CareerPilot can
                adapt your preparation journey.
              </p>
            </div>

            {!formOpen && (
              <button
                type="button"
                className="skills-add-button"
                onClick={openAddForm}
              >
                <Plus
                  size={17}
                  strokeWidth={2}
                />

                <span>
                  Add skill
                </span>
              </button>
            )}
          </div>
        </section>

        {/* Stats */}
        <section className="skills-stats">
          <div className="skills-stat">
            <span>
              Total skills
            </span>

            <strong>
              {skillStats.total}
            </strong>

            <small>
              Added to your profile
            </small>
          </div>

          <div className="skills-stat">
            <span>
              Intermediate
            </span>

            <strong>
              {skillStats.intermediate}
            </strong>

            <small>
              Skills at this level
            </small>
          </div>

          <div className="skills-stat">
            <span>
              Advanced
            </span>

            <strong>
              {skillStats.advanced}
            </strong>

            <small>
              Skills at this level
            </small>
          </div>

          <div className="skills-stat">
            <span>
              Categories
            </span>

            <strong>
              {skillStats.categories}
            </strong>

            <small>
              Areas represented
            </small>
          </div>
        </section>

        {/* Feedback */}
        {message && (
          <div className="skills-success">
            <Check
              size={16}
              strokeWidth={2}
            />

            <span>
              {message}
            </span>
          </div>
        )}

        {error && (
          <div className="skills-error">
            {error}
          </div>
        )}

        {/* Add / Edit form */}
        {formOpen && (
          <section className="skills-editor-card">
            <div className="skills-editor-header">
              <div>
                <span className="dashboard-section-eyebrow">
                  {editingSkillId
                    ? "EDIT SKILL"
                    : "ADD SKILL"}
                </span>

                <h2>
                  {editingSkillId
                    ? "Update skill"
                    : "Add a new skill"}
                </h2>

                <p>
                  Tell CareerPilot what you
                  currently know.
                </p>
              </div>

              <button
                type="button"
                className="skills-close-button"
                onClick={resetForm}
                aria-label="Close"
              >
                <X
                  size={18}
                  strokeWidth={1.8}
                />
              </button>
            </div>

            <form
              className="skills-editor-form"
              onSubmit={handleSubmit}
            >
              <div className="skills-editor-grid">
                <div className="skills-field">
                  <label htmlFor="skill_name">
                    Skill name
                  </label>

                  <input
                    id="skill_name"
                    name="skill_name"
                    type="text"
                    value={
                      form.skill_name
                    }
                    onChange={
                      handleChange
                    }
                    placeholder="e.g. Python"
                    required
                  />
                </div>

                <div className="skills-field">
                  <label htmlFor="category">
                    Category
                  </label>

                  <select
                    id="category"
                    name="category"
                    value={
                      form.category
                    }
                    onChange={
                      handleChange
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

                <div className="skills-field">
                  <label htmlFor="self_assessed_level">
                    Skill level
                  </label>

                  <select
                    id="self_assessed_level"
                    name="self_assessed_level"
                    value={
                      form.self_assessed_level
                    }
                    onChange={
                      handleChange
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
              </div>

              <div className="skills-editor-footer">
                <button
                  type="button"
                  className="skills-cancel-button"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="skills-save-button"
                  disabled={saving}
                >
                  <Save
                    size={16}
                    strokeWidth={1.8}
                  />

                  <span>
                    {saving
                      ? "Saving..."
                      : editingSkillId
                        ? "Save changes"
                        : "Add skill"}
                  </span>
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Skills list */}
        <section className="skills-list-card">
          <div className="skills-list-header">
            <div>
              <span className="dashboard-section-eyebrow">
                YOUR SKILLS
              </span>

              <h2>
                Current skills
              </h2>

              <p>
                Skills currently associated
                with your CareerPilot profile.
              </p>
            </div>

            <span className="skills-count-badge">
              {skills.length}{" "}
              {skills.length === 1
                ? "skill"
                : "skills"}
            </span>
          </div>

          {skills.length === 0 ? (
            <div className="skills-empty">
              <Brain
                size={28}
                strokeWidth={1.4}
              />

              <h3>
                No skills added yet
              </h3>

              <p>
                Add your first skill so
                CareerPilot can begin building
                your personalized skill profile.
              </p>

              <button
                type="button"
                className="skills-empty-button"
                onClick={openAddForm}
              >
                <Plus
                  size={16}
                  strokeWidth={2}
                />

                Add your first skill
              </button>
            </div>
          ) : (
            <div className="skills-table">
              {skills.map((skill) => {
                const Icon =
                  getSkillIcon(skill);

                const isDeleting =
                  deletingSkillId ===
                  skill.id;

                return (
                  <div
                    className="skills-row"
                    key={skill.id}
                  >
                    <div className="skills-row-main">
                      <div className="skills-row-icon">
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                        />
                      </div>

                      <div className="skills-row-copy">
                        <strong>
                          {skill.skill_name}
                        </strong>

                        <div className="skills-row-meta">
                          <span>
                            {skill.category ||
                              "Uncategorized"}
                          </span>

                          <span>
                            •
                          </span>

                          <span>
                            Added{" "}
                            {new Date(
                              skill.created_at,
                            ).toLocaleDateString(
                              undefined,
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="skills-row-actions">
                      {skill.self_assessed_level && (
                        <span
                          className={`skills-level-badge ${skill.self_assessed_level.toLowerCase()}`}
                        >
                          {
                            skill.self_assessed_level
                          }
                        </span>
                      )}

                      <button
                        type="button"
                        className="skills-action-button"
                        onClick={() =>
                          openEditForm(
                            skill,
                          )
                        }
                        disabled={
                          isDeleting
                        }
                        aria-label={`Edit ${skill.skill_name}`}
                        title="Edit skill"
                      >
                        <Pencil
                          size={16}
                          strokeWidth={1.8}
                        />
                      </button>

                      <button
                        type="button"
                        className="skills-action-button skills-delete-action"
                        onClick={() =>
                          handleDelete(
                            skill.id,
                          )
                        }
                        disabled={
                          isDeleting
                        }
                        aria-label={`Delete ${skill.skill_name}`}
                        title="Delete skill"
                      >
                        {isDeleting ? (
                          <span className="skills-delete-spinner" />
                        ) : (
                          <Trash2
                            size={16}
                            strokeWidth={1.8}
                          />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}