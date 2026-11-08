import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import api from "../../services/api";
import "../Auth.css";

const schema = z.object({
  email: z.string().min(1, "L'email est obligatoire").email("Email invalide"),
  password: z.string().min(1, "Le mot de passe est obligatoire"),
});

type LoginRequest = z.infer<typeof schema>;

const Login = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LoginRequest>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginRequest) => {
    try {
      const response = await api.post("/patient/login", data);

      console.log("Réponse Symfony :", response.data);

      const token = response.data.token;

      if (!token) {
        throw new Error("Le token JWT est absent.");
      }

      // Décoder le payload du JWT
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/")),
      );

      console.log("Payload JWT :", payload);

      const user = {
        email: payload.username,
        roles: payload.roles ?? [],
        role: payload.roles?.[0] ?? null,
      };

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.current?.show({
        severity: "success",
        summary: "Succès",
        detail: "Connexion réussie.",
        life: 3000,
      });

      setTimeout(() => {
        if (user.roles.includes("ROLE_PATIENT")) {
          navigate("/patient/dashboard");
        } 
      }, 1000);
    } catch (error: any) {
      console.error("Erreur de connexion :", error);
      console.error("Réponse backend :", error.response?.data);

      toast.current?.show({
        severity: "error",
        summary: "Erreur",
        detail:
          error.response?.data?.message ??
          error.message ??
          "Erreur pendant la connexion.",
        life: 4000,
      });
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light py-3">
      <Toast ref={toast} />

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-sm-10 col-md-7 col-lg-5 col-xl-5">
            <div className="card border-0 shadow rounded-4">
              <div className="card-body px-4 py-4">
                {/* Header */}
                <div className="text-center mb-3">
                  <h1 className="h4 fw-bold text-primary mb-1">Bienvenue</h1>

                  <p className="text-secondary small fw-semibold mb-0">
                    Connectez-vous à votre compte MedFlow
                  </p>
                </div>

                {/* Separator */}
                <div className="d-flex align-items-center mb-3">
                  <hr className="flex-grow-1 my-0" />

                  <span className="px-3 text-secondary small fw-semibold">
                    Connexion
                  </span>

                  <hr className="flex-grow-1 my-0" />
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Email */}
                  <div className="mb-3">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold mb-1 text-primary small"
                    >
                      E-mail
                    </label>

                    <InputText
                      id="email"
                      type="email"
                      placeholder="example@gmail.com"
                      className={`w-100 p-2 ${errors.email ? "is-invalid" : ""}`}
                      {...register("email")}
                    />

                    {errors.email && (
                      <div className="invalid-feedback d-block">
                        {errors.email.message}
                      </div>
                    )}
                  </div>

                  {/* Password */}
                  <div className="mb-2">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold mb-1 text-primary small"
                    >
                      Mot de passe
                    </label>

                    <div className="password-wrapper">
                      <Controller
                        name="password"
                        control={control}
                        render={({ field }) => (
                          <Password
                            {...field}
                            inputId="password"
                            feedback={false}
                            toggleMask
                            className="password-field w-100"
                            placeholder="Votre mot de passe"
                            inputClassName={`password-input w-100 p-2 ${
                              errors.password ? "is-invalid" : ""
                            }`}
                          />
                        )}
                      />
                    </div>

                    {errors.password && (
                      <div className="invalid-feedback d-block">
                        {errors.password.message}
                      </div>
                    )}
                  </div>

                  {/* Forgot password */}
                  <div className="text-end mb-3">
                    <Link
                      to="/forgot-password"
                      className="text-decoration-none text-primary small fw-semibold"
                    >
                      Mot de passe oublié ?
                    </Link>
                  </div>

                  {/* Login button */}
                  <Button
                    type="submit"
                    label="Se connecter"
                    icon="pi pi-sign-in"
                    loading={isSubmitting}
                    className="btn btn-primary w-100 py-2 fw-semibold border-0"
                  />

                  {/* Register */}
                  <div className="text-center mt-3">
                    <span className="text-secondary small">
                      Pas encore de compte ?{" "}
                    </span>

                    <Link
                      to="/register"
                      className="text-decoration-none text-primary fw-semibold small"
                    >
                      Créer un compte
                    </Link>
                  </div>
                </form>

                {/* Security */}
                <div className="border-top mt-3 pt-3 text-center">
                  <small className="text-secondary">
                    <i className="pi pi-shield me-2 text-success"></i>
                    Connexion sécurisée
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

