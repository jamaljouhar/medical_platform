import { NavLink } from "react-router-dom";

import "./Layout.css";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  return (
    <aside className={`patient-sidebar ${isOpen ? "sidebar-open" : ""}`}>
      
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon">
            <i className="pi pi-heart-fill"></i>
          </div>

          <div className="logo-content">
            <h2>MedFlow</h2>
            <span>Patient Portal</span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          className="sidebar-close-button"
          onClick={onClose}
          aria-label="Close menu"
        >
          <i className="pi pi-times"></i>
        </button>
      </div>

      <nav className="sidebar-menu">
        <div className="menu-section">
          <span className="menu-title">MAIN MENU</span>

          <NavLink
            to="/patient/dashboard"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-home"></i>
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/patient/appointments"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-calendar"></i>
            <span>Appointments</span>
          </NavLink>

          <NavLink
            to="/patient/doctors"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-users"></i>
            <span>Doctors</span>
          </NavLink>
        </div>

        {/* My Health */}
        <div className="menu-section">
          <span className="menu-title">MY HEALTH</span>

          <NavLink
            to="/patient/medical-record"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-file"></i>
            <span>Medical Record</span>
          </NavLink>

          <NavLink
            to="/patient/prescriptions"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-file-edit"></i>
            <span>Prescriptions</span>
          </NavLink>
        </div>

        {/* Account */}
        <div className="menu-section">
          <span className="menu-title">ACCOUNT</span>

          <NavLink
            to="/patient/profile"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-user"></i>
            <span>Profile</span>
          </NavLink>

          <NavLink
            to="/patient/settings"
            onClick={onClose}
            className={({ isActive }) =>
              `menu-item ${isActive ? "active" : ""}`
            }
          >
            <i className="pi pi-cog"></i>
            <span>Settings</span>
          </NavLink>
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
