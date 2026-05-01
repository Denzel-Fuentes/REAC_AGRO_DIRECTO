import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import AuthLayout from "../../../components/AuthLayout";
import FormField from "../../../components/FormField";
import { auth, db } from "../../../lib/firebase";
import { COMMON_FIELDS, REGISTRATION_STEPS, ROLE_FIELDS, ROLES } from "../constants";
import { validateFields } from "../utils";

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [roleId, setRoleId] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const role = ROLES.find((item) => item.id === roleId);
  const progress = step === 4 ? 4 : step;

  const updateValue = (id, value) => {
    setValues((current) => ({ ...current, [id]: value }));
    setErrors((current) => {
      const next = { ...current };
      delete next[id];
      return next;
    });
  };

  const goBack = () => setStep((current) => Math.max(0, current - 1));

  const resetForm = () => {
    setStep(0);
    setRoleId(null);
    setValues({});
    setErrors({});
    setTermsAccepted(false);
    setTermsError(false);
  };

  const goNext = async () => {
    if (step === 0) {
      if (roleId) setStep(1);
      return;
    }

    if (step === 1) {
      const fieldErrors = validateFields(COMMON_FIELDS, values);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const fieldErrors = validateFields(ROLE_FIELDS[roleId], values);
      if (Object.keys(fieldErrors).length) {
        setErrors(fieldErrors);
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      if (!termsAccepted) {
        setTermsError(true);
        return;
      }

      await createAccount();
    }
  };

  const createAccount = async () => {
    setIsSubmitting(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        values.correo,
        values.contrasena,
      );
      const profileData = { ...values };
      delete profileData.contrasena;

      await setDoc(doc(db, "usuarios", userCredential.user.uid), {
        rol: roleId,
        ...profileData,
        estadoValidacion: role.status,
        fechaRegistro: serverTimestamp(),
      });

      setStep(4);
    } catch (error) {
      console.error("Error al registrar:", error);

      if (error.code === "auth/email-already-in-use") {
        alert("Este correo ya está registrado. Intenta iniciar sesión.");
      } else if (error.code === "auth/weak-password") {
        alert("La contraseña es muy débil.");
      } else {
        alert("Hubo un error al registrar. Intenta de nuevo.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {step < 4 && <Stepper progress={progress} />}

      {step === 0 && (
        <section>
          <SectionHeader title="Cuál es tu rol?" description="Elige cómo participas en AgroDirecto." />
          <div className="space-y-3">
            {ROLES.map((item) => (
              <RoleOption
                key={item.id}
                role={item}
                isSelected={roleId === item.id}
                onSelect={() => setRoleId(item.id)}
              />
            ))}
          </div>
          <PrimaryAction className="mt-6" onClick={goNext} disabled={!roleId}>
            Continuar
          </PrimaryAction>
        </section>
      )}

      {step === 1 && (
        <section>
          <SectionHeader title="Datos generales" description="Información básica requerida." />
          <FieldList fields={COMMON_FIELDS} values={values} errors={errors} onChange={updateValue} />
          <ActionRow onBack={goBack} onNext={goNext} />
        </section>
      )}

      {step === 2 && role && (
        <section>
          <SectionHeader title={`Perfil de ${role.label}`} description="Datos específicos para tu verificación." />
          <FieldList fields={ROLE_FIELDS[roleId]} values={values} errors={errors} onChange={updateValue} />
          <ActionRow onBack={goBack} onNext={goNext} />
        </section>
      )}

      {step === 3 && role && (
        <section>
          <SectionHeader title="Confirmar registro" description="Revisa y acepta las políticas." />
          <button
            className={`flex w-full items-start gap-3 rounded-lg border p-4 text-left transition ${
              termsError ? "border-red-300 bg-red-50" : "border-green-200 bg-green-50/70 hover:border-green-400"
            }`}
            type="button"
            onClick={() => {
              setTermsAccepted((current) => !current);
              setTermsError(false);
            }}
          >
            <span
              className={`grid h-6 w-6 shrink-0 place-items-center rounded-md border-2 text-sm font-black ${
                termsAccepted ? "border-green-800 bg-green-800 text-white" : "border-green-300 bg-white"
              }`}
            >
              {termsAccepted ? "✓" : ""}
            </span>
            <span className="text-sm leading-6 text-slate-700">
              Acepto los términos y condiciones de <strong className="text-green-950">AgroDirecto</strong>.
            </span>
          </button>
          <ActionRow onBack={goBack} onNext={goNext} isSubmitting={isSubmitting} nextLabel="Crear cuenta" />
        </section>
      )}

      {step === 4 && role && (
        <section className="py-4 text-center">
          <div className={`mx-auto grid h-16 w-16 place-items-center rounded-full ${role.iconClass}`}>
            <RoleGlyph roleId={role.id} />
          </div>
          <h1 className="mt-5 font-display text-2xl font-bold text-green-950">Bienvenido</h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-600">
            Tu cuenta fue creada exitosamente y tu estado inicial es {role.status.toLowerCase()}.
          </p>
          <button
            className="mt-6 rounded-lg border border-green-300 px-5 py-3 text-sm font-extrabold text-green-800 transition hover:border-green-700 hover:bg-green-50"
            type="button"
            onClick={resetForm}
          >
            Registrar otra cuenta
          </button>
        </section>
      )}

      <footer className="mt-6 text-center text-sm text-slate-500">
        {step < 4 && (
          <p>
            Ya tienes cuenta?{" "}
            <button
              className="font-extrabold text-green-700 hover:text-green-950"
              type="button"
              onClick={() => navigate("/login")}
            >
              Inicia sesión
            </button>
          </p>
        )}
        <p className="mt-2 text-xs">© 2024 AgroDirecto · Santa Cruz, Bolivia</p>
      </footer>
    </AuthLayout>
  );
}

function SectionHeader({ title, description }) {
  return (
    <div className="mb-6 text-center">
      <h1 className="font-display text-2xl font-bold text-green-950">{title}</h1>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </div>
  );
}

function FieldList({ fields, values, errors, onChange }) {
  return (
    <div className="space-y-4">
      {fields.map((field) => (
        <FormField
          key={field.id}
          field={field}
          value={values[field.id]}
          onChange={onChange}
          error={errors[field.id]}
        />
      ))}
    </div>
  );
}

function Stepper({ progress }) {
  return (
    <div className="mb-7 flex items-center justify-center">
      {REGISTRATION_STEPS.map((stepLabel, index) => {
        const isDone = index < progress;
        const isActive = index === progress;

        return (
          <div className="flex items-center" key={stepLabel}>
            <div className="flex flex-col items-center gap-1.5">
              <span
                className={`grid h-8 w-8 place-items-center rounded-full border-2 text-xs font-extrabold transition ${
                  isDone || isActive
                    ? "border-green-800 bg-green-800 text-white"
                    : "border-green-200 bg-white text-green-200"
                }`}
              >
                {isDone ? "✓" : index + 1}
              </span>
              <span
                className={`text-[10px] font-bold uppercase tracking-wider ${
                  isDone || isActive ? "text-green-800" : "text-green-200"
                }`}
              >
                {stepLabel}
              </span>
            </div>
            {index < REGISTRATION_STEPS.length - 1 && (
              <span className={`mb-5 h-0.5 w-8 sm:w-11 ${isDone ? "bg-green-700" : "bg-green-100"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function RoleOption({ role, isSelected, onSelect }) {
  return (
    <button
      className={`flex w-full items-center gap-4 rounded-lg border-2 p-4 text-left transition hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/5 ${
        isSelected ? role.accentClass : "border-green-100 bg-white text-slate-900"
      }`}
      type="button"
      onClick={onSelect}
    >
      <span className={`grid h-12 w-12 shrink-0 place-items-center rounded-lg ${role.iconClass}`}>
        <RoleGlyph roleId={role.id} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-extrabold">{role.label}</span>
        <span className="mt-1 block text-sm leading-5 text-slate-600">{role.description}</span>
      </span>
      <span
        className={`grid h-5 w-5 shrink-0 place-items-center rounded-full border-2 ${
          isSelected ? "border-current" : "border-green-200"
        }`}
      >
        {isSelected && <span className="h-2 w-2 rounded-full bg-current" />}
      </span>
    </button>
  );
}

function ActionRow({ onBack, onNext, isSubmitting = false, nextLabel = "Continuar" }) {
  return (
    <div className="mt-6 flex gap-3">
      <button
        className="rounded-lg border border-green-200 bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:border-green-500 hover:bg-green-50"
        type="button"
        onClick={onBack}
      >
        Atrás
      </button>
      <PrimaryAction onClick={onNext} disabled={isSubmitting}>
        {isSubmitting ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" /> : nextLabel}
      </PrimaryAction>
    </div>
  );
}

function PrimaryAction({ children, onClick, disabled, className = "" }) {
  return (
    <button
      className={`flex min-h-12 flex-1 items-center justify-center rounded-lg bg-green-800 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-900 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
      type="button"
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

function RoleGlyph({ roleId }) {
  if (roleId === "comprador") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2ZM5.8 6l-.9-2H2V2H0v2h2l3.6 7.6L4.3 14c-.2.3-.3.7-.3 1 0 1.1.9 2 2 2h14v-2H6.4c-.1 0-.2-.1-.2-.3l.9-1.7H19c.8 0 1.4-.4 1.8-1l3.5-6.5c.4-.7-.1-1.5-.9-1.5H7.2L6.5 2.5C6.2 1.6 5.4 1 4.4 1H0v2h4.4c.1 0 .3.1.3.2L5.8 6Z" />
      </svg>
    );
  }

  if (roleId === "transportista") {
    return (
      <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M20 8h-3V4H3C1.9 4 1 4.9 1 6v11h2a3 3 0 1 0 6 0h6a3 3 0 1 0 6 0h2v-5l-3-4ZM6 18.5A1.5 1.5 0 1 1 6 15a1.5 1.5 0 0 1 0 3.5Zm13.5-9 2 2.5H17V9.5h2.5Zm-1.5 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z" />
      </svg>
    );
  }

  return (
    <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6 2 2 7 2 12c0 1.9.5 3.6 1.4 5.1L2 19l2.1-1.3A9.9 9.9 0 0 0 12 22a10 10 0 1 0 0-20Zm0 18a8 8 0 1 1 0-16 8 8 0 0 1 0 16Zm0-15a5 5 0 0 0-3 9.1l.5.9h5l.5-.9A5 5 0 0 0 12 5Zm1 12v2h-2v-2h2Z" />
    </svg>
  );
}
