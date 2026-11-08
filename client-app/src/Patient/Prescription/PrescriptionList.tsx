import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";

interface Medication {
  id: number;
  medicationName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string | null;
}

interface Prescription {
  id: number;
  medicalRecordId: number;
  prescriptionDate: string;
  notes?: string | null;
  medications: Medication[];
}

const PrescriptionList: React.FC = () => {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPrescriptions = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await api.get("/prescriptions");
        const data = response.data;

        // Adapte cette partie si ton backend enveloppe
        // les données dans une propriété "data".
        const items = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : null;

        if (!items) {
          throw new Error("Format de réponse inattendu.");
        }

        setPrescriptions(items);
      } catch (err) {
        console.error("Erreur de chargement des prescriptions :", err);
        setError(
          "Impossible de charger les prescriptions. Vérifiez le serveur et vos autorisations.",
        );
      } finally {
        setLoading(false);
      }
    };

    fetchPrescriptions();
  }, []);

  const filteredPrescriptions = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return prescriptions;

    return prescriptions.filter((prescription) => {
      const medications = prescription.medications
        .map((medication) => medication.medicationName)
        .join(" ");

      return (
        String(prescription.id).includes(term) ||
        String(prescription.medicalRecordId).includes(term) ||
        (prescription.notes ?? "").toLowerCase().includes(term) ||
        medications.toLowerCase().includes(term)
      );
    });
  }, [prescriptions, search]);

  const formatDate = (date: string) => {
    if (!date) return "Date non disponible";

    const parsedDate = new Date(`${date.slice(0, 10)}T00:00:00`);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(parsedDate);
  };

  if (loading) {
    return (
      <div className="container-fluid py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
        <p className="text-secondary mt-3 mb-0">
          Chargement des prescriptions...
        </p>
      </div>
    );
  }

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      {/* En-tête */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
        <div>
          <div className="text-primary fw-semibold small mb-2">
            ESPACE MÉDICAL
          </div>
          <h1 className="h3 fw-bold mb-2">Prescriptions</h1>
          <p className="text-secondary mb-0">
            Consultez et gérez les prescriptions médicales.
          </p>
        </div>

        <Link
          to="/prescriptions/create"
          className="btn btn-primary rounded-3 px-4 py-2"
        >
          <i className="bi bi-plus-lg me-2" aria-hidden="true" />
          Nouvelle prescription
        </Link>
      </div>

      {/* Statistiques */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}
              >
                <i className="bi bi-prescription2 fs-3" aria-hidden="true" />
              </div>
              <div>
                <div className="text-secondary small">
                  Total des prescriptions
                </div>
                <div className="fs-3 fw-bold">{prescriptions.length}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 col-sm-6 col-xl-4">
          <div className="card border-0 shadow-sm rounded-4 h-100">
            <div className="card-body p-4 d-flex align-items-center gap-3">
              <div
                className="rounded-3 bg-success bg-opacity-10 text-success d-flex align-items-center justify-content-center"
                style={{ width: 52, height: 52, flexShrink: 0 }}
              >
                <i className="bi bi-capsule fs-3" aria-hidden="true" />
              </div>
              <div>
                <div className="text-secondary small">
                  Médicaments prescrits
                </div>
                <div className="fs-3 fw-bold">
                  {prescriptions.reduce(
                    (total, prescription) =>
                      total + prescription.medications.length,
                    0,
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recherche */}
      <div className="card border-0 shadow-sm rounded-4 mb-4">
        <div className="card-body p-3">
          <div className="input-group">
            <span className="input-group-text bg-white border-end-0">
              <i className="bi bi-search text-secondary" aria-hidden="true" />
            </span>
            <input
              type="search"
              className="form-control border-start-0 ps-0 py-2"
              placeholder="Rechercher par ID, dossier ou médicament..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              aria-label="Rechercher une prescription"
            />
            {search && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setSearch("")}
              >
                Effacer
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <div className="alert alert-danger rounded-3" role="alert">
          <i className="bi bi-exclamation-circle me-2" aria-hidden="true" />
          {error}
          <button
            type="button"
            className="btn btn-sm btn-outline-danger ms-3"
            onClick={() => window.location.reload()}
          >
            Réessayer
          </button>
        </div>
      )}

      {/* Liste */}
      {!error && filteredPrescriptions.length === 0 ? (
        <div className="card border-0 shadow-sm rounded-4">
          <div className="card-body text-center py-5 px-3">
            <div className="text-primary mb-3">
              <i className="bi bi-file-medical fs-1" aria-hidden="true" />
            </div>
            <h2 className="h5 fw-bold">
              {search
                ? "Aucun résultat trouvé"
                : "Aucune prescription disponible"}
            </h2>
            <p className="text-secondary mb-4">
              {search
                ? "Essayez avec un autre mot-clé."
                : "Les prescriptions créées apparaîtront ici."}
            </p>
            {!search && (
              <Link
                to="/prescriptions/create"
                className="btn btn-primary rounded-3 px-4"
              >
                Créer une prescription
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="row g-3">
          {filteredPrescriptions.map((prescription) => (
            <div className="col-12 col-lg-6 col-xxl-4" key={prescription.id}>
              <article className="card border-0 shadow-sm rounded-4 h-100">
                <div className="card-body p-4">
                  <div className="d-flex justify-content-between align-items-start gap-2 mb-3">
                    <div className="d-flex align-items-center gap-3">
                      <div
                        className="rounded-3 bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                        style={{
                          width: 46,
                          height: 46,
                          flexShrink: 0,
                        }}
                      >
                        <i
                          className="bi bi-file-medical fs-4"
                          aria-hidden="true"
                        />
                      </div>
                      <div>
                        <h2 className="h6 fw-bold mb-1">
                          Prescription #{prescription.id}
                        </h2>
                        <span className="text-secondary small">
                          {formatDate(prescription.prescriptionDate)}
                        </span>
                      </div>
                    </div>

                    <span className="badge rounded-pill text-bg-light border">
                      {prescription.medications.length}{" "}
                      {prescription.medications.length > 1
                        ? "médicaments"
                        : "médicament"}
                    </span>
                  </div>

                  <div className="bg-light rounded-3 p-3 mb-3">
                    <div className="text-secondary small mb-1">
                      Dossier médical
                    </div>
                    <div className="fw-semibold">
                      #{prescription.medicalRecordId}
                    </div>
                  </div>

                  <h3 className="small fw-bold mb-3">
                    <i
                      className="bi bi-capsule me-2 text-primary"
                      aria-hidden="true"
                    />
                    Médicaments
                  </h3>

                  {prescription.medications.length > 0 ? (
                    <div className="d-flex flex-column gap-3">
                      {prescription.medications.map((medication) => (
                        <div
                          key={medication.id}
                          className="border-start border-3 border-primary ps-3"
                        >
                          <div className="fw-semibold">
                            {medication.medicationName}
                          </div>
                          <div className="text-secondary small mt-1">
                            {medication.dosage} · {medication.frequency}
                          </div>
                          <div className="text-secondary small">
                            Durée : {medication.duration}
                          </div>
                          {medication.instructions && (
                            <div className="small mt-1">
                              {medication.instructions}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-secondary small">
                      Aucun médicament renseigné.
                    </p>
                  )}

                  {prescription.notes && (
                    <div className="mt-3 pt-3 border-top">
                      <div className="text-secondary small mb-1">
                        Notes médicales
                      </div>
                      <p className="small mb-0">{prescription.notes}</p>
                    </div>
                  )}

                  <div className="d-flex flex-wrap gap-2 mt-4 pt-3 border-top">
                    <Link
                      to={`/prescriptions/${prescription.id}`}
                      className="btn btn-outline-primary rounded-3 flex-grow-1"
                    >
                      <i className="bi bi-eye me-2" aria-hidden="true" />
                      Détails
                    </Link>

                    <Link
                      to={`/prescriptions/${prescription.id}/edit`}
                      className="btn btn-outline-secondary rounded-3 flex-grow-1"
                    >
                      <i className="bi bi-pencil me-2" aria-hidden="true" />
                      Modifier
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          ))}
        </div>
      )}

      <div className="text-secondary small mt-4">
        {filteredPrescriptions.length} prescription(s) affichée(s)
      </div>
    </div>
  );
};

export default PrescriptionList;
