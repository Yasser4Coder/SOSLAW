import api from "./api.js";

export async function createHopeForumRegistration(payload) {
  const { data } = await api.post("/api/v1/hope-forum/registrations", payload);
  return data;
}
