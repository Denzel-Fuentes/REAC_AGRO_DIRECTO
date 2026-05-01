export function validateFields(fields, values) {
  return fields.reduce((errors, field) => {
    const value = values[field.id]?.toString().trim();

    if (field.required && !value) {
      return { ...errors, [field.id]: "Campo requerido" };
    }

    if (field.id === "correo" && value && !/\S+@\S+\.\S+/.test(value)) {
      return { ...errors, [field.id]: "Correo inválido" };
    }

    if (field.id === "contrasena" && value && value.length < 8) {
      return { ...errors, [field.id]: "Mínimo 8 caracteres" };
    }

    if (field.id === "celular" && value && !/^\d{7,10}$/.test(value)) {
      return { ...errors, [field.id]: "Número inválido" };
    }

    return errors;
  }, {});
}
