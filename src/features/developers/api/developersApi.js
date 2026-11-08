import {
  apiClient,
  extractImageReferences,
  extractImageSources,
  unwrapCollection,
  unwrapRecord,
} from "../../../api/client";

function normalizeDeveloper(developer) {
  const id = developer.id ?? developer._id;
  const name =
    developer.name_en ??
    developer.name ??
    developer.title_en ??
    developer.title ??
    developer.name_ar;
  if (typeof id !== "string" || !id) {
    throw new Error("A developer record is missing its id.");
  }
  if (typeof name !== "string" || !name) {
    throw new Error(`Developer ${id} is missing its name.`);
  }

  return {
    ...developer,
    id,
    name,
    description: developer.description_en ?? developer.description ?? "",
    images: extractImageSources(developer.images),
    imageRefs: extractImageReferences(developer.images),
  };
}

export async function fetchDevelopers() {
  const data = await apiClient.get("/developer");
  return unwrapCollection(data, "developers").map(normalizeDeveloper);
}

export async function fetchDeveloper(id) {
  const data = await apiClient.get(`/developer/${encodeURIComponent(id)}`);
  return normalizeDeveloper(unwrapRecord(data, "developer"));
}

export function createDeveloper(payload) {
  return apiClient.post("/developer/create-developer", payload);
}

export function updateDeveloper({ id, payload }) {
  return apiClient.patch(`/developer/${encodeURIComponent(id)}`, payload);
}

export function deleteDeveloper(id) {
  return apiClient.delete(`/developer/${encodeURIComponent(id)}`);
}
