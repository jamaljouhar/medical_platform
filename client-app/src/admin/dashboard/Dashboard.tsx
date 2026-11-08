import { Card } from "primereact/card";
import { Button } from "primereact/button";

function Dashboard() {
  const statistics = [
    {
      title: "Patients",
      value: 0,
      icon: "pi pi-users",
    },
    {
      title: "Rendez-vous",
      value: 0,
      icon: "pi pi-calendar",
    },
    {
      title: "Consultations",
      value: 0,
      icon: "pi pi-file-edit",
    },
    {
      title: "Prescriptions",
      value: 0,
      icon: "pi pi-file",
    },
  ];

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold mb-1">Dashboard</h1>
          <p className="text-secondary mb-0">
            Bienvenue sur votre espace MedFlow.
          </p>
        </div>

        <Button
          label="Actualiser"
          icon="pi pi-refresh"
          outlined
        />
      </div>

      <div className="row g-4">
        {statistics.map((statistic) => (
          <div
            key={statistic.title}
            className="col-12 col-md-6 col-xl-3"
          >
            <Card>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <span className="text-secondary d-block mb-2">
                    {statistic.title}
                  </span>

                  <span className="fs-3 fw-bold">
                    {statistic.value}
                  </span>
                </div>

                <i className={`${statistic.icon} fs-2`} />
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;