import { NavLink } from "react-router-dom";
import { FiMenu, FiSettings } from "react-icons/fi";

export default function TopNav({ onToggleSidebar }) {
  return (
    <header className="topnav" role="banner">
      <button
        className="icon-btn"
        aria-label="Toggle sidebar"
        onClick={onToggleSidebar}
      >
        <FiMenu />
      </button>

      <NavLink to="/" className="brand">
        GitHub Quiz
      </NavLink>

      <nav aria-label="Primary" className="top-actions">
        <NavLink to="/settings" className="icon-btn" aria-label="Settings">
          <FiSettings />
        </NavLink>
      </nav>
    </header>
  );
}
