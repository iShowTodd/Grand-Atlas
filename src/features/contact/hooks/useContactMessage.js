import { useMutation } from "@tanstack/react-query";
import { sendContactMessage } from "../api/contactApi";

export function useContactMessage() {
  return useMutation({ mutationFn: sendContactMessage });
}
