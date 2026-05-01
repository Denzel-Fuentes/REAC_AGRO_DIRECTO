import { useState } from "react";
import { useNavigate } from "react-router-dom"; // 1. Importamos el hook
import { authApi } from "./api/auth.service";

/* ─── Constantes ─────────────────────────────────────────────── */
const ROLES = [
  {
    id: "productor",
    label: "Productor",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M12 3C8.13 3 5 6.13 5 10c0 2.38 1.19 4.47 3 5.74V17h8v-1.26C17.81 14.47 19 12.38 19 10c0-3.87-3.13-7-7-7zm-1 14v2h2v-2h-2zm6.45-9.17A4.99 4.99 0 0 0 12 5c-2.76 0-5 2.24-5 5 0 1.68.83 3.15 2.1 4.06L9.5 15h5l-.6-1.06A4.991 4.991 0 0 0 16 10c0-.42-.05-.82-.14-1.2l.59.03z" />
        <path d="M12 2C6 2 2 7 2 12c0 1.85.5 3.58 1.37 5.06L2 19l2.06-1.3A9.93 9.93 0 0 0 12 22c5.52 0 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
      </svg>
    ),
    desc: "Publico mis cosechas y gestiono pedidos",
    color: "#2d7a2d",
    bg: "#e8f5e9",
    estado: "Pendiente de verificación",
    badge: "⏳",
  },
  {
    id: "comprador",
    label: "Comprador",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M7 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zM5.83 6l-.94-2H2V2H0v2h2l3.6 7.59L4.25 14C4.09 14.32 4 14.65 4 15c0 1.1.9 2 2 2h14v-2H6.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63H19c.75 0 1.41-.41 1.75-1.03l3.58-6.49A1 1 0 0 0 23.46 4H7.23L6.5 2.5C6.19 1.61 5.37 1 4.4 1H0v2h4.4c.14 0 .27.09.32.23L5.83 6z" />
      </svg>
    ),
    desc: "Busco, compro y pago productos agrícolas",
    color: "#1565c0",
    bg: "#e3f2fd",
    estado: "Registrado",
    badge: "✅",
  },
  {
    id: "transportista",
    label: "Transportista",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
        <path d="M20 8h-3V4H3c-1.1 0-2 .9-2 2v11h2c0 1.66 1.34 3 3 3s3-1.34 3-3h6c0 1.66 1.34 3 3 3s3-1.34 3-3h2v-5l-3-4zM6 18.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm13.5-9l1.96 2.5H17V9.5h2.5zm-1.5 9c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
      </svg>
    ),
    desc: "Acepto pedidos y realizo entregas del campo a la ciudad",
    color: "#e65100",
    bg: "#fff3e0",
    estado: "Pendiente de verificación",
    badge: "⏳",
  },
];

const CAMPOS_COMUNES = [
  { id: "nombre", label: "Nombre completo", type: "text", placeholder: "ej: Juan Pérez López", required: true },
  { id: "correo", label: "Correo electrónico", type: "email", placeholder: "ej: juan@email.com", required: true },
  { id: "contrasena", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres", required: true },
  { id: "celular", label: "Número de celular", type: "tel", placeholder: "ej: 76543210", required: true },
];

const CAMPOS_ROL = {
  productor: [
    { id: "tipoProductor", label: "Tipo de productor", type: "select", options: ["Horticultor", "Fruticultor", "Ganadero", "Avicultor", "Apicultor", "Otro"], required: true },
    { id: "nombreFinca", label: "Nombre de la finca", type: "text", placeholder: "ej: Finca La Esperanza", required: true },
    { id: "ubicacion", label: "Ubicación administrativa", type: "select", options: ["Vallegrande", "Samaipata", "Montero", "Warnes", "Cotoca", "La Guardia", "Otro"], required: true },
    { id: "experiencia", label: "Años de experiencia", type: "number", placeholder: "ej: 5", required: true },
    { id: "documento", label: "Documento de identidad (CI)", type: "text", placeholder: "ej: 12345678", required: true },
  ],
  comprador: [
    { id: "tipoComprador", label: "Tipo de comprador", type: "select", options: ["Restaurante", "Supermercado", "Revendedor", "Consumidor final", "Industria", "Otro"], required: true },
    { id: "zonaCompra", label: "Ciudad / Zona principal de compra", type: "select", options: ["Santa Cruz de la Sierra - Centro", "Santa Cruz - Plan 3000", "Warnes", "Montero", "Cotoca", "La Guardia", "Otra"], required: true },
  ],
  transportista: [
    { id: "tipoTransporte", label: "Tipo de transporte", type: "select", options: ["Motocicleta", "Camioneta", "Camión pequeño", "Camión grande", "Refrigerado", "Otro"], required: true },
    { id: "capacidadCarga", label: "Capacidad de carga (kg)", type: "number", placeholder: "ej: 1500", required: true },
    { id: "zonaOperacion", label: "Zona de operación", type: "select", options: ["Santa Cruz - Ciudad", "Integrado Norte (Warnes, Montero)", "Integrado Sur (Samaipata, Vallegrande)", "Todo el departamento", "Otra"], required: true },
    { id: "licencia", label: "Número de licencia de conducir", type: "text", placeholder: "ej: SC-123456", required: true },
    { id: "placa", label: "Placa del vehículo", type: "text", placeholder: "ej: 1234ABC", required: true },
  ],
};

/* ─── Helpers ─────────────────────────────────────────────────── */
function validate(fields, values) {
  const errs = {};
  fields.forEach((f) => {
    if (f.required && !values[f.id]?.toString().trim()) errs[f.id] = "Campo requerido";
    if (f.id === "correo" && values[f.id] && !/\S+@\S+\.\S+/.test(values[f.id])) errs[f.id] = "Correo inválido";
    if (f.id === "contrasena" && values[f.id] && values[f.id].length < 8) errs[f.id] = "Mínimo 8 caracteres";
    if (f.id === "celular" && values[f.id] && !/^\d{7,10}$/.test(values[f.id])) errs[f.id] = "Número inválido";
  });
  return errs;
}

/* ─── Sub‑componente: Campo ───────────────────────────────────── */
function Campo({ field, value, onChange, error }) {
  const [showPass, setShowPass] = useState(false);
  const isPass = field.type === "password";
  return (
    <div className="campo-group">
      <label className="campo-label">{field.label}{field.required && <span className="req">*</span>}</label>
      <div className={`campo-wrap ${error ? "campo-err" : ""}`}>
        {field.type === "select" ? (
          <select className="campo-input" value={value || ""} onChange={(e) => onChange(field.id, e.target.value)}>
            <option value="">Selecciona una opción</option>
            {field.options.map((o) => <option key={o} value={o}>{o}</option>)}
          </select>
        ) : (
          <>
            <input
              className="campo-input"
              type={isPass && !showPass ? "password" : isPass ? "text" : field.type}
              placeholder={field.placeholder}
              value={value || ""}
              onChange={(e) => onChange(field.id, e.target.value)}
            />
            {isPass && (
              <button className="pass-eye" onClick={() => setShowPass(!showPass)} tabIndex={-1} type="button">
                {showPass ? "🙈" : "👁"}
              </button>
            )}
          </>
        )}
      </div>
      {error && <p className="campo-msg">{error}</p>}
    </div>
  );
}

/* ─── Componente Principal ────────────────────────────────────── */
export default function RegistroMultitipo() {
  const [step, setStep] = useState(0); 
  const [rolId, setRolId] = useState(null);
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [terminos, setTerminos] = useState(false);
  const [terminosErr, setTerminosErr] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate(); // 2. Inicializamos la navegación

  const rol = ROLES.find((r) => r.id === rolId);

  const setVal = (id, val) => {
    setValues((v) => ({ ...v, [id]: val }));
    setErrors((e) => { const n = { ...e }; delete n[id]; return n; });
  };

  const irSiguiente = async () => {
    if (step === 0) { if (!rolId) return; setStep(1); return; }
    if (step === 1) {
      const errs = validate(CAMPOS_COMUNES, values);
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setStep(2); return;
    }
    if (step === 2) {
      const errs = validate(CAMPOS_ROL[rolId], values);
      if (Object.keys(errs).length) { setErrors(errs); return; }
      setStep(3); return;
    }
    if (step === 3) {
      if (!terminos) { setTerminosErr(true); return; }
      setSubmitting(true);
      
      // Mapeamos los roles de la interfaz al formato esperado por el backend
      const ROLE_MAP = {
        productor: "PRODUCER",
        comprador: "BUYER",
        transportista: "TRANSPORTER"
      };

      // Separamos los datos generales del perfil específico
      const { contrasena, correo, nombre, celular, ...perfilEspecifico } = values;

      const payload = {
        email: correo,
        password: contrasena,
        fullName: nombre,
        phone: celular, // Asumiendo que tu DTO acepte un campo de celular
        primaryRole: ROLE_MAP[rolId] || "BUYER",
        profileDetails: perfilEspecifico // Mandamos los datos dinámicos como detalles del perfil
      };

      try {
        // Llamada a nuestro servicio de autenticación
        const response = await authApi.register(payload);

        // Guardamos los tokens y sesión (idealmente esto debería ir a un Context, Redux o Zustand)
        localStorage.setItem("accessToken", response.accessToken);
        localStorage.setItem("refreshToken", response.refreshToken);
        localStorage.setItem("user", JSON.stringify(response.user));

        setStep(4);
      } catch (error) {
        console.error("Error al registrar: ", error);
        alert(error.message || "Hubo un error al procesar el registro con el servidor.");
      } finally {
        setSubmitting(false);
      }
    }
  };

  const irAtras = () => setStep((s) => Math.max(0, s - 1));
  const reiniciar = () => { setStep(0); setRolId(null); setValues({}); setErrors({}); setTerminos(false); setTerminosErr(false); };

  const pasos = ["Rol", "Datos", "Perfil", "Confirmar"];
  const progreso = step === 4 ? 4 : step;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .reg-root {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          padding: 32px 16px 48px;
          font-family: 'Nunito', sans-serif;
          background: linear-gradient(160deg, #f0faf0 0%, #e8f5e9 40%, #fff8e1 100%);
          position: relative;
        }

        .reg-root::before {
          content: '';
          position: fixed;
          top: -120px; right: -120px;
          width: 420px; height: 420px;
          background: radial-gradient(circle, #a5d6a7 0%, transparent 70%);
          opacity: .35;
          pointer-events: none;
          z-index: 0;
        }
        .reg-root::after {
          content: '';
          position: fixed;
          bottom: -80px; left: -80px;
          width: 320px; height: 320px;
          background: radial-gradient(circle, #ffe082 0%, transparent 70%);
          opacity: .3;
          pointer-events: none;
          z-index: 0;
        }

        .reg-header {
          text-align: center;
          margin-bottom: 24px;
          position: relative;
          z-index: 1;
          animation: fadeDown .45s ease both;
        }

        .reg-logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-bottom: 6px;
        }

        .reg-logo-icon {
          width: 44px; height: 44px;
          background: linear-gradient(145deg, #66bb6a, #2e7d32);
          border-radius: 12px;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(46,125,50,.35);
        }

        .reg-logo-icon svg { width: 24px; height: 24px; fill: #fff; }

        .reg-logo-name {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #1b5e20;
          letter-spacing: .02em;
        }

        .reg-logo-name span { color: #f57f17; }

        .reg-tagline {
          font-size: 12.5px;
          color: #558b2f;
          letter-spacing: .06em;
          text-transform: uppercase;
          font-weight: 600;
        }

        .stepper {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0;
          margin-bottom: 22px;
          position: relative;
          z-index: 1;
          animation: fadeDown .5s ease .08s both;
        }

        .step-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 5px;
          position: relative;
        }

        .step-circle {
          width: 32px; height: 32px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 13px; font-weight: 800;
          border: 2.5px solid #c8e6c9;
          background: #fff;
          color: #a5d6a7;
          transition: all .35s ease;
          position: relative;
          z-index: 1;
        }

        .step-circle.active { border-color: #2e7d32; background: #2e7d32; color: #fff; box-shadow: 0 0 0 4px rgba(46,125,50,.18); }
        .step-circle.done { border-color: #66bb6a; background: #66bb6a; color: #fff; }

        .step-label {
          font-size: 10.5px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: .06em;
          color: #a5d6a7;
          transition: color .3s;
        }

        .step-label.active { color: #2e7d32; }
        .step-label.done { color: #558b2f; }

        .step-line {
          width: 40px; height: 2.5px;
          background: #c8e6c9;
          margin-bottom: 18px;
          transition: background .4s;
          flex-shrink: 0;
        }

        .step-line.done { background: #66bb6a; }

        .reg-card {
          background: rgba(255,255,255,.95);
          backdrop-filter: blur(12px);
          border-radius: 22px;
          padding: 30px 28px 24px;
          width: 100%;
          max-width: 480px;
          box-shadow: 0 4px 32px rgba(0,0,0,.09), 0 1px 6px rgba(0,0,0,.06);
          position: relative;
          z-index: 1;
          animation: fadeUp .5s ease .1s both;
        }

        .card-head {
          margin-bottom: 22px;
        }

        .card-head h2 {
          font-family: 'Playfair Display', serif;
          font-size: 20px;
          color: #1b5e20;
          margin-bottom: 4px;
        }

        .card-head p {
          font-size: 13px;
          color: #6a8a6a;
          line-height: 1.5;
        }

        .roles-grid {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .rol-card {
          border: 2.5px solid #e8f5e9;
          border-radius: 14px;
          padding: 16px 18px;
          display: flex;
          align-items: center;
          gap: 16px;
          cursor: pointer;
          transition: all .22s ease;
          background: #fafffe;
          position: relative;
          overflow: hidden;
        }

        .rol-card:hover { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(0,0,0,.08); }
        .rol-card.selected { border-width: 2.5px; box-shadow: 0 4px 18px rgba(0,0,0,.1); }

        .rol-icon-wrap {
          width: 54px; height: 54px;
          border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: transform .2s;
        }

        .rol-info { flex: 1; }

        .rol-info h3 {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 3px;
        }

        .rol-info p {
          font-size: 12.5px;
          color: #7a9a7a;
          line-height: 1.4;
        }

        .rol-radio {
          width: 20px; height: 20px;
          border-radius: 50%;
          border: 2.5px solid #c8e6c9;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          transition: all .2s;
        }

        .rol-radio.on { border-color: var(--rol-color); background: var(--rol-color); }
        .rol-radio.on::after { content: ''; width: 7px; height: 7px; border-radius: 50%; background: #fff; display: block; }

        .estado-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: 20px;
          margin-top: 6px;
        }

        .campos-list { display: flex; flex-direction: column; gap: 14px; }

        .campo-group { display: flex; flex-direction: column; gap: 5px; }

        .campo-label {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: .07em;
          text-transform: uppercase;
          color: #4a6a4a;
        }

        .req { color: #e53935; margin-left: 3px; }

        .campo-wrap {
          position: relative;
          border-radius: 11px;
          overflow: visible;
        }

        .campo-input {
          width: 100%;
          background: #f4f9f4;
          border: 1.8px solid transparent;
          border-radius: 11px;
          padding: 12px 14px;
          font-size: 14px;
          font-family: 'Nunito', sans-serif;
          color: #1a3a1a;
          outline: none;
          transition: border-color .2s, box-shadow .2s, background .2s;
          appearance: none;
        }

        .campo-input:focus {
          background: #fff;
          border-color: #4caf50;
          box-shadow: 0 0 0 3px rgba(76,175,80,.13);
        }

        .campo-wrap.campo-err .campo-input {
          border-color: #ef5350;
          background: #fff8f8;
        }

        .campo-msg {
          font-size: 11.5px;
          color: #c62828;
          font-weight: 600;
          padding-left: 4px;
        }

        .pass-eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          font-size: 16px;
          padding: 4px;
          line-height: 1;
        }

        .terminos-box {
          background: #f4f9f4;
          border: 1.5px solid #c8e6c9;
          border-radius: 14px;
          padding: 18px;
          display: flex;
          gap: 14px;
          align-items: flex-start;
          cursor: pointer;
          transition: border-color .2s;
          margin-bottom: 16px;
        }

        .terminos-box.err { border-color: #ef9a9a; background: #fff8f8; }
        .terminos-box:hover { border-color: #66bb6a; }

        .terminos-check {
          width: 22px; height: 22px;
          border: 2.5px solid #a5d6a7;
          border-radius: 6px;
          flex-shrink: 0;
          display: flex; align-items: center; justify-content: center;
          font-size: 14px;
          transition: all .2s;
          background: #fff;
          margin-top: 1px;
        }

        .terminos-check.on { border-color: #2e7d32; background: #2e7d32; color: #fff; }

        .terminos-text p { font-size: 13px; color: #4a6a4a; line-height: 1.5; }
        .terminos-text strong { color: #1b5e20; }

        .estado-preview {
          border-radius: 14px;
          padding: 16px;
          margin-top: 2px;
        }

        .estado-preview h4 {
          font-size: 13px;
          font-weight: 800;
          color: #1b5e20;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: .05em;
        }

        .estado-preview p { font-size: 12.5px; color: #558b2f; line-height: 1.5; }

        .btn-row {
          display: flex;
          gap: 10px;
          margin-top: 22px;
        }

        .btn-back {
          padding: 13px 20px;
          border: 2px solid #c8e6c9;
          border-radius: 12px;
          background: #fff;
          color: #4a8a4a;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 700;
          cursor: pointer;
          transition: all .18s;
          flex-shrink: 0;
        }

        .btn-back:hover { background: #f1f8e9; border-color: #81c784; }

        .btn-next {
          flex: 1;
          padding: 14px;
          background: linear-gradient(135deg, #388e3c, #1b5e20);
          color: #fff;
          border: none;
          border-radius: 12px;
          font-family: 'Nunito', sans-serif;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          box-shadow: 0 4px 16px rgba(27,94,32,.35);
          transition: transform .15s, box-shadow .15s, opacity .15s;
          letter-spacing: .01em;
        }

        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(27,94,32,.4); }
        .btn-next:disabled { opacity: .7; cursor: not-allowed; }

        .spinner {
          width: 18px; height: 18px;
          border: 2.5px solid rgba(255,255,255,.4);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin .7s linear infinite;
        }

        .exito-wrap {
          text-align: center;
          padding: 16px 0;
        }

        .exito-icon {
          width: 80px; height: 80px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 38px;
          margin: 0 auto 18px;
          animation: popIn .5s cubic-bezier(.34,1.56,.64,1) both;
        }

        .exito-wrap h2 {
          font-family: 'Playfair Display', serif;
          font-size: 22px;
          color: #1b5e20;
          margin-bottom: 8px;
        }

        .exito-wrap p {
          font-size: 13.5px;
          color: #6a8a6a;
          line-height: 1.6;
          max-width: 340px;
          margin: 0 auto 8px;
        }

        .exito-estado {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          padding: 8px 18px;
          border-radius: 20px;
          margin: 14px auto 0;
        }

        .exito-nota {
          margin-top: 18px;
          padding: 14px;
          border-radius: 12px;
          font-size: 12.5px;
          line-height: 1.5;
        }

        .exito-nota.pendiente { background: #fff8e1; color: #f57f17; border: 1.5px solid #ffe082; }
        .exito-nota.registrado { background: #e8f5e9; color: #2e7d32; border: 1.5px solid #a5d6a7; }

        .btn-nuevo {
          margin-top: 20px;
          padding: 12px 28px;
          background: transparent;
          border: 2px solid #81c784;
          border-radius: 12px;
          color: #2e7d32;
          font-family: 'Nunito', sans-serif;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          transition: all .18s;
        }

        .reg-footer {
          margin-top: 20px;
          text-align: center;
          font-size: 11.5px;
          color: #8aaa8a;
          position: relative;
          z-index: 1;
          animation: fadeUp .6s ease .25s both;
        }

        .reg-footer a { color: #4caf50; font-weight: 700; cursor: pointer; text-decoration: none; }
        .reg-footer a:hover { text-decoration: underline; }

        @keyframes fadeDown { from { opacity:0; transform: translateY(-14px); } to { opacity:1; transform: translateY(0); } }
        @keyframes fadeUp   { from { opacity:0; transform: translateY(14px);  } to { opacity:1; transform: translateY(0); } }
        @keyframes spin     { to   { transform: rotate(360deg); } }
        @keyframes popIn    {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          100% { transform: scale(1) rotate(0deg);   opacity: 1; }
        }
      `}</style>

      <div className="reg-root">
        <div className="reg-header">
          <div className="reg-logo">
            <div className="reg-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19H4c.44-.87 1.71-3 3-4 1.42 4.37 6.05 6 10 4-3.18 1.55-7.9.98-10-1.5.6 1.32 1 2.5 1 4H6c0-2.39-1-4-1-4S2 17 2 21h2c0-3.5 1-5 2-8 1.12 5.33 5.5 7.5 10 7.5 0 0-5-1-7-7 2 4 6 5 8 4-4-2-5-6-5-9 2 3 4 5 8 5-3-1-5-4-6-7 3 2 7 2 9 0z"/></svg>
            </div>
            <span className="reg-logo-name">Agro<span>Directo</span></span>
          </div>
          <p className="reg-tagline">Del campo a tu negocio, sin intermediarios</p>
        </div>

        {step < 4 && (
          <div className="stepper">
            {pasos.map((p, i) => (
              <div key={p} style={{ display: "flex", alignItems: "center" }}>
                <div className="step-item">
                  <div className={`step-circle ${i < progreso ? "done" : i === progreso ? "active" : ""}`}>
                    {i < progreso ? "✓" : i + 1}
                  </div>
                  <span className={`step-label ${i < progreso ? "done" : i === progreso ? "active" : ""}`}>{p}</span>
                </div>
                {i < pasos.length - 1 && <div className={`step-line ${i < progreso ? "done" : ""}`} />}
              </div>
            ))}
          </div>
        )}

        <div className="reg-card">
          {step === 0 && (
            <>
              <div className="card-head">
                <h2>¿Cuál es tu rol?</h2>
                <p>Elige cómo participas en AgroDirecto.</p>
              </div>
              <div className="roles-grid">
                {ROLES.map((r) => (
                  <div
                    key={r.id}
                    className={`rol-card ${rolId === r.id ? "selected" : ""}`}
                    style={rolId === r.id ? { borderColor: r.color, background: r.bg } : {}}
                    onClick={() => setRolId(r.id)}
                  >
                    <div className="rol-icon-wrap" style={{ background: r.bg, color: r.color }}>{r.icon}</div>
                    <div className="rol-info">
                      <h3 style={{ color: rolId === r.id ? r.color : "#1b3a1b" }}>{r.label}</h3>
                      <p>{r.desc}</p>
                    </div>
                    <div className={`rol-radio ${rolId === r.id ? "on" : ""}`} style={{ "--rol-color": r.color }} />
                  </div>
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-next" onClick={irSiguiente} disabled={!rolId}>Continuar →</button>
              </div>
            </>
          )}

          {step === 1 && (
            <>
              <div className="card-head"><h2>Datos generales</h2><p>Información básica requerida.</p></div>
              <div className="campos-list">
                {CAMPOS_COMUNES.map((f) => (
                  <Campo key={f.id} field={f} value={values[f.id]} onChange={setVal} error={errors[f.id]} />
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-back" onClick={irAtras}>← Atrás</button>
                <button className="btn-next" onClick={irSiguiente}>Continuar →</button>
              </div>
            </>
          )}

          {step === 2 && rol && (
            <>
              <div className="card-head"><h2>Perfil de {rol.label}</h2><p>Datos específicos para tu verificación.</p></div>
              <div className="campos-list">
                {CAMPOS_ROL[rolId].map((f) => (
                  <Campo key={f.id} field={f} value={values[f.id]} onChange={setVal} error={errors[f.id]} />
                ))}
              </div>
              <div className="btn-row">
                <button className="btn-back" onClick={irAtras}>← Atrás</button>
                <button className="btn-next" onClick={irSiguiente}>Continuar →</button>
              </div>
            </>
          )}

          {step === 3 && rol && (
            <>
              <div className="card-head"><h2>Confirmar registro</h2><p>Revisa y acepta las políticas.</p></div>
              <div className={`terminos-box ${terminosErr ? "err" : ""}`} onClick={() => { setTerminos(!terminos); setTerminosErr(false); }}>
                <div className={`terminos-check ${terminos ? "on" : ""}`}>{terminos && "✓"}</div>
                <div className="terminos-text"><p>Acepto los términos y condiciones de AgroDirecto.</p></div>
              </div>
              <div className="btn-row">
                <button className="btn-back" onClick={irAtras}>← Atrás</button>
                <button className="btn-next" onClick={irSiguiente} disabled={submitting}>
                  {submitting ? <span className="spinner" /> : "Crear cuenta ✓"}
                </button>
              </div>
            </>
          )}

          {step === 4 && rol && (
            <div className="exito-wrap">
              <div className="exito-icon" style={{ background: rol.bg, color: rol.color }}>🎉</div>
              <h2>¡Bienvenido!</h2>
              <p>Tu cuenta ha sido creada exitosamente.</p>
              <button className="btn-nuevo" onClick={reiniciar}>Registrar otra cuenta</button>
            </div>
          )}
        </div>

        <div className="reg-footer">
          {/* 3. Agregamos el evento onClick con navigate */}
          {step < 4 && <p>¿Ya tienes cuenta? <a onClick={() => navigate("/login")}>Inicia sesión</a></p>}
          <p style={{ marginTop: 6 }}>© 2024 AgroDirecto · Santa Cruz, Bolivia</p>
        </div>
      </div>
    </>
  );
}