import {  useRef } from "react";
import { useNavigate } from "react-router-dom";

import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";

import { Controller, useForm } from "react-hook-form";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import api from "../../services/api";

const registerSchema = z
  .object({
    email: z
      .string()
      .min(1, "L'adresse e-mail est obligatoire")
      .email("Adresse e-mail invalide"),

    password: z
      .string()
      .min(8, "Le mot de passe doit contenir au moins 8 caractères")
      .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
      .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),

    confirmPassword: z
      .string()
      .min(1, "La confirmation du mot de passe est obligatoire"),

    fullname: z
      .string()
      .min(2, "Le nom complet doit contenir au moins 2 caractères")
      .max(100, "Le nom complet ne peut pas dépasser 100 caractères"),

    dateOfBirth: z.date({
      message: "La date de naissance est obligatoire",
    }),

    phone: z
      .string()
      .max(30, "Le téléphone ne peut pas dépasser 30 caractères")
      .optional(),

    address: z
      .string()
      .max(255, "L'adresse ne peut pas dépasser 255 caractères")
      .optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const navigate = useNavigate();

  const toast = useRef<Toast>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),

    mode: "onChange",

    reValidateMode: "onChange",

    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      fullname: "",
      dateOfBirth: undefined,
      phone: "",
      address: "",
    },
  });

 
  const onSubmit = async (data: RegisterForm) => {
    try {
      const { confirmPassword, dateOfBirth, ...rest } = data;

      const registerData = {
        ...rest,

        dateOfBirth: dateOfBirth.toISOString().split("T")[0],
      };

      await api.post("/patient/create", registerData);

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Votre compte patient a été créé avec succès.",
        life: 3000,
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail:
          error.response?.data?.message || "Impossible de créer le compte.",
        life: 4000,
      });
    }
  };

  return (
    <div className="bg-light min-vh-100 d-flex align-items-center py-3">
      <Toast ref={toast} />
      <div className="container-fluid px-3">
        <div
          className="card border-0 shadow-sm mx-auto"
          style={{
            maxWidth: "1050px",
          }}
        >
          <div className="card-header bg-white border-0 px-4 pt-3 pb-2">
            <div className="d-flex align-items-center justify-content-center gap-3">
              <div
                className="rounded-3 d-flex align-items-center justify-content-center"
                style={{
                  width: "42px",
                  height: "42px",
                  backgroundColor: "#eaf2ff",
                  color: "#2563eb",
                }}
              >
                <i className="pi pi-user-plus fw-bold text-info fs-5" />
              </div>

              <div>
                <h1
                  className="mb-0 fw-bold text-info"
                  style={{
                    fontSize: "1.35rem",
                  }}
                >
                  Créer un compte patient
                </h1>

                <p
                  className="mb-0 text-secondary fw-semibold"
                  style={{
                    fontSize: "0.78rem",
                  }}
                >
                  Renseignez vos informations personnelles et vos identifiants.
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="card-body px-4 py-3">
              <div className="row g-3">
                <div className="col-12 col-lg-6">
                  <div className="border rounded-3 h-100 p-3">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                      <div
                        className="rounded-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "#eef6ff",
                          color: "#0a53f0",
                        }}
                      >
                        <i className="pi pi-user fw-semibold" />
                      </div>

                      <div>
                        <h2
                          className="mb-0 fw-bold text-primary"
                          style={{
                            fontSize: "0.95rem",
                          }}
                        >
                          Informations personnelles
                        </h2>

                        <small className="text-secondary fw-semibold">
                          Identité du patient
                        </small>
                      </div>
                    </div>

                    <hr />

                    <div className="mb-2">
                      <label
                        htmlFor="fullname"
                        className="form-label text-primary fw-semibold mb-1"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        Nom complet <span className="text-danger">*</span>
                      </label>

                      <InputText
                        id="fullname"
                        {...register("fullname")}
                        placeholder="Ex : Jamal Jouhari"
                        className={`w-100 ${
                          errors.fullname ? "p-invalid" : ""
                        }`}
                        style={{
                          height: "38px",
                          fontSize: "0.82rem",
                        }}
                      />

                      {errors.fullname && (
                        <small className="text-danger d-block mt-1">
                          {errors.fullname.message}
                        </small>
                      )}
                    </div>

                    <div className="row g-2">
                      <div className="col-12 col-md-6">
                        <label
                          htmlFor="dateOfBirth"
                          className="form-label text-primary fw-semibold mb-1"
                          style={{
                            fontSize: "0.78rem",
                          }}
                        >
                          Date de naissance{" "}
                          <span className="text-danger">*</span>
                        </label>

                        <Controller
                          name="dateOfBirth"
                          control={control}
                          render={({ field }) => (
                            <Calendar
                              id="dateOfBirth"
                              value={field.value}
                              onChange={(e) => field.onChange(e.value)}
                              onBlur={field.onBlur}
                              dateFormat="dd/mm/yy"
                              placeholder="JJ/MM/AAAA"
                              className={`w-100 ${
                                errors.dateOfBirth ? "p-invalid" : ""
                              }`}
                              inputStyle={{
                                height: "38px",
                                fontSize: "0.82rem",
                              }}
                              maxDate={new Date()}
                            />
                          )}
                        />

                        {errors.dateOfBirth && (
                          <small className="text-danger d-block mt-1">
                            {errors.dateOfBirth.message}
                          </small>
                        )}
                      </div>

                      <div className="col-12 col-md-6">
                        <label
                          htmlFor="phone"
                          className="form-label text-primary fw-semibold mb-1"
                          style={{
                            fontSize: "0.78rem",
                          }}
                        >
                          Téléphone
                        </label>

                        <InputText
                          id="phone"
                          {...register("phone")}
                          placeholder="0612345678"
                          className={`w-100 ${errors.phone ? "p-invalid" : ""}`}
                          style={{
                            height: "38px",
                            fontSize: "0.82rem",
                          }}
                        />

                        {errors.phone && (
                          <small className="text-danger d-block mt-1">
                            {errors.phone.message}
                          </small>
                        )}
                      </div>
                    </div>

                    <div className="mt-2">
                      <label
                        htmlFor="address"
                        className="form-label text-primary fw-semibold mb-1"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        Adresse
                      </label>

                      <InputTextarea
                        id="address"
                        {...register("address")}
                        placeholder="Votre adresse"
                        rows={2}
                        autoResize
                        className={`w-100 ${errors.address ? "p-invalid" : ""}`}
                        style={{
                          fontSize: "0.82rem",
                        }}
                      />

                      {errors.address && (
                        <small className="text-danger d-block mt-1">
                          {errors.address.message}
                        </small>
                      )}
                    </div>
                  </div>
                </div>

                <div className="col-12 col-lg-6">
                  <div className="border rounded-3 h-100 p-3">
                    <div className="d-flex align-items-center justify-content-center gap-2 mb-3">
                      <div
                        className="rounded-2 d-flex align-items-center justify-content-center"
                        style={{
                          width: "32px",
                          height: "32px",
                          backgroundColor: "#edfdf5",
                          color: "#059669",
                        }}
                      >
                        <i className="pi pi-lock fw-semibold" />
                      </div>

                      <div>
                        <h2
                          className="mb-0 fw-semibold text-primary"
                          style={{
                            fontSize: "0.95rem",
                          }}
                        >
                          Informations du compte
                        </h2>

                        <small className="text-secondary">
                          Identifiants de connexion
                        </small>
                      </div>
                    </div>

                    <hr />

                    <div className="mb-2">
                      <label
                        htmlFor="email"
                        className="form-label text-primary fw-semibold mb-1"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        Adresse email <span className="text-danger">*</span>
                      </label>

                      <InputText
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="patient@email.com"
                        className={`w-100 ${errors.email ? "p-invalid" : ""}`}
                        style={{
                          height: "38px",
                          fontSize: "0.82rem",
                        }}
                      />

                      {errors.email && (
                        <small className="text-danger d-block mt-1">
                          {errors.email.message}
                        </small>
                      )}
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="password"
                        className="form-label text-primary fw-semibold mb-1"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        Mot de passe <span className="text-danger">*</span>
                      </label>

                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <Password
                            id="password"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            placeholder="Votre mot de passe"
                            toggleMask
                            feedback={false}
                            className={`w-100 password-field ${
                              errors.password ? "p-invalid" : ""
                            }`}
                            inputClassName="password-input"
                            inputStyle={{
                              height: "38px",
                              fontSize: "0.82rem",
                              width: "100%",
                            }}
                          />
                        )}
                      />

                      {errors.password && (
                        <small className="text-danger d-block mt-1">
                          {errors.password.message}
                        </small>
                      )}
                    </div>

                    <div className="mb-2">
                      <label
                        htmlFor="confirmPassword"
                        className="form-label text-primary fw-semibold mb-1"
                        style={{
                          fontSize: "0.78rem",
                        }}
                      >
                        Confirmer le mot de passe{" "}
                        <span className="text-danger">*</span>
                      </label>

                      <Controller
                        name="confirmPassword"
                        control={control}
                        render={({ field }) => (
                          <Password
                            id="confirmPassword"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={field.onBlur}
                            placeholder="Confirmez votre mot de passe"
                            toggleMask
                            feedback={false}
                            className={`w-100 password-field ${
                              errors.confirmPassword ? "p-invalid" : ""
                            }`}
                            inputClassName="password-input"
                            inputStyle={{
                              height: "38px",
                              fontSize: "0.82rem",
                              width: "100%",
                            }}
                          />
                        )}
                      />

                      {errors.confirmPassword && (
                        <small className="text-danger d-block mt-1">
                          {errors.confirmPassword.message}
                        </small>
                      )}
                    </div>
                    <div
                      className="alert border-0 rounded-3 py-2 px-3 mt-3 mb-0"
                      style={{
                        backgroundColor: "#f0fdf4",
                        color: "#166534",
                        fontSize: "0.75rem",
                      }}
                    >
                      <i className="pi pi-shield me-2" />
                      Vos identifiants sont sécurisés.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-footer bg-white border-top px-4 py-2">
              <div className="d-flex justify-content-center gap-2 flex-wrap">
                <Button
                  type="button"
                  label="Annuler"
                  icon="pi pi-times"
                  severity="secondary"
                  outlined
                  className="px-3 rounded-2"
                  style={{
                    height: "36px",
                    fontSize: "0.8rem",
                  }}
                  onClick={() => navigate("/login")}
                />

                <Button
                  type="submit"
                  label="Créer le compte"
                  icon="pi pi-user-plus"
                  loading={isSubmitting}
                  className="px-3 rounded-2 btn-primary"
                  style={{
                    height: "36px",
                    fontSize: "0.8rem",
                  }}
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
