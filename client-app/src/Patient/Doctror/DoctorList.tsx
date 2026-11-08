import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { ProgressSpinner } from "primereact/progressspinner";
import { Message } from "primereact/message";

import {
  FaUserDoctor,
  FaBriefcase,
  FaPhone,
  FaIdCard,
  FaArrowRight,
  FaStethoscope,
  FaRotateRight,
} from "react-icons/fa6";
import { FaCalendarPlus, FaSearch } from "react-icons/fa";

interface Specialty {
  id: number;
  name: string;
  description: string;
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

export default function DoctorsList() {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [specialties, setSpecialties] = useState<Specialty[]>([]);
  const [search, setSearch] = useState("");
  const [selectedSpecialty, setSelectedSpecialty] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, specialtiesRes] = await Promise.all([
          api.get<Doctor[]>("/doctors/all"),
          api.get<Specialty[]>("/specialties"),
        ]);

        setDoctors(doctorsRes.data);
        setSpecialties(specialtiesRes.data);
      } catch (err) {
        console.error("Erreur de chargement :", err);
        setError("Impossible de charger les médecins. Veuillez réessayer.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredDoctors = doctors.filter((doctor) => {
    const term = search.trim().toLowerCase();

    const email = doctor.adminAccount?.email?.toLowerCase() ?? "";
    const license = doctor.licenseNumber?.toLowerCase() ?? "";
    const specialty = doctor.specialty?.name?.toLowerCase() ?? "";
    const matchesSearch =
      email.includes(term) ||
      license.includes(term) ||
      specialty.includes(term);

    const matchesSpecialty =
      selectedSpecialty === null || doctor.specialty?.id === selectedSpecialty;

    return matchesSearch && matchesSpecialty;
  });

  const resetFilters = () => {
    setSearch("");
    setSelectedSpecialty(null);
  };

  const doctorTemplate = (doctor: Doctor) => (
    <div
      key={doctor.id}
      className="border rounded-2 p-2 overflow-hidden"
    >
      <div className="d-flex flex-column">
        <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
          <div
            className="d-flex align-items-center justify-content-center rounded-2 bg-primary bg-opacity-10 text-primary flex-shrink-0"
            style={{ width: 30, height: 30 }}
          >
            <FaUserDoctor size={24} />
          </div>

          <span className="badge rounded-2 py-2 bg-warning text-wrap">
            {doctor.specialty?.name ?? "Non renseignée"}
          </span>
        </div>

        <h2
          className="h6 fw-bold text-info text-center mb-3 text-break"
          title={doctor.adminAccount?.email ?? "Médecin"}
        >
          {doctor.adminAccount?.email ?? "Médecin"}
        </h2>

        <hr className="border-secondary-subtle opacity-50 my-0 mb-3" />

        <div className="d-flex flex-column gap-3">
          <div className="d-flex align-items-start gap-3">
            <FaBriefcase className="text-primary mt-1 flex-shrink-0" />
            <div className="small fw-semibold text-break">
              <span className="fw-bold text-info">
                {doctor.yearsOfExperience ?? 0}
              </span>{" "}
              ans d'expérience
            </div>
          </div>

          <div className="d-flex align-items-start gap-3">
            <FaPhone className="text-primary flex-shrink-0" />
            <div
              className="small fw-semibold text-break"
              title={doctor.phone ?? ""}
            >
              {doctor.phone || "Téléphone non renseigné"}
            </div>
          </div>

          <div className="d-flex align-items-start gap-3">
            <FaIdCard className="text-primary mt-1 flex-shrink-0" />
            <div
              className="small fw-semibold text-break"
              title={doctor.licenseNumber ?? ""}
            >
              {doctor.licenseNumber || "Licence non renseignée"}
            </div>
          </div>
        </div>

        <span
          className="small  mt-1 mb-1"
          style={{
            width:"100%",
            fontSize:12
          }}
        >
          {doctor.biography || "Aucune biographie disponible."}
        </span>

        <div className="mt-auto pt-2">
          <Button
            label="Voir le profil"
            icon={<FaArrowRight />}
            iconPos="right"
            className="btn btn-primary w-100 d-flex align-items-center justify-content-center gap-2 rounded-3 fw-semibold"
            onClick={() => navigate(`/patient/doctorDetail/${doctor.id}`)}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="container">
      <div className="">
        <div className="border rounded-2 p-2">
          <div className="row align-items-center g-4">
            <div className="col-12 col-md">
              <div className="d-flex align-items-center gap-2 text-info small fw-semibold mb-0">
                <FaStethoscope size={25} />
                <h1 className="h2 fw-bold  mb-2">Nos médecins</h1>
              </div>

              <p className=" mb-0 small">
                Trouvez le professionnel de santé adapté à vos besoins.
              </p>
            </div>

            <div className="col-12 col-md-auto px-3">
              <div className="d-flex align-items-center gap-3 bg-primary bg-opacity-10 rounded-3 px-4 py-3">
                <div
                  className="d-flex align-items-center justify-content-center bg-white text-warning rounded-2"
                  style={{ width: 35, height: 35 }}
                >
                  <FaUserDoctor size={21} />
                </div>

                <div>
                  <div className=" fw-bold text-info mb-0">
                    {filteredDoctors.length}
                  </div>
                  <div className="small fw-bold text-warning">médecin(s)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row g-3 align-items-center mt-2">
          <div className="col-12 col-md-4 ">
            <Button
              label="rendez-vous"
              icon={<FaCalendarPlus className="mx-2" />}
              onClick={() => navigate("/patient/appointments/add")}
              className="rounded-2 py-2 w-50"
            />
          </div>
          <div className="col-12 col-md-4">
            <div className="">
              <InputText
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Email, licence ou spécialité"
                aria-label="Rechercher un médecin"
                className="w-100"
              />
            </div>
          </div>

          <div className="col-12 col-md-4">
            <Dropdown
              value={selectedSpecialty}
              options={specialties}
              optionLabel="name"
              optionValue="id"
              onChange={(e) => setSelectedSpecialty(e.value ?? null)}
              placeholder="Toutes les spécialités"
              showClear
              className="w-100"
            />
          </div>
        </div>

        {/* Chargement */}
        {loading && (
          <div className="bg-white border rounded-4 p-5 text-center">
            <ProgressSpinner style={{ width: "40px", height: "40px" }} />
            <p className="fw-semibold mt-3 mb-0">Chargement des médecins...</p>
          </div>
        )}

        {/* Erreur */}
        {!loading && error && (
          <div className="bg-white border rounded-4 p-4 p-md-5 text-center">
            <Message severity="error" text={error} />

            <div className="mt-3">
              <Button
                label="Réessayer"
                icon={<FaRotateRight />}
                outlined
                onClick={() => window.location.reload()}
              />
            </div>
          </div>
        )}

        {/* Aucun résultat */}
        {!loading && !error && filteredDoctors.length === 0 && (
          <div className="bg-white border rounded-4 shadow-sm p-4 p-md-5 text-center">
            <div
              className="d-inline-flex align-items-center justify-content-center bg-primary bg-opacity-10 text-primary rounded-circle mb-3"
              style={{ width: 64, height: 64 }}
            >
              <FaSearch size={24} />
            </div>

            <h2 className="h5 fw-bold text-dark">Aucun médecin trouvé</h2>

            <p className="fw-semibold mb-4">
              Essayez un autre terme ou choisissez une autre spécialité.
            </p>

            <Button
              label="Effacer les filtres"
              icon={<FaRotateRight />}
              outlined
              onClick={resetFilters}
            />
          </div>
        )}

        {/* Liste des médecins */}
        {!loading && !error && filteredDoctors.length > 0 && (
          <>
            <div className="row g-3 g-xl-4 mt-1">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="col-12 col-md-6 col-xl-3">
                  {doctorTemplate(doctor)}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
