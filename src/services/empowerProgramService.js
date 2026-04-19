import api from "./api.js";

export async function createEmpowerProgramRegistration(payload) {
  const { data } = await api.post("/api/v1/empower-program/registrations", payload);
  return data;
}

