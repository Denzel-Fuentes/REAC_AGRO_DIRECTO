import { useState } from "react";

export default function FormField({ field, value, onChange, error }) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = field.type === "password";
  const inputType = isPassword && showPassword ? "text" : field.type;

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-extrabold uppercase tracking-wide text-slate-700">
        {field.label}
        {field.required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <div className="relative">
        {field.type === "select" ? (
          <select
            className={fieldClassName(error)}
            value={value || ""}
            onChange={(event) => onChange(field.id, event.target.value)}
          >
            <option value="">Selecciona una opción</option>
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        ) : (
          <input
            className={`${fieldClassName(error)} ${isPassword ? "pr-24" : ""}`}
            type={inputType}
            placeholder={field.placeholder}
            value={value || ""}
            onChange={(event) => onChange(field.id, event.target.value)}
          />
        )}

        {isPassword && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-green-700 hover:text-green-950"
            type="button"
            onClick={() => setShowPassword((current) => !current)}
          >
            {showPassword ? "Ocultar" : "Ver"}
          </button>
        )}
      </div>

      {error && <p className="text-xs font-semibold text-red-700">{error}</p>}
    </div>
  );
}

function fieldClassName(error) {
  return [
    "w-full rounded-lg border bg-green-50/70 px-3.5 py-3 text-sm text-slate-950 outline-none transition",
    "placeholder:text-slate-400 focus:border-green-600 focus:bg-white focus:ring-4 focus:ring-green-600/10",
    error ? "border-red-400 bg-red-50" : "border-transparent",
  ].join(" ");
}
