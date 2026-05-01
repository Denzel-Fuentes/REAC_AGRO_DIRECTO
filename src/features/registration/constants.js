export const ROLES = [
  {
    id: "productor",
    label: "Productor",
    description: "Publico mis cosechas y gestiono pedidos",
    status: "Pendiente de verificación",
    accentClass: "border-green-700 bg-green-50 text-green-900",
    iconClass: "bg-green-100 text-green-800",
  },
  {
    id: "comprador",
    label: "Comprador",
    description: "Busco, compro y pago productos agrícolas",
    status: "Registrado",
    accentClass: "border-sky-700 bg-sky-50 text-sky-900",
    iconClass: "bg-sky-100 text-sky-800",
  },
  {
    id: "transportista",
    label: "Transportista",
    description: "Acepto pedidos y realizo entregas del campo a la ciudad",
    status: "Pendiente de verificación",
    accentClass: "border-amber-700 bg-amber-50 text-amber-900",
    iconClass: "bg-amber-100 text-amber-800",
  },
];

export const COMMON_FIELDS = [
  { id: "nombre", label: "Nombre completo", type: "text", placeholder: "ej: Juan Perez Lopez", required: true },
  { id: "correo", label: "Correo electrónico", type: "email", placeholder: "ej: juan@email.com", required: true },
  { id: "contrasena", label: "Contraseña", type: "password", placeholder: "Mínimo 8 caracteres", required: true },
  { id: "celular", label: "Número de celular", type: "tel", placeholder: "ej: 76543210", required: true },
];

export const ROLE_FIELDS = {
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

export const REGISTRATION_STEPS = ["Rol", "Datos", "Perfil", "Confirmar"];
