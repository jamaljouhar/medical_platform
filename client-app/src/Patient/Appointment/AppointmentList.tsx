import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

import {
  FaCalendarCheck,
  FaCalendarPlus,
  FaMagnifyingGlass,
  FaRotate,
  FaUserDoctor,
  FaEye,
  FaClock,
} from "react-icons/fa6";

import api from "../../services/api";
import "./Appointment.css"
import { FaEdit } from "react-icons/fa";

interface Appointment {
  id: number;
  appointmentDate: string;
  reason: string;
  status: string;
  doctorName?: string;
  patientName?: string;
  doctor?: {
    id?: number;
    name?: string;
    fullname?: string;
    userAccount?: {
      email?: string;
    };
  };
  doctorSpecialty: string | null;
}

const statusOptions = [
  { label: "Tous les statuts", value: "" },
  { label: "En attente", value: "PENDING" },
  { label: "Confirmé", value: "CONFIRMED" },
  { label: "Annulé", value: "CANCELLED" },
  { label: "Terminé", value: "COMPLETED" },
  { label: "Refusé", value: "REJECTED" },
];

function getStatusLabel(status: string) {
  return (
    statusOptions.find((option) => option.value === status)?.label ||
    status ||
    "Inconnu"
  );
}

function getStatusSeverity(
  status: string,
): "success" | "info" | "warning" | "danger" | "secondary" {
  switch (status) {
    case "CONFIRMED":
    case "COMPLETED":
      return "success";
    case "PENDING":
      return "warning";
    case "CANCELLED":
    case "REJECTED":
      return "danger";
    default:
      return "secondary";
  }
}

function formatDate(date: string) {
  if (!date) return "-";

  const parsedDate = new Date(date.replace(" ", "T"));
  if (Number.isNaN(parsedDate.getTime())) return date;

  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

function getDoctorName(appointment: Appointment) {
  return (
    appointment.doctorName ||
    appointment.doctor?.fullname ||
    appointment.doctor?.name ||
    appointment.doctor?.userAccount?.email ||
    "Médecin"
  );
}

function AppointmentList() {
  const navigate = useNavigate();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/appointments/me");
      setAppointments(response.data);
    } catch {
      setError("Impossible de charger les rendez-vous. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAppointments();
  }, []);

  const filteredAppointments = useMemo(() => {
    const term = search.trim().toLowerCase();

    return appointments.filter((appointment) => {
      const matchesStatus =
        !selectedStatus || appointment.status === selectedStatus;

      const searchableText = [
        appointment.id,
        getDoctorName(appointment),
        appointment.doctorSpecialty || "",
        appointment.reason,
        getStatusLabel(appointment.status),
        formatDate(appointment.appointmentDate),
      ]
        .join(" ")
        .toLowerCase();

      return matchesStatus && searchableText.includes(term);
    });
  }, [appointments, search, selectedStatus]);

  const statusCounts = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === "PENDING").length,
    confirmed: appointments.filter((a) => a.status === "CONFIRMED").length,
    cancelled: appointments.filter((a) => a.status === "CANCELLED").length,
  };

  const doctorBody = (appointment: Appointment) => (
    <div className="d-flex align-items-center gap-2">
      <div
        className="d-flex align-items-center justify-content-center rounded-circle bg-info bg-opacity-10 text-info flex-shrink-0"
        style={{ width: 40, height: 40 }}
        aria-hidden="true"
      >
        <FaUserDoctor />
      </div>
      <div className="min-w-0">
        <div className="small text-break">
          {getDoctorName(appointment)}
        </div>
        {appointment.doctorSpecialty&& (
          <small className="small text-info">
            {appointment.doctorSpecialty}
          </small>
        )}
      </div>
    </div>
  );

  const dateBody = (appointment: Appointment) => (
    <div className="d-flex align-items-center gap-2">
      <FaClock className="flex-shrink-0 text-info" />
      <span className="small">{formatDate(appointment.appointmentDate)}</span>
    </div>
  );

  const statusBody = (appointment: Appointment) => (
    <Tag
      value={getStatusLabel(appointment.status)}
      severity={getStatusSeverity(appointment.status)}
    />
  );

  const reasonBody = (appointment: Appointment) => (
    <span className="d-inline-block small text-break" style={{ maxWidth: 240 }}>
      {appointment.reason || "-"}
    </span>
  );

  const actionBody = (appointment: Appointment) => (
    <div className="d-flex gap-2">
      <Button
      icon={<FaEye />}
      severity="info"
      aria-label={`Voir les détails du rendez-vous ${appointment.id}`}
      onClick={() => navigate(`/patient/appointmentDetail/${appointment.id}`)}
      className="rounded-2"
      style={{
        width: 25,
        height: 25
      }}
    />

    <Button
      icon={<FaEdit />}
      severity="info"
      aria-label={`Voir les détails du rendez-vous ${appointment.id}`}
      onClick={() => navigate(`/patient/appointments/${appointment.id}/edit`)}
      className="rounded-2 bg-warning border-0"
      style={{
        width: 25,
        height: 25
      }}
    />
    </div>

  );

  return (
    <div className="container appointment-list">
      <div className="d-flex flex-column border rounded-2 p-3 flex-md-row justify-content-between align-items-md-center gap-3 mb-2">
        <div>
          <div className="d-flex align-items-center gap-2 mb-2">
            <div className="rounded-3 bg-info bg-opacity-10 text-info p-2">
              <FaCalendarCheck size={22} />
            </div>
            <h1 className="h3 fw-bold text-primary mb-0">Mes rendez-vous</h1>
          </div>
          <p className="fw-semibold mb-0">
            Consultez et suivez vos rendez-vous médicaux.
          </p>
        </div>

        <Button
          label="rendez-vous"
          icon={<FaCalendarPlus className="mx-2" />}
          onClick={() => navigate("/patient/appointments/add")}
          className="rounded-2 py-2"
        />
      </div>

      <div className="row g-3 mb-2">
        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center gap-2 gap-sm-3">
              <div className="rounded-3 bg-primary bg-opacity-10 text-primary p-2 p-sm-3">
                <FaCalendarCheck size={20} />
              </div>
              <div>
                <small className="text-primary fw-semibold">Total</small>
                <h2 className="h4 fw-bold mb-0">{statusCounts.total}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center gap-2 gap-sm-3">
              <div className="rounded-3 bg-warning bg-opacity-10 text-warning p-2 p-sm-3">
                <FaCalendarCheck size={20} />
              </div>
              <div>
                <small className="text-warning fw-semibold">En attente</small>
                <h2 className="h4 fw-bold mb-0">{statusCounts.pending}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center gap-2 gap-sm-3">
              <div className="rounded-3 bg-success bg-opacity-10 text-success p-2 p-sm-3">
                <FaCalendarCheck size={20} />
              </div>
              <div>
                <small className="text-success fw-semibold">Confirmés</small>
                <h2 className="h4 fw-bold mb-0">{statusCounts.confirmed}</h2>
              </div>
            </div>
          </div>
        </div>

        <div className="col-6 col-xl-3">
          <div className="card border-0 shadow-sm rounded-3 h-100">
            <div className="card-body d-flex align-items-center gap-2 gap-sm-3">
              <div className="rounded-3 bg-danger bg-opacity-10 text-danger p-2 p-sm-3">
                <FaCalendarCheck size={20} />
              </div>
              <div>
                <small className="text-danger fw-semibold">Annulés</small>
                <h2 className="h4 fw-bold mb-0">{statusCounts.cancelled}</h2>
              </div>
            </div>
          </div>
        </div>
      </div>

      <section className="card border-0 shadow-sm rounded-2">
        <div className="card-body">
          <div className="d-flex flex-column flex-lg-row justify-content-between gap-3 mb-2">
            <div>
              <h2 className="h5 fw-bold text-primary mb-1">
                Liste des rendez-vous
              </h2>
              <small className="fw-semibold">
                {filteredAppointments.length} résultat(s)
              </small>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-2 appointment-filters">
              <span className="p-input-icon-left w-100">
                <FaMagnifyingGlass className="ms-3 text-info" />
                <InputText
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Rechercher..."
                  className="w-100 ps-5"
                  aria-label="Rechercher un rendez-vous"
                />
              </span>

              <Dropdown
                value={selectedStatus}
                options={statusOptions}
                onChange={(event) => setSelectedStatus(event.value)}
                optionLabel="label"
                optionValue="value"
                placeholder="Filtrer par statut"
                className="w-100"
                style={{ minWidth: 190 }}
                aria-label="Filtrer par statut"
              />
            </div>
          </div>

          {error && (
            <div className="mb-3">
              <Message severity="error" text={error} className="w-100" />
              <Button
                label="Réessayer"
                icon={<FaRotate />}
                text
                className="mt-2"
                onClick={() => void fetchAppointments()}
              />
            </div>
          )}

          {loading ? (
            <div className="d-flex flex-column align-items-center py-5">
              <ProgressSpinner style={{ width: 45, height: 45 }} />
              <span className="text-secondary mt-3">
                Chargement des rendez-vous...
              </span>
            </div>
          ) : !error ? (
            <>
              <div className="d-none d-md-block">
                <DataTable
                  value={filteredAppointments}
                  dataKey="id"
                  paginator
                  rows={10}
                  rowsPerPageOptions={[25, 50, 100]}
                  stripedRows
                  removableSort
                  emptyMessage="Aucun rendez-vous trouvé."
                  size="small"
                  rowHover
                  tableStyle={{ minWidth: "680px", width: "100%" }}
                >
                  <Column
                    header="Médecin"
                    body={doctorBody}
                    style={{ minWidth: "180px" }}
                  />
                  <Column
                    field="appointmentDate"
                    header="Date et heure"
                    body={dateBody}
                    sortable
                    style={{ minWidth: "175px" }}
                  />
                  <Column
                    field="reason"
                    header="Motif"
                    body={reasonBody}
                    style={{ minWidth: "150px" }}
                  />
                  <Column
                    field="status"
                    header="Statut"
                    body={statusBody}
                    sortable
                    style={{ minWidth: "120px" }}
                  />
                  <Column
                    header="Détails"
                    body={actionBody}
                    style={{ width: "80px", textAlign: "center" }}
                  />
                </DataTable>
              </div>

              <div className="d-md-none d-flex flex-column gap-3">
                {filteredAppointments.length === 0 ? (
                  <div className="text-center fw-semibold py-4">
                    Aucun rendez-vous trouvé.
                  </div>
                ) : (
                  filteredAppointments.map((appointment) => (
                    <article key={appointment.id} className="appointment-card">
                      <div className="appointment-card-header">
                        <span
                          className={`appointment-status status-${appointment.status.toLowerCase()}`}
                        >
                          {getStatusLabel(appointment.status)}
                        </span>

                        <span className="appointment-number">
                          N° {appointment.id}
                        </span>
                      </div>

                      <div className="appointment-date">
                        <div className="appointment-icon">
                          <FaCalendarCheck />
                        </div>

                        <div>
                          <div className="appointment-label">
                            Date du rendez-vous
                          </div>
                          <div className="appointment-date-value">
                            {formatDate(appointment.appointmentDate)}
                          </div>
                        </div>
                      </div>

                      <div className="appointment-doctor">
                        <div className="appointment-doctor-avatar">
                          <FaUserDoctor />
                        </div>

                        <div className="appointment-doctor-info">
                          <div className="appointment-doctor-name">
                            {getDoctorName(appointment)}
                          </div>

                          <div className="appointment-specialty">
                            {appointment.doctorSpecialty|| "Médecin"}
                          </div>
                        </div>
                      </div>

                      <div className="appointment-reason">
                        <div className="appointment-label">
                          Motif de consultation
                        </div>
                        <p>{appointment.reason || "Non précisé"}</p>
                      </div>

                      <Button
                        icon={<FaEye />}
                        severity="info"
                        aria-label={`Voir les détails du rendez-vous ${appointment.id}`}
                        label="Voir les détails"
                        onClick={() =>
                          navigate(
                            `/patient/appointmentDetail/${appointment.id}`,
                          )
                        }
                        className="rounded-2 py-2 w-100"
                      />
                    </article>
                  ))
                )}
              </div>
            </>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default AppointmentList;
