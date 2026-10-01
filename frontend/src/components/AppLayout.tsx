import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  return (
    <div
      className={[
        "app-shell",
        sidebarCollapsed
          ? "sidebar-collapsed"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (current) => !current,
          )
        }
        mobileOpen={mobileMenuOpen}
        onMobileClose={() =>
          setMobileMenuOpen(false)
        }
      />

      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={() =>
            setMobileMenuOpen(false)
          }
        />
      )}

      <div className="app-shell-main">
        <Topbar
          onMenuClick={() =>
            setMobileMenuOpen(true)
          }
        />

        <main className="app-shell-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}