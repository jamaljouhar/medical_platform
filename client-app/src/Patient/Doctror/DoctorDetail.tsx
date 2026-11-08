import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";
import {
  FaUserDoctor,
  FaBriefcase,
  FaPhone,
  FaIdCard,
  FaEnvelope,
} from "react-icons/fa6";

import api from "../../services/api";

interface Specialty {
  id: number;
  name: string;
  description?: string | null;
}

interface Doctor {
  id: number;
  licenseNumber: string;
  phone: string | null;
  yearsOfExperience: number;
  biography: string | null;
  adminAccount?: {
    id: number;
    email: string;
    role: string;
    enabled: boolean;
  };
  specialty?: Specialty | null;
}

function DoctorDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDoctor = async () => {
      if (!id || !Number.isInteger(Number(id)) || Number(id) <= 0) {
        setError("Identifiant du médecin invalide.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await api.get<Doctor>(`/doctors/${id}`);
        setDoctor(response.data);
      } catch (err) {
        setError("Impossible de charger les informations du médecin.");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  if (loading) {
    return (
      <div className="doctor-detail-loading text-center">
        <ProgressSpinner />
        <p>Chargement du profil du médecin...</p>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="container py-3">
        <Button
          label="Retour aux médecins"
          icon="pi pi-arrow-left"
          severity="secondary"
          text
          onClick={() => navigate("/patient/doctors")}
          className="mb-3"
        />

        <Message
          severity="error"
          text={error || "Médecin introuvable."}
          className="w-100"
        />
      </div>
    );
  }

return (
  <div className="container">
    <div className="p-2 rounded-2 ">
      <div className="text-center">
        <div
          className="mx-auto d-flex justify-content-center align-items-center rounded-circle overflow-hidden border"
          style={{
            width: "60px",
            height: "60px",
            backgroundColor: "rgba(13, 202, 240, 0.10)",
          }}
        >
          <FaUserDoctor className="text-info" style={{ fontSize: "2rem" }} />
        </div>
      </div>

      <div className="row g-2 mt-1">
        <div className="col-12 col-lg-6">
          <div className="border rounded py-3 px-4">
            <div className="d-flex align-items-center justify-content-center gap-2 mb-2">
              <div
                className="d-flex justify-content-center align-items-center rounded flex-shrink-0"
                style={{
                  width: "34px",
                  height: "34px",
                  backgroundColor: "rgba(13, 202, 240, 0.10)",
                }}
              >
                <FaBriefcase className="text-info" />
              </div>

              <div>
                <h6 className="fw-bold text-info mb-0">
                  Informations professionnelles
                </h6>
                <small className="fw-semibold">Profil et expérience</small>
              </div>
            </div>
            <hr />

            <div className="row g-3 mt-1">
              <div className="row">
                <div className="col-6">
                  <small className="text-info d-block fw-semibold mb-1">
                    Spécialité
                  </small>
                  <div className="d-flex align-items-center gap-2">
                    <FaUserDoctor className="text-info flex-shrink-0" />
                    <span className="fw-semibold text-break">
                      {doctor.specialty?.name || "-"}
                    </span>
                  </div>
                </div>

                <div className="col-6">
                  <small className="text-info d-block fw-semibold mb-1">
                    Téléphone
                  </small>
                  <div className="d-flex align-items-center gap-2">
                    <FaPhone className="text-info flex-shrink-0" />
                    <span className="fw-semibold text-break">
                      {doctor.phone || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="row g-3">
                {/* Expérience */}
                <div className="col-6">
                  <small className="text-info d-block fw-semibold mb-1">
                    Expérience
                  </small>

                  <div className="d-flex align-items-center gap-2">
                    <FaBriefcase className="text-info flex-shrink-0" />
                    <span className="fw-semibold">
                      {doctor.yearsOfExperience} ans
                    </span>
                  </div>
                </div>

                {/* Licence */}
                <div className="col-6">
                  <small className="text-info fw-semibold d-block mb-1">
                    N° de licence
                  </small>

                  <div className="d-flex align-items-center gap-2">
                    <FaIdCard className="text-info flex-shrink-0" />
                    <span className="fw-semibold text-break">
                      {doctor.licenseNumber || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-6">
          <div className="border rounded p-3 h-100">
            <div className="d-flex align-items-center gap-2 mb-3">
              <div
                className="d-flex justify-content-center align-items-center rounded flex-shrink-0"
                style={{
                  width: "34px",
                  height: "34px",
                  backgroundColor: "rgba(13, 202, 240, 0.10)",
                }}
              >
                <FaIdCard className="text-info" />
              </div>

              <div>
                <h6 className="fw-bold mb-0 text-info">
                  Informations du compte
                </h6>
                <small className="fw-semibold">Coordonnées et statut</small>
              </div>
            </div>

            <hr />

            <div className="row g-3 mt-1">
              <div className="col-6">
                <small className="text-info d-block fw-semibold mb-1">
                  Statut du compte
                </small>
                <Tag
                  value={doctor.adminAccount?.enabled ? "Active" : "Disabled"}
                  severity={doctor.adminAccount?.enabled ? "success" : "danger"}
                  style={{ fontSize: "0.7rem" }}
                />
              </div>

              <div className="col-6">
                <small className="text-info d-block fw-semibold mb-1">
                  Adresse e-mail
                </small>
                <div className="d-flex align-items-start gap-2">
                  <FaEnvelope className="text-info mt-1 flex-shrink-0" />
                  <span className="fw-semibold text-break">
                    {doctor.adminAccount?.email || "-"}
                  </span>
                </div>
              </div>

              <div className="col-12">
                <small className="text-info fw-semibold d-block mb-1">
                  Description de la spécialité
                </small>
                <small className="mb-0  text-break">
                  {doctor.specialty?.description ||
                    "Aucune description disponible."}
                </small>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12">
          <div className="border rounded p-3">
            <div className="d-flex align-items-center gap-2 mb-2">
              <FaUserDoctor className="text-info" />
              <h6 className="fw-bold mb-0">À propos du médecin</h6>
            </div>

            <p className="text-secondary mb-0 text-break">
              {doctor.biography || "Aucune biographie disponible."}
            </p>
          </div>
        </div>
      </div>

      {/* Bouton rendez-vous */}
      <div className="border mt-3 p-3 rounded-2">
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3">
          <div>
            <h6 className="fw-bold mb-1 text-success">
              Prêt pour une consultation ?
            </h6>
            <small className="fw-semibold">
              Prenez rendez-vous avec ce médecin.
            </small>
          </div>

          <Button
            label="Prendre rendez-vous"
            icon="pi pi-calendar-plus"
            className="rounded-2"
            style={{
              fontSize: 10,
            }}
            onClick={() => navigate(`/patient/appointments/add`)}
          />
        </div>
      </div>
    </div>
  </div>
);
}
export default DoctorDetail;