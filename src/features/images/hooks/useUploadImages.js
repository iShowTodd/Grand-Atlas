import { useMutation } from "@tanstack/react-query";
import { uploadImages } from "../api/imagesApi";

export function useUploadImages() {
  return useMutation({ mutationFn: uploadImages });
}
