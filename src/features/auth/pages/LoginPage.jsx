import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthLayout from "../../../components/AuthLayout";
import FormField from "../../../components/FormField";
import { authApi } from "../../../api/auth.service.js";

const LOGIN_FIELDS = [
  {
    id: "correo",
    label: "Correo electrónico",
    type: "email",
    placeholder: "ej: usuario@email.com",
    required: true,
  },
  {
    id: "contrasena",
    label: "Contraseña",
    type: "password",
    placeholder: "Tu contraseña",
    required: true,
  },
];

export default function LoginPage() {
  const [values, setValues] = useState({ correo: "", contrasena: "" });
  const [globalError, setGlobalError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const updateValue = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    setGlobalError("");
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    setGlobalError("");

    if (!values.correo || !values.contrasena) {
      setGlobalError("Por favor, completa todos los campos.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await authApi.login({
        email: values.correo,
        password: values.contrasena,
      });

      // Guardamos los tokens y la sesión del usuario
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      localStorage.setItem("user", JSON.stringify(response.user));

      navigate("/home");
    } catch (error) {
      setGlobalError(error.message || "Correo o contraseña incorrectos.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout tagline="Portal de acceso">
      <div className="mb-6 text-center">
        <h1 className="font-display text-2xl font-bold text-green-950">Iniciar sesión</h1>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Ingresa tus credenciales para acceder a tu panel.
        </p>
      </div>

      {globalError && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-center text-sm font-semibold text-red-700">
          {globalError}
        </div>
      )}

      <form className="space-y-4" onSubmit={handleLogin}>
        {LOGIN_FIELDS.map((field) => (
          <FormField
            key={field.id}
            field={field}
            value={values[field.id]}
            onChange={updateValue}
          />
        ))}

        <button
          className="flex w-full items-center justify-center rounded-lg bg-green-800 px-4 py-3.5 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-70"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
          ) : (
            "Ingresar"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-600">
        No tienes cuenta?{" "}
        <button
          className="font-extrabold text-green-700 hover:text-green-950"
          type="button"
          onClick={() => navigate("/registro")}
        >
          Registrate aquí
        </button>
      </p>
    </AuthLayout>
  );
}
