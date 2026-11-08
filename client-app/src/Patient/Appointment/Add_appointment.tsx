import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "primereact/button";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import type { Toast as ToastType } from "primereact/toast";

import api from "../../services/api";
import { useNavigate } from "react-router-dom";

interface Doctor {
  id: number;
  fullName: string;
  specialty?: string | { name: string };
}

const appointmentSchema = z.object({
  doctorId: z
    .number({
      error: "Veuillez sélectionner un médecin.",
    })
    .positive("Veuillez sélectionner un médecin."),

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

type AppointmentFormValues = z.infer<typeof appointmentSchema>;

function formatAppointmentDate(date: Date): string {
  const pad = (value: number) => String(value).padStart(2, "0");

  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ` +
    `${pad(date.getHours())}:${pad(date.getMinutes())}:00`
  );
}

function Add_appointment() {
  const toast = useRef<ToastType>(null);

  const [doctors, setDoctors] = useState<Doctor[]>();
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
  control,
  handleSubmit,
  formState: { errors },
} = useForm<AppointmentFormValues>({
  resolver: zodResolver(appointmentSchema),
  defaultValues: {
    doctorId: undefined,
    appointmentDate: null as unknown as Date,
    reason: "",
  },
});

  useEffect(() => {
    let active = true;

    const loadDoctors = async () => {
      try {
        const response = await api.get("/doctors/all");

        const result = response.data;
        const doctorList: Doctor[] = Array.isArray(result)
          ? result
          : Array.isArray(result?.data)
            ? result.data
            : [];

        if (active) {
          setDoctors(doctorList);
        }
      } catch {
        if (active) {
          toast.current?.show({
            severity: "error",
            summary: "Erreur",
            detail: "Impossible de charger la liste des médecins.",
            life: 3000,
          });
        }
      } finally {
        if (active) {
          setLoadingDoctors(false);
        }
      }
    };

    void loadDoctors();

    return () => {
      active = false;
    };
  }, []);

  const onSubmit = async (values: AppointmentFormValues) => {
    setSubmitting(true);

    try {
      await api.post("/appointments", {
        doctorId: values.doctorId,
        appointmentDate: formatAppointmentDate(values.appointmentDate),
        reason: values.reason.trim(),
      });

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Rendez-vous ajouté avec succès.",
        life: 3000,
      });
      setTimeout(() => navigate(-1), 3000);
      
    } catch (error) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail: "Échec de l'ajout du rendez-vous.",
        life: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  
return (
  <div className="container">
    <Toast ref={toast} position="top-right" />

    <div className="row d-flex justify-content-center align-items-end">
      <div className="col-12 col-lg-8 col-xl-7 border rounded-2">
        <div className="d-flex align-items-center justify-content-center gap-2 p-3 border-bottom">
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

          <div>
            <h1 className="h5 fw-bold mb-0 text-info">Nouveau rendez-vous</h1>
            <small className="small">
              Planifiez votre consultation médicale
            </small>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate className="px-2">
          <div className="row g-2 mt-2">
            <div className="col-12 col-md-6 ">
              <label htmlFor="doctorId" className="form-label fw-semibold mb-1">
                Médecin <span className="text-danger">*</span>
              </label>

              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <Dropdown
                    inputId="doctorId"
                    value={field.value ?? null}
                    options={doctors ?? []}
                    optionLabel="fullName"
                    optionValue="id"
                    onChange={(e) => field.onChange(e.value)}
                    placeholder="Sélectionner un médecin"
                    showClear
                    filter
                    disabled={loadingDoctors || submitting}
                    className={`w-100 ${errors.doctorId ? "p-invalid" : ""}`}
                  />
                )}
              />

              {errors.doctorId && (
                <small className="text-danger d-block mt-1">
                  {errors.doctorId.message}
                </small>
              )}
            </div>

            <div className="col-12 col-md-6">
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
                    disabled={submitting}
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

            <div className="col-12">
              <label htmlFor="reason" className="form-label fw-semibold mb-1">
                Motif de consultation <span className="text-danger">*</span>
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
                    disabled={submitting}
                    className={`w-100 ${errors.reason ? "p-invalid" : ""}`}
                  />
                )}
              />

              {errors.reason && (
                <small className="text-danger d-block mt-1">
                  {errors.reason.message}
                </small>
              )}
            </div>
          </div>

          <div className="d-flex flex-column flex-sm-row justify-content-end gap-2 mt-3 ">
            <Button
              type="button"
              label="Cancel"
              icon="pi pi-back"
              severity="secondary"
              disabled={submitting}
              className="w-100 rounded-2"
              onClick={() => navigate(-1)}
            />

            <Button
              type="submit"
              label={
                submitting ? "Création en cours..." : "Créer le rendez-vous"
              }
              icon={submitting ? "pi pi-spin pi-spinner" : "pi pi-check"}
              loading={submitting}
              disabled={submitting || loadingDoctors}
              className="w-100 w-sm-auto rounded-2"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
);

}

export default Add_appointment;
