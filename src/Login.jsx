import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [errorGlobal, setErrorGlobal] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorGlobal("");
    
    if (!correo || !contrasena) {
      setErrorGlobal("Por favor, completa todos los campos.");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, correo, contrasena);
      // Si el inicio de sesión es exitoso, redirige al home
      navigate("/home");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      setErrorGlobal("Correo o contraseña incorrectos.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <style>{`
        /* Reutilizamos el CSS exacto de tu RegistroMultitipo */
        @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800&family=Playfair+Display:wght@700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .reg-root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 32px 16px; font-family: 'Nunito', sans-serif; background: linear-gradient(160deg, #f0faf0 0%, #e8f5e9 40%, #fff8e1 100%); position: relative; }
        .reg-root::before { content: ''; position: fixed; top: -120px; right: -120px; width: 420px; height: 420px; background: radial-gradient(circle, #a5d6a7 0%, transparent 70%); opacity: .35; pointer-events: none; z-index: 0; }
        .reg-root::after { content: ''; position: fixed; bottom: -80px; left: -80px; width: 320px; height: 320px; background: radial-gradient(circle, #ffe082 0%, transparent 70%); opacity: .3; pointer-events: none; z-index: 0; }
        .reg-header { text-align: center; margin-bottom: 24px; position: relative; z-index: 1; }
        .reg-logo { display: flex; align-items: center; justify-content: center; gap: 10px; margin-bottom: 6px; }
        .reg-logo-icon { width: 44px; height: 44px; background: linear-gradient(145deg, #66bb6a, #2e7d32); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(46,125,50,.35); }
        .reg-logo-icon svg { width: 24px; height: 24px; fill: #fff; }
        .reg-logo-name { font-family: 'Playfair Display', serif; font-size: 22px; color: #1b5e20; letter-spacing: .02em; }
        .reg-logo-name span { color: #f57f17; }
        .reg-tagline { font-size: 12.5px; color: #558b2f; letter-spacing: .06em; text-transform: uppercase; font-weight: 600; }
        .reg-card { background: rgba(255,255,255,.95); backdrop-filter: blur(12px); border-radius: 22px; padding: 30px 28px 24px; width: 100%; max-width: 420px; box-shadow: 0 4px 32px rgba(0,0,0,.09), 0 1px 6px rgba(0,0,0,.06); position: relative; z-index: 1; }
        .card-head { margin-bottom: 22px; text-align: center; }
        .card-head h2 { font-family: 'Playfair Display', serif; font-size: 20px; color: #1b5e20; margin-bottom: 4px; }
        .card-head p { font-size: 13px; color: #6a8a6a; line-height: 1.5; }
        .campos-list { display: flex; flex-direction: column; gap: 14px; }
        .campo-group { display: flex; flex-direction: column; gap: 5px; text-align: left; }
        .campo-label { font-size: 11.5px; font-weight: 800; letter-spacing: .07em; text-transform: uppercase; color: #4a6a4a; }
        .campo-wrap { position: relative; border-radius: 11px; }
        .campo-input { width: 100%; background: #f4f9f4; border: 1.8px solid transparent; border-radius: 11px; padding: 12px 14px; font-size: 14px; font-family: 'Nunito', sans-serif; color: #1a3a1a; outline: none; transition: all .2s; }
        .campo-input:focus { background: #fff; border-color: #4caf50; box-shadow: 0 0 0 3px rgba(76,175,80,.13); }
        .pass-eye { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); background: none; border: none; cursor: pointer; font-size: 16px; padding: 4px; }
        .btn-next { width: 100%; margin-top: 22px; padding: 14px; background: linear-gradient(135deg, #388e3c, #1b5e20); color: #fff; border: none; border-radius: 12px; font-family: 'Nunito', sans-serif; font-size: 15px; font-weight: 800; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 16px rgba(27,94,32,.35); transition: all .15s; }
        .btn-next:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(27,94,32,.4); }
        .btn-next:disabled { opacity: .7; cursor: not-allowed; }
        .spinner { width: 18px; height: 18px; border: 2.5px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
        .error-msg { background: #ffebee; color: #c62828; padding: 10px; border-radius: 8px; font-size: 13px; font-weight: 600; text-align: center; margin-bottom: 16px; border: 1px solid #ffcdd2; }
        .reg-footer { margin-top: 20px; text-align: center; font-size: 12.5px; color: #8aaa8a; position: relative; z-index: 1; }
        .reg-footer button { background: none; border: none; color: #4caf50; font-weight: 800; cursor: pointer; font-family: 'Nunito', sans-serif; font-size: 12.5px; }
        .reg-footer button:hover { text-decoration: underline; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="reg-root">
        <div className="reg-header">
          <div className="reg-logo">
            <div className="reg-logo-icon">
              <svg viewBox="0 0 24 24"><path d="M17 8C8 10 5.9 16.17 3.82 19H4c.44-.87 1.71-3 3-4 1.42 4.37 6.05 6 10 4-3.18 1.55-7.9.98-10-1.5.6 1.32 1 2.5 1 4H6c0-2.39-1-4-1-4S2 17 2 21h2c0-3.5 1-5 2-8 1.12 5.33 5.5 7.5 10 7.5 0 0-5-1-7-7 2 4 6 5 8 4-4-2-5-6-5-9 2 3 4 5 8 5-3-1-5-4-6-7 3 2 7 2 9 0z"/></svg>
            </div>
            <span className="reg-logo-name">Agro<span>Directo</span></span>
          </div>
          <p className="reg-tagline">Portal de Acceso</p>
        </div>

        <div className="reg-card">
          <div className="card-head">
            <h2>Iniciar Sesión</h2>
            <p>Ingresa tus credenciales para acceder a tu panel.</p>
          </div>

          {errorGlobal && <div className="error-msg">{errorGlobal}</div>}

          <form onSubmit={handleLogin} className="campos-list">
            <div className="campo-group">
              <label className="campo-label">Correo electrónico</label>
              <div className="campo-wrap">
                <input
                  className="campo-input"
                  type="email"
                  placeholder="ej: usuario@email.com"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                />
              </div>
            </div>

            <div className="campo-group">
              <label className="campo-label">Contraseña</label>
              <div className="campo-wrap">
                <input
                  className="campo-input"
                  type={showPass ? "text" : "password"}
                  placeholder="Tu contraseña"
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                />
                <button 
                  type="button" 
                  className="pass-eye" 
                  onClick={() => setShowPass(!showPass)}
                  tabIndex={-1}
                >
                  {showPass ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button type="submit" className="btn-next" disabled={submitting}>
              {submitting ? <span className="spinner" /> : "Ingresar →"}
            </button>
          </form>
        </div>

        <div className="reg-footer">
          <p>¿No tienes cuenta? <button onClick={() => navigate("/registro")}>Regístrate aquí</button></p>
        </div>
      </div>
    </>
  );
}