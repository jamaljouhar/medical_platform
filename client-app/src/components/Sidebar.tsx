import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="app-sidebar">
      <nav>
        <NavLink to="/client" className="sidebar-link">
          <i className="pi pi-home"></i>
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin/patients" className="sidebar-link">
          <i className="pi pi-users"></i>
          <span>Patients</span>
        </NavLink>

        <NavLink to="/client/appointments" className="sidebar-link">
          <i className="pi pi-calendar"></i>
          <span>Rendez-vous</span>
        </NavLink>

        <NavLink to="/client/profile" className="sidebar-link">
          <i className="pi pi-user"></i>
          <span>Mon profil</span>
        </NavLink>
      </nav>
    </aside>
  );
}