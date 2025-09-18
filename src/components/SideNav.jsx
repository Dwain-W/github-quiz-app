import { NavLink } from "react-router-dom";
import { FiHome, FiBookOpen, FiTarget, FiAward, FiUser } from "react-icons/fi";
import cx from "classnames";

const items = [
  { to: "/", label: "Home", icon: <FiHome /> },
  { to: "/learn", label: "Learn", icon: <FiBookOpen /> },
  { to: "/practice", label: "Practice", icon: <FiTarget /> },
  { to: "/leaderboard", label: "Leaderboard", icon: <FiAward /> },
  { to: "/profile", label: "Profile", icon: <FiUser /> },
];

export default function SideNav({ open }) {
  return (
    <aside className={cx("sidenav", { open })} aria-label="Sidebar">
      <ul>
        {items.map(item => (
          <li key={item.to}>
            <NavLink
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) => cx("side-link", { active: isActive })}
            >
              <span className="icon">{item.icon}</span>
              <span className="label">{item.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="sidenav-footer">
        <div className="tiny">v0.1 • Duolingo-style GitHub learning</div>
      </div>
    </aside>
  );
}
