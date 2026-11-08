import {
  apiClient,
  extractImageReferences,
  extractImageSources,
  resolveAssetUrl,
  unwrapCollection,
  unwrapRecord,
} from "../../../api/client";

export function normalizeUnit(unit) {
  const id = unit.id ?? unit._id;
  const title =
    unit.title_en ??
    unit.title ??
    unit.name_en ??
    unit.name ??
    unit.title_ar ??
    unit.name_ar;

  if (typeof id !== "string" || !id) {
    throw new Error("A unit record is missing its id.");
  }
  if (typeof title !== "string" || !title) {
    throw new Error(`Unit ${id} is missing its title.`);
  }

  const images = extractImageSources(unit.images ?? unit.imageUrls);
  const imageRefs = extractImageReferences(unit.images ?? unit.imageUrls);
  const singleImage =
    typeof unit.image === "string" ? resolveAssetUrl(unit.image) : "";
  const singleImageRef = typeof unit.image === "string" ? unit.image : "";
  const projectSource = unit.project;
  const developerSource = unit.developer ?? projectSource?.developer;
  const zoneSource = unit.zone ?? projectSource?.zone;

  return {
    ...unit,
    id,
    title,
    description: unit.description_en ?? unit.description ?? "",
    city: unit.city_en ?? unit.city ?? "",
    price: unit.price,
    size: unit.size,
    bedrooms: unit.bedrooms,
    bathrooms: unit.bathrooms,
    status: unit.status ?? "",
    images: images.length ? images : singleImage ? [singleImage] : [],
    imageRefs: imageRefs.length
      ? imageRefs
      : singleImageRef
        ? [singleImageRef]
        : [],
    project:
      typeof projectSource === "string"
        ? { name: projectSource }
        : projectSource
          ? {
              ...projectSource,
              name:
                projectSource.name_en ??
                projectSource.name ??
                projectSource.name_ar ??
                "",
            }
          : { name: unit.projectName_en ?? unit.projectName ?? "" },
    developer:
      typeof developerSource === "string"
        ? { name: developerSource }
        : developerSource
          ? {
              ...developerSource,
              name:
                developerSource.name_en ??
                developerSource.name ??
                developerSource.name_ar ??
                "",
            }
          : { name: unit.developerName_en ?? unit.developerName ?? "" },
    zone:
      typeof zoneSource === "string"
        ? { name: zoneSource }
        : zoneSource
          ? {
              ...zoneSource,
              name:
                zoneSource.name_en ??
                zoneSource.name ??
                zoneSource.name_ar ??
                "",
            }
          : { name: unit.zoneName_en ?? unit.zoneName ?? "" },
  };
}

export async function fetchUnits(filters = {}) {
  const params = Object.fromEntries(
    Object.entries(filters).filter(
      ([, value]) => value !== "" && value !== undefined && value !== null,
    ),
  );
  const data = await apiClient.get("/unit", { params });
  return unwrapCollection(data, "units").map(normalizeUnit);
}

export async function fetchUnit(id) {
  const data = await apiClient.get(`/unit/${encodeURIComponent(id)}`);
  return normalizeUnit(unwrapRecord(data, "unit"));
}

export function createUnit(payload) {
  return apiClient.post("/unit/create", payload);
}

export function updateUnit({ id, payload }) {
  return apiClient.patch(`/unit/${encodeURIComponent(id)}`, payload);
}

export function deleteUnit(id) {
  return apiClient.delete(`/unit/${encodeURIComponent(id)}`);
}
