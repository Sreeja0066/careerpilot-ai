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

  useEffect(() => {
    const loadProfile = async () => {
      const token = sessionStorage.getItem("careerpilot_access_token");

      if (!token) {
        setError("You are not logged in.");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          setProfileExists(false);
          setLoading(false);
          return;
        }

        if (!response.ok) {
          throw new Error("Failed to load profile");
        }

        const profile: Profile = await response.json();

        setForm({
          full_name: profile.full_name ?? "",
          experience_level: profile.experience_level ?? "",
          experience_summary: profile.experience_summary ?? "",
          target_role: profile.target_role ?? "",
          target_company: profile.target_company ?? "",
          weekly_hours:
            profile.weekly_hours !== null
              ? String(profile.weekly_hours)
              : "",
        });

        setProfileExists(true);
      } catch (err) {
        console.error(err);
        setError("Unable to load your profile.");
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
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    setSaving(true);
    setMessage("");
    setError("");

    const token = sessionStorage.getItem("careerpilot_access_token");

    if (!token) {
      setError("You are not logged in.");
      setSaving(false);
      return;
    }

    const payload = {
      full_name: form.full_name,
      experience_level: form.experience_level || null,
      experience_summary: form.experience_summary || null,
      target_role: form.target_role || null,
      target_company: form.target_company || null,
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
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Failed to save profile");
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

  if (loading) {
    return <div>Loading your profile...</div>;
  }

return (
    <div className="onboarding-page">
        <div className="onboarding-card">
        <div className="onboarding-header">
            <span className="onboarding-badge">CAREERPILOT AI</span>

            <h1>Tell us about yourself</h1>

            <p>
            This information will help CareerPilot personalize your
            learning and interview preparation.
            </p>
        </div>

        <form className="onboarding-form" onSubmit={handleSubmit}>
            <div className="form-group">
            <label htmlFor="full_name">Full name</label>
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
                <option value="">Select experience level</option>
                <option value="Student">Student</option>
                <option value="Fresher">Fresher</option>
                <option value="1 year">1 year</option>
                <option value="2–3 years">2–3 years</option>
                <option value="3–5 years">3–5 years</option>
                <option value="5+ years">5+ years</option>
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
            <label htmlFor="target_role">Target role</label>

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
                How much time can you realistically dedicate each week?
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
        </div>
    </div>
    );
}