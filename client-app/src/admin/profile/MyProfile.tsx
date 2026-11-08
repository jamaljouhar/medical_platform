import { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import api from "../../services/api";

interface UserProfile {
  id: number;
  email: string;
  role: string;
  enabled: boolean;
}

function MyProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const response = await api.get("/auth/me");

      setProfile(response.data);
    } catch (error) {
      console.error("Erreur lors du chargement du profil :", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <Card>
          <div className="text-center p-4">
            <i className="pi pi-spin pi-spinner fs-2" />
            <p className="mt-3 mb-0">Chargement du profil...</p>
          </div>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-4">
        <Card>
          <div className="text-center p-4">
            <i className="pi pi-user-minus fs-2 text-secondary" />
            <p className="mt-3 mb-0">Impossible de récupérer votre profil.</p>
            <Button
              label="Actualiser"
              icon="pi pi-refresh"
              outlined
              className="mt-3"
              onClick={loadProfile}
            />
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h1 className="h3 fw-bold mb-1">Mon profil</h1>
        <p className="text-secondary mb-0">
          Consultez les informations de votre compte MedFlow.
        </p>
      </div>

      <div className="row g-4">
        <div className="col-12 col-lg-4">
          <Card>
            <div className="text-center">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "90px",
                  height: "90px",
                  background: "#e8f1ff",
                }}
              >
                <i className="pi pi-user fs-1" />
              </div>

              <h2 className="h4 mb-2">{profile.email}</h2>

              <Tag
                value={profile.enabled ? "Compte actif" : "Compte désactivé"}
                severity={profile.enabled ? "success" : "danger"}
              />
            </div>
          </Card>
        </div>

        <div className="col-12 col-lg-8">
          <Card>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h2 className="h5 mb-1">Informations du compte</h2>
                <span className="text-secondary">
                  Informations associées à votre compte.
                </span>
              </div>

              <Button icon="pi pi-pencil" label="Modifier" outlined />
            </div>

            <Divider />

            <div className="row g-4">
              <div className="col-12">
                <label className="form-label fw-semibold">Adresse e-mail</label>

                <InputText value={profile.email} readOnly className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Rôle</label>

                <InputText value={profile.role} readOnly className="w-100" />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label fw-semibold">Statut</label>

                <div className="mt-2">
                  <Tag
                    value={profile.enabled ? "Actif" : "Inactif"}
                    severity={profile.enabled ? "success" : "danger"}
                  />
                </div>
              </div>

              <div className="col-12">
                <label className="form-label fw-semibold">Identifiant</label>

                <InputText
                  value={String(profile.id)}
                  readOnly
                  className="w-100"
                />
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
