import { useState } from "react";
import TopNav from "./TopNav";
import SideNav from "./SideNav";
import BottomTabs from "./BottomTabs";
import { Outlet } from "react-router-dom";

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={`app-shell ${sidebarOpen ? "with-sidebar" : ""}`}>
      <a className="skip-link" href="#main">Skip to content</a>
      <TopNav onToggleSidebar={() => setSidebarOpen(s => !s)} />
      <div className="shell-body">
        <SideNav open={sidebarOpen} />
        <main id="main" className="page">
          <Outlet />
        </main>
      </div>
      <BottomTabs />
    </div>
  );
}
