import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

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
      {/* Desktop sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() =>
          setSidebarCollapsed(
            (current) => !current,
          )
        }
        onMobileClose={closeMobileMenu}
      />

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          aria-label="Close navigation"
          onClick={closeMobileMenu}
        />
      )}

      {/* Mobile drawer */}
      <div
        className={[
          "mobile-sidebar",
          mobileMenuOpen ? "open" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <Sidebar
          collapsed={false}
          onToggle={closeMobileMenu}
          mobileOpen={mobileMenuOpen}
          onMobileClose={closeMobileMenu}
        />
      </div>

      {/* Main application */}
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