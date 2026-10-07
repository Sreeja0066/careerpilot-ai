import {
  BriefcaseBusiness,
  Clock3,
  Save,
  UserRound,
} from "lucide-react";
import {
  FormEvent,
  useEffect,
  useState,
} from "react";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL;

const TOKEN_KEY =
  "careerpilot_access_token";

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

type ProfileForm = {
  full_name: string;
  experience_level: string;
  experience_summary: string;
  target_role: string;
  target_company: string;
  weekly_hours: string;
};

async function parseJsonResponse(
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

function formatDate(
  value: string | null | undefined,
) {
  if (!value) {
    return "—";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    },
  );
}

export default function ProfilePage() {
  const [form, setForm] =
    useState<ProfileForm>({
      full_name: "",
      experience_level: "",
      experience_summary: "",
      target_role: "",
      target_company: "",
      weekly_hours: "",
    });

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    const loadProfile = async () => {
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
          `${API_BASE_URL}/profile`,
          {
            headers: {
              "X-CareerPilot-Token":
                token,
            },
          },
        );

        const data =
          await parseJsonResponse(response);

        if (response.status === 404) {
          setError(
            "Your profile has not been created yet.",
          );
          return;
        }

        if (response.status === 401) {
          localStorage.removeItem(
            TOKEN_KEY,
          );

          setError(
            "Your session has expired. Please log in again.",
          );
          return;
        }

        if (!response.ok) {
          throw new Error(
            data?.detail ||
              "Failed to load your profile.",
          );
        }

        const profileData =
          data as Profile;

        setProfile(profileData);

        setForm({
          full_name:
            profileData.full_name ?? "",
          experience_level:
            profileData.experience_level ??
            "",
          experience_summary:
            profileData.experience_summary ??
            "",
          target_role:
            profileData.target_role ?? "",
          target_company:
            profileData.target_company ??
            "",
          weekly_hours:
            profileData.weekly_hours !==
            null
              ? String(
                  profileData.weekly_hours,
                )
              : "",
        });
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load your profile.",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
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

    setMessage("");
    setError("");
  };

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

    if (!form.full_name.trim()) {
      setError(
        "Full name is required.",
      );
      return;
    }

    setSaving(true);
    setMessage("");
    setError("");

    const payload = {
      full_name:
        form.full_name.trim(),
      experience_level:
        form.experience_level ||
        null,
      experience_summary:
        form.experience_summary.trim() ||
        null,
      target_role:
        form.target_role.trim() ||
        null,
      target_company:
        form.target_company.trim() ||
        null,
      weekly_hours: form.weekly_hours
        ? Number(form.weekly_hours)
        : null,
    };

    try {
      const response = await fetch(
        `${API_BASE_URL}/profile`,
        {
          method: "PUT",
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
        await parseJsonResponse(response);

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
            "Failed to update your profile.",
        );
      }

      const updatedProfile =
        data as Profile;

      setProfile(updatedProfile);

      setForm({
        full_name:
          updatedProfile.full_name ??
          "",
        experience_level:
          updatedProfile.experience_level ??
          "",
        experience_summary:
          updatedProfile.experience_summary ??
          "",
        target_role:
          updatedProfile.target_role ??
          "",
        target_company:
          updatedProfile.target_company ??
          "",
        weekly_hours:
          updatedProfile.weekly_hours !==
          null
            ? String(
                updatedProfile.weekly_hours,
              )
            : "",
      });

      setMessage(
        "Profile updated successfully.",
      );
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update your profile.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-loading">
            Loading your profile...
          </div>
        </div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <section className="profile-content-card">
            <span className="dashboard-section-eyebrow">
              PROFILE
            </span>

            <h1 className="profile-page-title">
              Your profile
            </h1>

            <div className="profile-error">
              {error}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">

        {/* Header */}
        <section className="profile-masthead">
          <div className="profile-masthead-label">
            <UserRound
              size={15}
              strokeWidth={1.8}
            />

            <span>CareerPilot Profile</span>
          </div>

          <h1 className="profile-page-title">
            Your profile
          </h1>

          <p className="profile-page-description">
            Keep your career goals, experience,
            and learning availability up to date.
            CareerPilot uses this information to
            personalize your preparation journey.
          </p>
        </section>

        {/* Profile information */}
        {profile && (
          <section className="profile-meta-strip">
            <div className="profile-meta-item">
              <span>Member since</span>

              <strong>
                {formatDate(
                  profile.created_at,
                )}
              </strong>
            </div>

            <div className="profile-meta-item">
              <span>Last updated</span>

              <strong>
                {formatDate(
                  profile.updated_at,
                )}
              </strong>
            </div>

            <div className="profile-meta-item">
              <span>Profile status</span>

              <strong className="profile-status">
                Complete
              </strong>
            </div>
          </section>
        )}

        {/* Form */}
        <section className="profile-content-card">
          <div className="profile-section-heading">
            <div>
              <span className="dashboard-section-eyebrow">
                BASIC INFORMATION
              </span>

              <h2>
                Career profile
              </h2>

              <p>
                The information below shapes
                your personalized CareerPilot
                experience.
              </p>
            </div>
          </div>

          <form
            className="profile-form"
            onSubmit={handleSubmit}
          >
            <div className="profile-form-grid">
              <div className="profile-form-field">
                <label htmlFor="profile-full-name">
                  Full name
                </label>

                <input
                  id="profile-full-name"
                  name="full_name"
                  type="text"
                  value={form.full_name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-experience-level">
                  Experience level
                </label>

                <select
                  id="profile-experience-level"
                  name="experience_level"
                  value={
                    form.experience_level
                  }
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

              <div className="profile-form-field profile-form-field-full">
                <label htmlFor="profile-experience-summary">
                  Experience summary
                </label>

                <textarea
                  id="profile-experience-summary"
                  name="experience_summary"
                  value={
                    form.experience_summary
                  }
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe your current work, responsibilities, and relevant experience."
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-target-role">
                  Target role
                </label>

                <div className="profile-input-with-icon">
                  <BriefcaseBusiness
                    size={17}
                    strokeWidth={1.7}
                  />

                  <input
                    id="profile-target-role"
                    name="target_role"
                    type="text"
                    value={form.target_role}
                    onChange={handleChange}
                    placeholder="e.g. AI Engineer"
                  />
                </div>
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-target-company">
                  Target company
                </label>

                <input
                  id="profile-target-company"
                  name="target_company"
                  type="text"
                  value={
                    form.target_company
                  }
                  onChange={handleChange}
                  placeholder="Optional"
                />
              </div>

              <div className="profile-form-field">
                <label htmlFor="profile-weekly-hours">
                  Weekly learning hours
                </label>

                <div className="profile-input-with-icon">
                  <Clock3
                    size={17}
                    strokeWidth={1.7}
                  />

                  <input
                    id="profile-weekly-hours"
                    name="weekly_hours"
                    type="number"
                    min="1"
                    max="168"
                    value={form.weekly_hours}
                    onChange={handleChange}
                    placeholder="e.g. 10"
                  />
                </div>

                <span className="profile-field-hint">
                  Hours you can realistically
                  dedicate each week.
                </span>
              </div>
            </div>

            {message && (
              <div className="profile-success">
                {message}
              </div>
            )}

            {error && (
              <div className="profile-error">
                {error}
              </div>
            )}

            <div className="profile-form-footer">
              <span>
                Your profile is stored securely
                with your CareerPilot account.
              </span>

              <button
                type="submit"
                className="profile-save-button"
                disabled={saving}
              >
                <Save
                  size={17}
                  strokeWidth={1.8}
                />

                <span>
                  {saving
                    ? "Saving..."
                    : "Save changes"}
                </span>
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}