import {
  apiClient,
  extractImageReferences,
  extractImageSources,
  unwrapCollection,
  unwrapRecord,
} from "../../../api/client";
import { normalizeUnit } from "../../units";

export function normalizeProject(project) {
  const id = project.id ?? project._id;
  const name =
    project.name_en ??
    project.name ??
    project.title_en ??
    project.title ??
    project.name_ar ??
    project.title_ar;
  if (typeof id !== "string" || !id) {
    throw new Error("A project record is missing its id.");
  }
  if (typeof name !== "string" || !name) {
    throw new Error(`Project ${id} is missing its name.`);
  }

  const developer =
    typeof project.developer === "string"
      ? { name: project.developer }
      : project.developer
        ? {
            ...project.developer,
            name:
              project.developer.name_en ??
              project.developer.name ??
              project.developer.name_ar ??
              "",
          }
        : { name: project.developerName_en ?? project.developerName ?? "" };
  const zone =
    typeof project.zone === "string"
      ? { name: project.zone }
      : project.zone
        ? {
            ...project.zone,
            name:
              project.zone.name_en ??
              project.zone.name ??
              project.zone.name_ar ??
              "",
          }
        : { name: project.zoneName_en ?? project.zoneName ?? "" };

  return {
    ...project,
    id,
    name,
    description: project.description_en ?? project.description ?? "",
    images: extractImageSources(project.images),
    imageRefs: extractImageReferences(project.images),
    developer,
    zone,
    units: Array.isArray(project.units) ? project.units.map(normalizeUnit) : [],
  };
}

export async function fetchProjects() {
  const data = await apiClient.get("/projects/all-projects");
  return unwrapCollection(data, "projects").map(normalizeProject);
}

export async function fetchProject(id) {
  const data = await apiClient.get(`/projects/${encodeURIComponent(id)}`);
  return normalizeProject(unwrapRecord(data, "project"));
}

export function createProject(payload) {
  return apiClient.post("/projects/create", payload);
}

export function updateProject({ id, payload }) {
  return apiClient.patch(`/projects/${encodeURIComponent(id)}`, payload);
}

export function deleteProject(id) {
  return apiClient.delete(`/projects/${encodeURIComponent(id)}`);
}
