import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Card } from "primereact/card";
import { Toolbar } from "primereact/toolbar";
import { Toast } from "primereact/toast";
import api from "../../services/api";

interface Patient {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  enabled: boolean;
}

function PatientList() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  const loadPatients = async () => {
    try {
      setLoading(true);

      const response = await api.get("/patient");

      setPatients(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement des patients :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPatients();
  }, []);

  const filteredPatients = patients.filter((patient) => {
    const value = search.toLowerCase();

    return (
      patient.fullname.toLowerCase().includes(value) ||
      patient.email.toLowerCase().includes(value) ||
      patient.phone?.toLowerCase().includes(value)
    );
  });

  const actionBodyTemplate = () => {
    return (
      <div className="d-flex gap-2">
        <Button icon="pi pi-eye" rounded text severity="info" tooltip="Voir" />
        <Button
          icon="pi pi-pencil"
          rounded
          text
          severity="warning"
          tooltip="Modifier"
        />
        <Button
          icon="pi pi-trash"
          rounded
          text
          severity="danger"
          tooltip="Supprimer"
        />
      </div>
    );
  };

  const statusBodyTemplate = (patient: Patient) => {
    return (
      <Tag
        value={patient.enabled ? "Actif" : "Inactif"}
        severity={patient.enabled ? "success" : "danger"}
      />
    );
  };

  const startContent = (
    <div>
      <h2 className="h4 mb-1">Patients</h2>
      <span className="text-secondary">Gestion des patients MedFlow</span>
    </div>
  );

  const endContent = <Button label="Nouveau patient" icon="pi pi-user-plus" />;

  return (
    <div className="p-4">
      <Toast />

      <Toolbar
        start={startContent}
        end={endContent}
        className="mb-4 border-0"
      />

      <Card>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher un patient..."
            />
          </span>

          <Button
            icon="pi pi-refresh"
            label="Actualiser"
            severity="secondary"
            outlined
            loading={loading}
            onClick={loadPatients}
          />
        </div>

        <DataTable
          value={filteredPatients}
          loading={loading}
          paginator
          rows={10}
          rowsPerPageOptions={[5, 10, 25, 50]}
          emptyMessage="Aucun patient trouvé"
          responsiveLayout="scroll"
          stripedRows
          showGridlines
        >
          <Column field="fullname" header="Nom complet" sortable />

          <Column field="email" header="Email" sortable />

          <Column field="phone" header="Téléphone" />

          <Column field="dateOfBirth" header="Date de naissance" sortable />

          <Column header="Statut" body={statusBodyTemplate} />

          <Column
            header="Actions"
            body={actionBodyTemplate}
            style={{ width: "180px" }}
          />
        </DataTable>
      </Card>
    </div>
  );
}

export default PatientList;
