import { useEffect, useState } from "react";
import { Link,useNavigate } from "react-router-dom";

import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";

import {
  FaEnvelope,
  FaPhone,
  FaCalendarAlt,
  FaUser,
  FaIdCard,
  FaArrowLeft,
  FaEdit,
  FaMapMarkerAlt,
} from "react-icons/fa";

import api from "../../services/api";

interface Patient {
  id: number;
  fullname: string;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;

  userAccount: {
    id: number;
    email: string;
    role: string;
    enabled: boolean;
  };
}

function PatientProfile() {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        const response = await api.get("/patient/profile");
        const result = response.data?.data ?? response.data;
        setPatient(result);

      } catch (error) {
        console.error(
          "Erreur lors du chargement du profil patient :",
          error
        );

        setPatient(null);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  const formatDate = (date: string | null): string => {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const formatRole = (role: string): string => {
    return role.replace("ROLE_", "");
  };

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center py-5">
        <div className="text-center text-info">
          <i
            className="pi pi-spin pi-spinner"
            style={{ fontSize: "2rem" }}
          />

          <div className="small mt-2">
            Loading profile...
          </div>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i
            className="pi pi-user-minus text-info"
            style={{ fontSize: "2.5rem" }}
          />

          <h5 className="fw-bold mt-3 mb-2">
            Profile not found
          </h5>

          <p className="text-info small mb-3">
            Unable to load your patient profile.
          </p>

          <Button
            label="Back"
            icon={<FaArrowLeft />}
            severity="secondary"
            outlined
            size="small"
            onClick={() => navigate(-1)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center">
        <Button
          icon={<FaArrowLeft />}
          size="small"
          onClick={() => navigate(-1)}
          className="rounded-2 m-1 bg-secondary"
          style={{
            width: "30px",
            height: "30px",
            padding: "0",
          }}
        />

        <Link to={`/patient/editProfile/${patient.id}`}>
          <Button
            icon={<FaEdit />}
            severity="info"
            size="small"
            className="rounded-2 m-1"
            style={{
              width: "30px",
              height: "30px",
              padding: "0",
            }}
          />
        </Link>
      </div>

      <Card className="shadow-sm border">
        <div className="text-center">
          <div
            className="mx-auto d-flex justify-content-center align-items-center rounded-circle overflow-hidden border"
            style={{
              width: "50px",
              height: "50px",
              backgroundColor: "rgba(13, 202, 240, 0.10)",
            }}
          >
            <FaUser className="text-info" style={{ fontSize: "2rem" }} />
          </div>

          <h4 className="fw-bold mb-1 mt-1">{patient.fullname || "Patient"}</h4>

          <div className="d-flex justify-content-center align-items-center gap-2">
            <Tag
              value="Patient"
              severity="info"
              style={{ fontSize: "0.7rem" }}
            />

            <Tag
              value={patient.userAccount.enabled ? "Active" : "Disabled"}
              severity={patient.userAccount.enabled ? "success" : "danger"}
              style={{ fontSize: "0.7rem" }}
            />
          </div>
        </div>

        <div className="row g-2  mt-3">
          {/* Personal Information */}
          <div className="col-lg-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div
                  className="d-flex justify-content-center align-items-center rounded"
                  style={{
                    width: "34px",
                    height: "34px",
                    backgroundColor: "rgba(13, 202, 240, 0.10)",
                  }}
                >
                  <FaUser className="text-info" />
                </div>

                <div>
                  <h6 className="fw-bold mb-0">Personal Information</h6>

                  <small className="text-info">Basic profile details</small>
                </div>
              </div>

              <hr />

              <div className="row g-3">
                {/* Full Name */}
                <div className="col-12">
                  <small className="text-info d-block mb-1">Full Name</small>

                  <span className="fw-semibold">{patient.fullname || "-"}</span>
                </div>

                {/* Birth Date */}
                <div className="col-6">
                  <small className="text-info d-block mb-1">Birth Date</small>

                  <div className="d-flex align-items-center gap-2">
                    <FaCalendarAlt className="text-info" />

                    <span className="fw-semibold">
                      {formatDate(patient.dateOfBirth)}
                    </span>
                  </div>
                </div>

                {/* Phone */}
                <div className="col-6">
                  <small className="text-info d-block mb-1">Phone</small>

                  <div className="d-flex align-items-center gap-2">
                    <FaPhone className="text-info" />

                    <span className="fw-semibold">{patient.phone || "-"}</span>
                  </div>
                </div>

                {/* Address */}
                <div className="col-12">
                  <small className="text-info d-block mb-1">Address</small>

                  <div className="d-flex align-items-start gap-2">
                    <FaMapMarkerAlt className="text-info mt-1" />

                    <span className="fw-semibold text-break">
                      {patient.address || "-"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="col-lg-6">
            <div className="border rounded p-3 h-100">
              <div className="d-flex align-items-center gap-2 mb-2">
                <div
                  className="d-flex justify-content-center align-items-center rounded"
                  style={{
                    width: "34px",
                    height: "34px",
                    backgroundColor: "rgba(13, 202, 240, 0.10)",
                  }}
                >
                  <FaIdCard className="text-info" />
                </div>

                <div>
                  <h6 className="fw-bold mb-0">Account Information</h6>

                  <small className="text-info">
                    Account and contact details
                  </small>
                </div>
              </div>

              <hr />

              <div className="row g-3">
                {/* Email */}
                <div className="col-12">
                  <small className="text-info d-block mb-1">Email</small>

                  <div className="d-flex align-items-center gap-2">
                    <FaEnvelope className="text-info" />

                    <span className="fw-semibold text-break">
                      {patient.userAccount.email}
                    </span>
                  </div>
                </div>

                {/* Account Type */}
                <div className="col-6">
                  <small className="text-info d-block mb-1">Account Type</small>

                  <div className="d-flex align-items-center gap-2">
                    <FaUser className="text-info" />

                    <span className="fw-semibold">
                      {formatRole(patient.userAccount.role)}
                    </span>
                  </div>
                </div>

                {/* Account Status */}
                <div className="col-6">
                  <small className="text-info d-block mb-1">Status</small>

                  <Tag
                    value={patient.userAccount.enabled ? "Active" : "Disabled"}
                    severity={
                      patient.userAccount.enabled ? "success" : "danger"
                    }
                    style={{ fontSize: "0.7rem" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default PatientProfile;