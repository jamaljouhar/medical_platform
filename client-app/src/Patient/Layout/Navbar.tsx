import { Button } from "primereact/button";

import "./Layout.css";

interface NavbarProps {
  onMenuClick: () => void;
  darkMode: boolean;
  onToggleTheme: () => void;
  onLogout: () => void;
}

const Navbar = ({
  onMenuClick,
  darkMode,
  onToggleTheme,
  onLogout,
}: NavbarProps) => {
  return (
    <header className="patient-navbar">
      <div className="navbar-left">
        <Button
          icon="pi pi-bars"
          rounded
          text
          severity="secondary"
          className="mobile-menu-button"
          onClick={onMenuClick}
          aria-label="Open menu"
        />

        <div className="navbar-title">
          <h3>Patient Dashboard</h3>
          <span>Welcome back </span>
        </div>
      </div>
      <div className="navbar-right gap-2 ">
        <Button
          icon={darkMode ? "pi pi-sun" : "pi pi-moon"}
          className="rounded-4 fw-bold"
          style={{
            width: 35,
            height: 35,
            padding: 0,
          }}
          onClick={onToggleTheme}
          tooltip={darkMode ? "Light mode" : "Dark mode"}
          tooltipOptions={{
            position: "bottom",
          }}
          aria-label="Toggle theme"
        />

        {/* Notifications */}
        <Button
          icon="pi pi-bell"
          style={{
            width: 35,
            height: 35,
            padding: 0,
          }}
          className="rounded-4 border-0 fw-bold  bg-secondary "
          tooltip="Notifications"
          tooltipOptions={{
            position: "bottom",
          }}
          aria-label="Notifications"
        />


        <Button
          icon="pi pi-sign-out"
          className="rounded-4 border-0 fw-bold bg-danger"
          style={{
            width: 35,
            height: 35,
            padding: 0,
          }}
          onClick={onLogout}
          tooltip="Logout"
          tooltipOptions={{
            position: "bottom",
          }}
        />
      </div>
    </header>
  );
};

export default Navbar;
