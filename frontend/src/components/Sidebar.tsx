import {
  BarChart3,
  Brain,
  BriefcaseBusiness,
  ChevronRight,
  LayoutDashboard,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  UserRound,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

type SidebarProps = {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen?: boolean;
  onMobileClose?: () => void;
};

const navigationItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Profile",
    path: "/profile",
    icon: UserRound,
  },
  {
    label: "Skills",
    path: "/skills",
    icon: Brain,
  },
  {
    label: "Learning",
    path: "/learning",
    icon: BriefcaseBusiness,
    comingSoon: true,
  },
  {
    label: "Interviews",
    path: "/interviews",
    icon: BarChart3,
    comingSoon: true,
  },
];

export default function Sidebar({
  collapsed,
  onToggle,
  mobileOpen = false,
  onMobileClose,
}: SidebarProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("careerpilot_access_token");
    navigate("/login", { replace: true });
  };

  const handleNavigation = () => {
    onMobileClose?.();
  };

  return (
    <aside
      className={[
        "app-sidebar",
        collapsed ? "collapsed" : "",
        mobileOpen ? "mobile-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="sidebar-top">
        <div className="sidebar-brand">
          <div className="sidebar-brand-mark">C</div>

          {!collapsed && (
            <div className="sidebar-brand-copy">
              <div className="sidebar-brand-name">
                CareerPilot
              </div>

              <div className="sidebar-brand-subtitle">
                AI Career Coach
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="sidebar-toggle"
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          title={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
        >
          {collapsed ? (
            <PanelLeftOpen size={18} />
          ) : (
            <PanelLeftClose size={18} />
          )}
        </button>
      </div>

      {!collapsed && (
        <div className="sidebar-section-label">
          WORKSPACE
        </div>
      )}

      <nav className="sidebar-navigation">
        {navigationItems.map((item) => {
          const Icon = item.icon;

          if (item.comingSoon) {
            return (
              <div
                key={item.path}
                className="sidebar-nav-item sidebar-nav-disabled"
                title={item.label}
              >
                <Icon size={18} strokeWidth={1.8} />

                {!collapsed && (
                  <>
                    <span>{item.label}</span>

                    <span className="sidebar-coming-soon">
                      Soon
                    </span>
                  </>
                )}
              </div>
            );
          }

          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={handleNavigation}
              className={({ isActive }) =>
                `sidebar-nav-item ${
                  isActive ? "active" : ""
                }`
              }
              title={collapsed ? item.label : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />

              {!collapsed && (
                <>
                  <span>{item.label}</span>

                  <ChevronRight
                    className="sidebar-nav-arrow"
                    size={15}
                  />
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-bottom">
        {!collapsed && (
          <div className="sidebar-section-label">
            ACCOUNT
          </div>
        )}

        <NavLink
          to="/settings"
          onClick={handleNavigation}
          className={({ isActive }) =>
            `sidebar-nav-item ${
              isActive ? "active" : ""
            }`
          }
          title={collapsed ? "Settings" : undefined}
        >
          <Settings size={18} strokeWidth={1.8} />

          {!collapsed && (
            <>
              <span>Settings</span>

              <ChevronRight
                className="sidebar-nav-arrow"
                size={15}
              />
            </>
          )}
        </NavLink>

        <button
          type="button"
          className="sidebar-logout"
          onClick={handleLogout}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut size={18} strokeWidth={1.8} />

          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </aside>
  );
}