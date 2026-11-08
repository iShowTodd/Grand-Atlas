import {
  apiClient,
  extractImageReferences,
  extractImageSources,
  unwrapCollection,
} from "../../../api/client";

function normalizeZone(zone) {
  const id = zone.id ?? zone._id;
  const name =
    zone.name_en ?? zone.name ?? zone.title_en ?? zone.title ?? zone.name_ar;
  if (typeof id !== "string" || !id) {
    throw new Error("A zone record is missing its id.");
  }
  if (typeof name !== "string" || !name) {
    throw new Error(`Zone ${id} is missing its name.`);
  }

  return {
    ...zone,
    id,
    name,
    city: zone.city_en ?? zone.city ?? "",
    description: zone.description_en ?? zone.description ?? "",
    images: extractImageSources(zone.images),
    imageRefs: extractImageReferences(zone.images),
  };
}

export async function fetchZones() {
  const data = await apiClient.get("/zone");
  return unwrapCollection(data, "zones").map(normalizeZone);
}

export function createZone(payload) {
  return apiClient.post("/zone", payload);
}

export function updateZone({ id, payload }) {
  return apiClient.patch(`/zone/${encodeURIComponent(id)}`, payload);
}

export function deleteZone(id) {
  return apiClient.delete(`/zone/${encodeURIComponent(id)}`);
}
