import { NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiTarget, FiAward, FiUser } from "react-icons/fi";

const tabs = [
  { to: "/", icon: <FiHome />, label: "Home" },
  { to: "/learn", icon: <FiBookOpen />, label: "Learn" },
  { to: "/practice", icon: <FiTarget />, label: "Practice" },
  { to: "/leaderboard", icon: <FiAward />, label: "Ranks" },
  { to: "/profile", icon: <FiUser />, label: "You" },
];

export default function BottomTabs() {
  return (
    <nav className="bottom-tabs" aria-label="Bottom navigation">
      {tabs.map(t => (
        <NavLink
          key={t.to}
          to={t.to}
          end={t.to === "/"}
          className={({ isActive }) => `tab ${isActive ? "active" : ""}`}
        >
          <span className="icon">{t.icon}</span>
          <span className="label">{t.label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
