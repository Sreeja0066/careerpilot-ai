import {
  LogOut,
  Menu,
  Moon,
  Settings,
  Sun,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useTheme } from "../context/ThemeContext";

type TopbarProps = {
  onMenuClick: () => void;
};

export default function Topbar({
  onMenuClick,
}: TopbarProps) {
  const navigate = useNavigate();
  const { resolvedTheme, setTheme } = useTheme();

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(
      resolvedTheme === "dark"
        ? "light"
        : "dark",
    );
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate("/profile");
  };

  const handleSettings = () => {
    setMenuOpen(false);
    navigate("/settings");
  };

  const handleLogout = () => {
    setMenuOpen(false);

    sessionStorage.removeItem(
      "careerpilot_access_token",
    );

    navigate("/login", {
      replace: true,
    });
  };

  return (
    <header className="app-topbar">

      {/* Mobile navigation */}
      <button
        type="button"
        className="mobile-menu-button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        title="Open navigation"
      >
        <Menu
          size={20}
          strokeWidth={1.9}
        />
      </button>

      <div className="topbar-spacer" />

      <div className="topbar-actions">

        {/* Theme toggle */}
        <button
          type="button"
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={
            resolvedTheme === "dark"
              ? "Switch to light theme"
              : "Switch to dark theme"
          }
          title={
            resolvedTheme === "dark"
              ? "Light theme"
              : "Dark theme"
          }
        >
          {resolvedTheme === "dark" ? (
            <Sun
              size={18}
              strokeWidth={1.9}
            />
          ) : (
            <Moon
              size={18}
              strokeWidth={1.9}
            />
          )}
        </button>

        {/* Account */}
        <div className="user-menu-wrapper">
          <button
            type="button"
            className="user-menu-trigger"
            onClick={() =>
              setMenuOpen(
                (current) => !current,
              )
            }
            aria-expanded={menuOpen}
            aria-label="Open account menu"
            title="Account"
          >
            <span className="user-avatar">
              <UserRound
                size={17}
                strokeWidth={1.9}
              />
            </span>
          </button>

          {menuOpen && (
            <div
              className="user-menu"
              role="menu"
            >
              <button
                type="button"
                role="menuitem"
                onClick={handleProfile}
              >
                <UserRound
                  size={16}
                  strokeWidth={1.8}
                />

                <span>Profile</span>
              </button>

              <button
                type="button"
                role="menuitem"
                onClick={handleSettings}
              >
                <Settings
                  size={16}
                  strokeWidth={1.8}
                />

                <span>Settings</span>
              </button>

              <div className="user-menu-divider" />

              <button
                type="button"
                role="menuitem"
                className="user-menu-danger"
                onClick={handleLogout}
              >
                <LogOut
                  size={16}
                  strokeWidth={1.8}
                />

                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}