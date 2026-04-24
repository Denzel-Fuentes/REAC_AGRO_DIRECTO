import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Login";
import RegistroMultitipo from "./RegistroMultitipo";
import Home from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirigir la raíz ("/") directamente al login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Rutas de la aplicación */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<RegistroMultitipo />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;