import { useEffect, useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import API from "../../services/api";

interface PatientForm {
  fullname: string;
  dateOfBirth: Date | null;
  phone: string;
  address: string;
}

interface PatientResponse {
  id: number;
  fullname: string;
  dateOfBirth: string;
  phone: string | null;
  address: string | null;
  userAccount?: {
    email: string;
  };
}

const EditMyProfile = () => {
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const [patientId, setPatientId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientForm>({
    defaultValues: {
      fullname: "",
      dateOfBirth: null,
      phone: "",
      address: "",
    },
  });

  // Récupérer le profil et remplir les champs
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data: patient } =
          await API.get<PatientResponse>("/patient/profile");

        setPatientId(patient.id);

        reset({
          fullname: patient.fullname ?? "",
          dateOfBirth: patient.dateOfBirth
            ? new Date(`${patient.dateOfBirth.slice(0, 10)}T00:00:00`)
            : null,
          phone: patient.phone ?? "",
          address: patient.address ?? "",
        });
      } catch (error: any) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail:
            error.response?.data?.message ??
            "Impossible de charger votre profil.",
          life: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  // Modifier le profil
  const onSubmit = (data: PatientForm) => {
    if (patientId === null) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Identifiant du patient introuvable.",
        life: 3000,
      });
      return;
    }

    confirmDialog({
      message: "Voulez-vous confirmer la modification de votre profil ?",
      header: "Confirmation",
      icon: "pi pi-exclamation-triangle",
      acceptLabel: "Confirmer",
      rejectLabel: "Annuler",
      acceptClassName: "p-button-primary",

      accept: async () => {
        setSaving(true);

        try {
          const formatDate = (date: Date | null) => {
            if (!date) return null;

            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");

            return `${year}-${month}-${day}T00:00:00+00:00`;
          };

          const payload = {
            fullname: data.fullname.trim(),
            dateOfBirth: formatDate(data.dateOfBirth),
            phone: data.phone.trim() || null,
            address: data.address.trim() || null,
          };

          await API.put(`/patient/${patientId}`, payload);

          toast.current?.show({
            severity: "success",
            summary: "Succès",
            detail: "Votre profil a été modifié avec succès.",
            life: 2500,
          });

          setTimeout(() => {
            navigate("/patient/profile");
          }, 1200);
        } catch (error: any) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail:
              error.response?.data?.message ??
              "La modification du profil a échoué.",
            life: 3500,
          });
        } finally {
          setSaving(false);
        }
      },
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <i className="pi pi-spin pi-spinner fs-2 text-primary" />
      </div>
    );
  }

  return (
    <div className="container">
      <Toast ref={toast} />
      <ConfirmDialog />

      <div>
        <div className="row justify-content-center">
          <div className="col-12 col-xl-8">
            <div className="border shadow-sm rounded-4 overflow-hidden">
              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div className="card-body p-3 justify-content-center">
                  <div className="mb-2 text-center">
                    <h3 className="fw-bold text-info mb-1 mb-1">
                      <i className="pi pi-id-card me-2 fw-bold fs-3" />
                      Informations personnelles
                    </h3>
                    <p className="fw-semibold small mb-0">
                      Renseignez vos informations ci-dessous.
                    </p>
                  </div>

                  <hr />

                  <div className="row g-3">
                    {/* Nom complet */}
                    <div className="col-12">
                      <label
                        htmlFor="fullname"
                        className="form-label text-info fw-semibold"
                      >
                        Nom complet <span className="text-danger">*</span>
                      </label>

                      <Controller
                        name="fullname"
                        control={control}
                        rules={{
                          required: "Le nom complet est obligatoire.",
                          minLength: {
                            value: 2,
                            message: "Minimum 2 caractères.",
                          },
                          maxLength: {
                            value: 100,
                            message: "Maximum 100 caractères.",
                          },
                          validate: (value) =>
                            value.trim().length >= 2 ||
                            "Le nom complet doit contenir au moins 2 caractères.",
                        }}
                        render={({ field }) => (
                          <InputText
                            id="fullname"
                            name={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            autoComplete="name"
                            placeholder="votre nom et prénom"
                            className={`w-100 form-control ${
                              errors.fullname ? "p-invalid" : ""
                            }`}
                          />
                        )}
                      />

                      {errors.fullname && (
                        <small className="text-danger d-block mt-1">
                          {errors.fullname.message}
                        </small>
                      )}
                    </div>

                    {/* Date de naissance */}
                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="dateOfBirth"
                        className="form-label text-info fw-semibold"
                      >
                        Date de naissance <span className="text-danger">*</span>
                      </label>

                      <Controller
                        name="dateOfBirth"
                        control={control}
                        rules={{
                          required: "La date de naissance est obligatoire.",
                          validate: (value) => {
                            if (!value) {
                              return "La date de naissance est obligatoire.";
                            }

                            if (
                              !(value instanceof Date) ||
                              isNaN(value.getTime())
                            ) {
                              return "Veuillez saisir une date valide.";
                            }

                            const today = new Date();
                            today.setHours(0, 0, 0, 0);

                            return (
                              value <= today ||
                              "La date ne peut pas être dans le futur."
                            );
                          },
                        }}
                        render={({ field }) => (
                          <Calendar
                            id="dateOfBirth"
                            name={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.value ?? null)}
                            onBlur={field.onBlur}
                            dateFormat="dd/mm/yy"
                            placeholder="JJ/MM/AAAA"
                            maxDate={new Date()}
                            className={`w-100 from-control ${
                              errors.dateOfBirth ? "p-invalid" : ""
                            }`}
                            inputClassName="w-100"
                          />
                        )}
                      />

                      {errors.dateOfBirth && (
                        <small className="text-danger d-block mt-1">
                          {errors.dateOfBirth.message}
                        </small>
                      )}
                    </div>

                    {/* Téléphone */}
                    <div className="col-12 col-md-6">
                      <label
                        htmlFor="phone"
                        className="form-label text-info fw-semibold small"
                      >
                        Téléphone
                      </label>

                      <Controller
                        name="phone"
                        control={control}
                        rules={{
                          maxLength: {
                            value: 30,
                            message: "Maximum 30 caractères.",
                          },
                        }}
                        render={({ field }) => (
                          <InputText
                            id="phone"
                            name={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            type="tel"
                            autoComplete="tel"
                            placeholder="Votre numéro téléphone"
                            className={`w-100 form-control ${
                              errors.phone ? "p-invalid" : ""
                            }`}
                          />
                        )}
                      />

                      {errors.phone && (
                        <small className="text-danger d-block mt-1">
                          {errors.phone.message}
                        </small>
                      )}
                    </div>

                    {/* Adresse */}
                    <div className="col-12">
                      <label
                        htmlFor="address"
                        className="form-label text-info fw-semibold small"
                      >
                        Adresse
                      </label>

                      <Controller
                        name="address"
                        control={control}
                        rules={{
                          maxLength: {
                            value: 255,
                            message: "Maximum 255 caractères.",
                          },
                        }}
                        render={({ field }) => (
                          <InputTextarea
                            id="address"
                            name={field.name}
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            autoComplete="street-address"
                            placeholder="Rue, quartier, ville..."
                            rows={3}
                            autoResize
                            className={`w-100 form-control ${
                              errors.address ? "p-invalid" : ""
                            }`}
                          />
                        )}
                      />

                      {errors.address && (
                        <small className="text-danger d-block mt-1">
                          {errors.address.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <div className="d-flex flex-column flex-sm-row justify-content-center gap-2">
                    <Button
                      type="button"
                      label="Annuler"
                      icon="pi pi-times"
                      severity="secondary"
                      outlined
                      className="rounded-2 btn-secondary"
                      disabled={saving}
                      onClick={() => navigate("/patient/profile")}
                      style={{ height: 42 }}
                    />

                    <Button
                      type="submit"
                      label={saving ? "Enregistrement..." : "Enregistrer"}
                      icon={saving ? "pi pi-spin pi-spinner" : "pi pi-check"}
                      loading={saving}
                      disabled={saving}
                      className="rounded-2 btn-primary"
                      style={{ height: 42 }}
                    />
                  </div>
                </div>
              </form>

              <hr />

              <div className="d-flex align-items-center text-success justify-content-center gap-2 m-2">
                <i className="pi pi-shield" />
                <small>Vos informations personnelles sont protégées.</small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditMyProfile;
