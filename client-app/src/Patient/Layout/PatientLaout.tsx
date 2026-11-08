import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

import "./Layout.css";

const PatientLayout = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("patient-theme") === "dark";
  });

  // Apply theme
  useEffect(() => {
    const root = document.documentElement;

    if (darkMode) {
      root.setAttribute("data-theme", "dark");
      localStorage.setItem("patient-theme", "dark");
    } else {
      root.setAttribute("data-theme", "light");
      localStorage.setItem("patient-theme", "light");
    }
  }, [darkMode]);

  // Close sidebar when screen becomes desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");

    setSidebarOpen(false);

    navigate("/login", { replace: true });
  };

  return (
    <div className="patient-layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="patient-main">
        <Navbar
          onMenuClick={() => setSidebarOpen(true)}
          darkMode={darkMode}
          onToggleTheme={() => {
            setDarkMode((previous) => !previous);
          }}
          onLogout={handleLogout}
        />

        <main className="patient-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PatientLayout;
