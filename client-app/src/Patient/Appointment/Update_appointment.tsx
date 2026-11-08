import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import type { Toast as ToastType } from "primereact/toast";

import api from "../../services/api";

interface Appointment {
  id: number;
  appointmentDate: string;
  reason: string;
  status?: string;
  doctorName?: string;
  doctor?: {
    fullName?: string;
  };
}

const updateAppointmentSchema = z.object({
  appointmentDate: z
    .date({
      error: "Veuillez sélectionner une date.",
    })
    .refine(
      (date) => !Number.isNaN(date.getTime()),
      "La date sélectionnée est invalide.",
    )
    .refine(
      (date) => date.getTime() > Date.now(),
      "La date doit être dans le futur.",
    ),

  reason: z
    .string()
    .trim()
    .min(1, "Le motif du rendez-vous est obligatoire.")
    .max(2000, "Le motif ne doit pas dépasser 2000 caractères."),
});

type UpdateAppointmentFormValues = z.infer<typeof updateAppointmentSchema>;

function formatAppointmentDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function parseAppointmentDate(value: string): Date {
  const match = value.match(
    /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})(?::(\d{2}))?$/,
  );

  if (match) {
    const [, year, month, day, hour, minute, second = "0"] = match;

    return new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hour),
      Number(minute),
      Number(second),
    );
  }

  return new Date(value);
}

function Update_appointment() {
  const toast = useRef<ToastType>(null);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<UpdateAppointmentFormValues>({
    resolver: zodResolver(updateAppointmentSchema),
    defaultValues: {
      appointmentDate: null as unknown as Date,
      reason: "",
    },
  });

  const reasonValue = watch("reason") ?? "";

  useEffect(() => {
    let active = true;

    const loadAppointment = async () => {
      if (!id || !/^\d+$/.test(id) || Number(id) <= 0) {
        toast.current?.show({
          severity: "error",
          summary: "Erreur",
          detail: "Identifiant du rendez-vous invalide.",
          life: 3000,
        });

        if (active) setLoading(false);
        return;
      }

      try {
        const response = await api.get(`/appointments/${id}`);
        const data: Appointment = response.data;

        if (!active) return;

        setAppointment(data);

        reset({
          appointmentDate: parseAppointmentDate(data.appointmentDate),
          reason: data.reason ?? "",
        });
      } catch (error) {
        console.error("Erreur de chargement :", error);

        if (active) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Impossible de charger le rendez-vous.",
            life: 3000,
          });
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    void loadAppointment();

    return () => {
      active = false;
    };
  }, [id, reset]);

  const onSubmit = async (values: UpdateAppointmentFormValues) => {
    if (!id || !appointment) return;

    if (appointment.status && appointment.status.toUpperCase() !== "PENDING") {
      toast.current?.show({
        severity: "warn",
        summary: "Modification impossible",
        detail: "Seuls les rendez-vous en attente peuvent être modifiés.",
        life: 3000,
      });
      return;
    }

    setSubmitting(true);

    try {
      await api.put(`/appointments/${id}`, {
        appointmentDate: formatAppointmentDate(values.appointmentDate),
        reason: values.reason.trim(),
      });

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Rendez-vous modifié avec succès.",
        life: 2500,
      });

      window.setTimeout(() => {
        navigate(-1);
      }, 800);
    } catch (error) {
      console.error("Erreur de modification :", error);

      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de la modification du rendez-vous.",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  const doctorName =
    appointment?.doctorName ??
    appointment?.doctor?.fullName ??
    "Médecin associé au rendez-vous";

  const canEdit =
    !appointment?.status || appointment.status.toUpperCase() === "PENDING";

  return (
    <div className="container">
      <Toast ref={toast} position="top-right" />

      <div className="row justify-content-center">
        <div className="col-12 col-lg-8 col-xl-7">
          <div className="border rounded-2 shadow-sm overflow-hidden px-1">
            {/* En-tête */}
            <div className="d-flex align-items-center justify-content-center gap-2 p-2 border-bottom">
              <div
                className="d-flex align-items-center justify-content-center rounded-2"
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: "#e8f5f8",
                  color: "#0d8497",
                  flexShrink: 0,
                }}
              >
                <i className="pi pi-calendar-plus fs-5" />
              </div>

              <div className="py-3">
                <h1 className="h5 fw-bold mb-0 text-info">
                  Modifier le rendez-vous
                </h1>
                <small className="small">
                  Modifiez la date, l’heure ou le motif
                </small>
              </div>
            </div>

            {loading ? (
              <div className="d-flex justify-content-center align-items-center gap-2 p-3">
                <i className="pi pi-spin pi-spinner text-info" />
                <span className="text-secondary">
                  Chargement du rendez-vous...
                </span>
              </div>
            ) : !appointment ? (
              <div className="p-2">
                <p className="text-secondary mb-2">
                  Le rendez-vous demandé est introuvable ou inaccessible.
                </p>

                <Button
                  type="button"
                  label="Retour"
                  icon="pi pi-arrow-left"
                  severity="secondary"
                  outlined
                  className="w-100 rounded-2"
                  onClick={() => navigate(-1)}
                />
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                noValidate
                className="p-2"
              >
                {/* Médecin en lecture seule */}
                <div className="mb-2">
                  <label className="form-label fw-semibold mb-1">Médecin</label>

                  <div className="form-control d-flex align-items-center gap-2 bg-body-tertiary">
                    <i className="pi pi-user-md text-info" />
                    <span>{doctorName}</span>
                    <span className="badge bg-secondary ms-auto">
                      Non modifiable
                    </span>
                  </div>
                </div>

                <div className="row g-2">
                  {/* Date et heure */}
                  <div className="col-12">
                    <label
                      htmlFor="appointmentDate"
                      className="form-label fw-semibold mb-1"
                    >
                      Date et heure <span className="text-danger">*</span>
                    </label>

                    <Controller
                      name="appointmentDate"
                      control={control}
                      render={({ field }) => (
                        <Calendar
                          inputId="appointmentDate"
                          value={field.value ?? null}
                          onChange={(event) => field.onChange(event.value)}
                          showTime
                          hourFormat="24"
                          showIcon
                          showButtonBar
                          minDate={new Date()}
                          stepMinute={15}
                          dateFormat="dd/mm/yy"
                          placeholder="Choisir une date"
                          disabled={submitting || !canEdit}
                          className={`w-100 ${
                            errors.appointmentDate ? "p-invalid" : ""
                          }`}
                          inputClassName="w-100"
                        />
                      )}
                    />

                    {errors.appointmentDate && (
                      <small className="text-danger d-block mt-1">
                        {errors.appointmentDate.message}
                      </small>
                    )}
                  </div>

                  {/* Motif */}
                  <div className="col-12">
                    <label
                      htmlFor="reason"
                      className="form-label fw-semibold mb-1"
                    >
                      Motif de consultation{" "}
                      <span className="text-danger">*</span>
                    </label>

                    <Controller
                      name="reason"
                      control={control}
                      render={({ field }) => (
                        <InputTextarea
                          id="reason"
                          value={field.value ?? ""}
                          onChange={field.onChange}
                          rows={5}
                          autoResize
                          maxLength={2000}
                          placeholder="Décrivez le motif de votre consultation..."
                          disabled={submitting || !canEdit}
                          className={`w-100 ${
                            errors.reason ? "p-invalid" : ""
                          }`}
                        />
                      )}
                    />

                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-1 mt-1">
                      {errors.reason ? (
                        <small className="text-danger">
                          {errors.reason.message}
                        </small>
                      ) : (
                        <small className="text-secondary">
                          Précisez le motif de votre consultation.
                        </small>
                      )}

                      <small className="text-secondary ms-auto">
                        {reasonValue.length}/2000
                      </small>
                    </div>
                  </div>
                </div>

                {!canEdit && (
                  <div className="alert alert-warning py-2 px-2 mt-2 mb-0">
                    <i className="pi pi-lock me-2" />
                    Ce rendez-vous ne peut plus être modifié.
                  </div>
                )}

                {/* Actions */}
                <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-2 pt-2 border-top">
                  <Button
                    type="button"
                    label="Annuler"
                    icon="pi pi-arrow-left"
                    severity="secondary"
                    outlined
                    disabled={submitting}
                    className="w-100 rounded-2"
                    onClick={() => navigate(-1)}
                  />

                  <Button
                    type="submit"
                    label={
                      submitting
                        ? "Modification en cours..."
                        : "Enregistrer les modifications"
                    }
                    icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
                    loading={submitting}
                    disabled={submitting || !canEdit}
                    className="w-100 rounded-2"
                  />
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Update_appointment;
