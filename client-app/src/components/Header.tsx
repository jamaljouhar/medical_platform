import { Button } from "primereact/button";

export default function Header() {
  return (
    <header className="app-header">
      <div className="app-header-brand">
        <span>MedFlow</span>
      </div>

      <div className="app-header-actions">
        <Button
          icon="pi pi-bell"
          text
          rounded
          aria-label="Notifications"
        />

        <Button
          icon="pi pi-user"
          className="btn rounded-2 fw-bold bg-primary text-white"
          style={{
            width: 25,
            height: 25,
            padding:0
          }}
          text
          aria-label="Profil"
        />
      </div>
    </header>
  );
}