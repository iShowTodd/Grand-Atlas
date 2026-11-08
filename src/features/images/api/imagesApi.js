import { apiClient, extractImageSources } from "../../../api/client";

export async function uploadImages(files) {
  const body = new FormData();
  for (const file of files) body.append("images", file);

  const data = await apiClient.post("/images/upload", body);
  const source =
    data?.images ??
    data?.data?.images ??
    data?.data ??
    data?.files ??
    data?.urls;

  const images = extractImageSources(Array.isArray(source) ? source : []);
  if (!images.length) {
    throw new Error("Image upload response did not contain image URLs.");
  }
  return images;
}
