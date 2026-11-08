import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tag } from "primereact/tag";
import { ProgressSpinner } from "primereact/progressspinner";
import { FaUserDoctor } from "react-icons/fa6";
import api from "../../services/api";
import "./Appointment.css";
import { FaArrowLeft, FaCalendar, FaClock, FaLock } from "react-icons/fa";
import { Button } from "primereact/button";

interface Appointment {
  id: number;
  appointmentDate: string;
  reason: string | null;
  status: string;
  doctorName: string;
  doctorEmail: string | null;
  doctorSpecialty: string | null;
  patientName: string;
}

type Severity = "success" | "info" | "warning" | "danger" | "secondary";

const STATUSES: Record<
  string,
  { label: string; severity: Severity; icon: string }
> = {
  PENDING: {
    label: "En attente",
    severity: "warning",
    icon: "pi pi-hourglass",
  },
  CONFIRMED: {
    label: "Confirmé",
    severity: "success",
    icon: "pi pi-check-circle",
  },
  CANCELLED: {
    label: "Annulé",
    severity: "danger",
    icon: "pi pi-times-circle",
  },
  COMPLETED: {
    label: "Terminé",
    severity: "info",
    icon: "pi pi-verified",
  },
  REJECTED: {
    label: "Refusé",
    severity: "danger",
    icon: "pi pi-ban",
  },
};

function AppointmentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function fetchAppointment() {
      if (!id) {
        setError("Identifiant du rendez-vous manquant.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get<Appointment>(`/appointments/${id}`);

        if (active) {
          setAppointment(response.data);
        }
      } catch {
        if (active) {
          setError("Impossible de récupérer le rendez-vous.");
          setAppointment(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    void fetchAppointment();

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <main className="appointment-page">
        <div className="appointment-state" role="status" aria-live="polite">
          <ProgressSpinner style={{ width: 32, height: 32 }} strokeWidth="4" />
          <p>Chargement du rendez-vous…</p>
        </div>
      </main>
    );
  }

  if (error || !appointment) {
    return (
      <main className="appointment-page">
        <div className="appointment-state appointment-state--error">
          <i className="pi pi-calendar-times" aria-hidden="true" />
          <h1>Rendez-vous indisponible</h1>
          <p>{error || "Ce rendez-vous est introuvable."}</p>

          <button
            className="appointment-btn appointment-btn--primary"
            onClick={() => navigate(-1)}
          >
            <i className="pi pi-arrow-left" aria-hidden="true" />
            Retour
          </button>
        </div>
      </main>
    );
  }

  const status = STATUSES[appointment.status?.toUpperCase()] ?? {
    label: appointment.status || "Non renseigné",
    severity: "secondary" as const,
    icon: "pi pi-question-circle",
  };

  const dateValue = appointment.appointmentDate
    ? new Date(appointment.appointmentDate.replace(" ", "T"))
    : null;

  const validDate = Boolean(dateValue && !Number.isNaN(dateValue.getTime()));

  const formattedDate = validDate
    ? dateValue!.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "Non renseignée";

  const formattedTime = validDate
    ? dateValue!.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Non renseignée";

  const doctorName = appointment.doctorName
    ? `Dr. ${appointment.doctorName}`
    : "Médecin non renseigné";

  const information = [
    {
      icon: "pi pi-user",
      label: "Médecin",
      value: doctorName,
    },
    {
      icon: "pi pi-briefcase",
      label: "Spécialité",
      value: appointment.doctorSpecialty || "Non renseignée",
    },
    {
      icon: "pi pi-envelope",
      label: "Email professionnel",
      value: appointment.doctorEmail || "Non renseigné",
    },
    {
      icon: "pi pi-users",
      label: "Patient",
      value: appointment.patientName || "Non renseigné",
    },
  ];

  return (
    <main className="appointment-page">
      <div className="appointment-container">
        <article className="appointment-detail">
          <header className="appointment-hero">
            <div className="appointment-hero__main">
              <div className="appointment-doctor-avatar" aria-hidden="true">
                <FaUserDoctor />
              </div>

              <div className="appointment-hero__identity">
                <span className="appointment-eyebrow">
                  DOSSIER DE RENDEZ-VOUS · #{appointment.id}
                </span>

                <h1>{doctorName}</h1>

                <p>{appointment.doctorSpecialty || "Consultation médicale"}</p>
              </div>

              <div className="appointment-hero__status">
                <span>Statut</span>

                <Tag
                  value={status.label}
                  severity={status.severity}
                  icon={status.icon}
                  className="appointment-status-tag"
                />
              </div>
            </div>

            <div className="appointment-hero__footer">
              <span>
                <i className="pi pi-shield" aria-hidden="true" />
                Données médicales confidentielles
              </span>

              <span>
                <i className="pi pi-calendar" aria-hidden="true" />
                Rendez-vous #{appointment.id}
              </span>
            </div>
          </header>

          <div className="appointment-body px-4">
            <section
              className="appointment-section"
              aria-labelledby="schedule-title"
            >
              <div className="appointment-schedule-grid">
                <div className="appointment-date-panel">
                  <span className="appointment-date-panel__icon">
                    <FaCalendar size={30} className="mt-2 text-success" />
                  </span>

                  <div className="appointment-data">
                    <span className="small text-info">Date du rendez-vous</span>

                    <strong className="appointment-data__value appointment-date-text">
                      {formattedDate}
                    </strong>
                  </div>
                </div>

                <div className="appointment-date-panel">
                  <span className="appointment-date-panel__icon appointment-date-panel__icon--mint">
                    <FaClock size={30} className="mt-2 text-info" />
                  </span>

                  <div className="appointment-data">
                    <span className="small text-info">
                      Heure du rendez-vous
                    </span>

                    <strong className="appointment-data__value appointment-time-text">
                      {formattedTime}
                    </strong>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="appointment-section"
              aria-labelledby="information-title"
            >
              <div className="appointment-information-grid">
                {information.map((item) => (
                  <div
                    className="appointment-information-item"
                    key={item.label}
                  >
                    <span className="appointment-information-item__icon mt-2">
                      <i className={item.icon} aria-hidden="true" />
                    </span>

                    <div className="appointment-information-item__content">
                      <span className="small text-info">{item.label}</span>

                      <strong className="appointment-information-item__value">
                        {item.label === "Email professionnel" &&
                        appointment.doctorEmail ? (
                          <a href={`mailto:${appointment.doctorEmail}`}>
                            {item.value}
                          </a>
                        ) : (
                          item.value
                        )}
                      </strong>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Motif de consultation */}
            <section
              className="appointment-section appointment-section--last"
              aria-labelledby="reason-title"
            >
              <div className="appointment-section-heading">
                <span className="appointment-section-heading__icon appointment-section-heading__icon--amber">
                  <i className="pi pi-file-edit" />
                </span>

                <div>
                  <h2 id="reason-title">Motif de consultation</h2>
                  <p>
                    {appointment.reason?.trim() || "Aucun motif renseigné."}
                  </p>
                </div>
              </div>
            </section>
          </div>

          <footer className="appointment-footer">
            <span className="appointment-footer__note text-success fw-semibold">
              <FaLock size={25} className="text-success"/>
              Confidentialité médicale
            </span>

            <Button
            icon={<FaArrowLeft size={12}/>}
              className="appointment-btn appointment-btn--secondary"
              onClick={() => navigate(-1)}
              style={{
                width: 60,
                height:25
              }}
            />

          </footer>
        </article>
      </div>
    </main>
  );
}

export default AppointmentDetail;
