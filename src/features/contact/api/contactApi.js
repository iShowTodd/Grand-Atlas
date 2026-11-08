import { apiClient } from "../../../api/client";

export function sendContactMessage(payload) {
  return apiClient.post("/contactus", payload);
}
