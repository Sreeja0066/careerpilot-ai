import {
  Check,
  LogOut,
  Monitor,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import {
  useNavigate,
} from "react-router-dom";

import {
  useTheme,
  type ThemePreference,
} from "../context/ThemeContext";

const TOKEN_KEY =
  "careerpilot_access_token";

const themeOptions: Array<{
  value: ThemePreference;
  label: string;
  description: string;
  icon: typeof Sun;
}> = [
  {
    value: "light",
    label: "Light",
    description:
      "Use the light CareerPilot workspace.",
    icon: Sun,
  },
  {
    value: "dark",
    label: "Dark",
    description:
      "Use the dark CareerPilot workspace.",
    icon: Moon,
  },
  {
    value: "system",
    label: "System",
    description:
      "Follow your device appearance setting.",
    icon: Monitor,
  },
];

export default function SettingsPage() {
  const navigate = useNavigate();

  const {
    theme,
    resolvedTheme,
    setTheme,
  } = useTheme();

  const [logoutPending, setLogoutPending] =
    useState(false);

  const handleThemeChange = (
    value: ThemePreference,
  ) => {
    setTheme(value);
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  const handleLogout = () => {
    setLogoutPending(true);

    localStorage.removeItem(
      TOKEN_KEY,
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <div className="settings-page">
      <div className="settings-container">

        {/* Header */}
        <section className="settings-masthead">
          <div className="settings-page-label">
            <Settings
              size={15}
              strokeWidth={1.8}
            />

            <span>CareerPilot Settings</span>
          </div>

          <h1>Your settings</h1>

          <p>
            Manage how CareerPilot looks and
            how your account behaves on this
            device.
          </p>
        </section>

        {/* Appearance */}
        <section className="settings-card">
          <div className="settings-section-heading">
            <div>
              <span className="dashboard-section-eyebrow">
                APPEARANCE
              </span>

              <h2>Workspace appearance</h2>

              <p>
                Choose how CareerPilot should
                appear across your workspace.
              </p>
            </div>

            <span className="settings-current-badge">
              {resolvedTheme === "dark"
                ? "Dark active"
                : "Light active"}
            </span>
          </div>

          <div className="settings-theme-grid">
            {themeOptions.map((option) => {
              const Icon = option.icon;
              const selected =
                theme === option.value;

              return (
                <button
                  key={option.value}
                  type="button"
                  className={[
                    "settings-theme-option",
                    selected
                      ? "selected"
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() =>
                    handleThemeChange(
                      option.value,
                    )
                  }
                  aria-pressed={selected}
                >
                  <div className="settings-theme-icon">
                    <Icon
                      size={19}
                      strokeWidth={1.8}
                    />
                  </div>

                  <div className="settings-theme-copy">
                    <strong>
                      {option.label}
                    </strong>

                    <span>
                      {option.description}
                    </span>
                  </div>

                  <span className="settings-theme-check">
                    {selected && (
                      <Check
                        size={15}
                        strokeWidth={2}
                      />
                    )}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Account */}
        <section className="settings-card">
          <div className="settings-section-heading">
            <div>
              <span className="dashboard-section-eyebrow">
                ACCOUNT
              </span>

              <h2>Account access</h2>

              <p>
                Manage your profile and current
                CareerPilot session.
              </p>
            </div>
          </div>

          <div className="settings-account-list">
            <button
              type="button"
              className="settings-account-row"
              onClick={handleProfile}
            >
              <div className="settings-account-icon">
                <UserRound
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div className="settings-account-copy">
                <strong>Profile</strong>

                <span>
                  Update your career information,
                  experience, and learning goals.
                </span>
              </div>

              <span className="settings-row-arrow">
                →
              </span>
            </button>

            <div className="settings-account-divider" />

            <button
              type="button"
              className="settings-account-row settings-logout-row"
              onClick={handleLogout}
              disabled={logoutPending}
            >
              <div className="settings-account-icon settings-danger-icon">
                <LogOut
                  size={18}
                  strokeWidth={1.8}
                />
              </div>

              <div className="settings-account-copy">
                <strong>Log out</strong>

                <span>
                  End your current CareerPilot
                  session on this device.
                </span>
              </div>

              <span className="settings-row-arrow">
                →
              </span>
            </button>
          </div>
        </section>

        {/* About */}
        <section className="settings-card settings-about-card">
          <div className="settings-section-heading">
            <div>
              <span className="dashboard-section-eyebrow">
                ABOUT
              </span>

              <h2>CareerPilot AI</h2>

              <p>
                Your adaptive AI career and
                interview preparation workspace.
              </p>
            </div>
          </div>

          <div className="settings-about-grid">
            <div>
              <span>Product</span>
              <strong>CareerPilot AI</strong>
            </div>

            <div>
              <span>Environment</span>
              <strong>MVP</strong>
            </div>

            <div>
              <span>Phase</span>
              <strong>Foundation</strong>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}