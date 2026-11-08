import axios from "axios";
import { API_BASE_URL } from "../config/env";

export { API_BASE_URL };

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("grand-atlas-token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error) {
  const responseData = error?.response?.data;
  const message =
    responseData?.message ??
    responseData?.messages ??
    responseData?.error ??
    error?.message;

  return typeof message === "string" && message.trim()
    ? message
    : "The request failed. Please try again.";
}

export function unwrapCollection(payload, resourceName) {
  if (Array.isArray(payload)) return payload;
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  if (Array.isArray(payload?.data?.items)) return payload.data.items;
  if (Array.isArray(payload?.data?.results)) return payload.data.results;

  throw new Error(
    `The ${resourceName} response did not contain a supported collection.`,
  );
}

apiClient.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const config = error.config;
    if (!error.response && config && !config.__networkRetry) {
      config.__networkRetry = true;
      return apiClient.request(config);
    }

    if (typeof window !== "undefined") {
      if (
        error.response?.status === 401 &&
        localStorage.getItem("grand-atlas-token")
      ) {
        window.dispatchEvent(new CustomEvent("api:unauthorized"));
      }
      if (error.response?.status >= 500) {
        window.dispatchEvent(new CustomEvent("api:server-error"));
      }
    }

    return Promise.reject(error);
  },
);

export function unwrapRecord(payload, resourceName) {
  const record =
    payload?.data && !Array.isArray(payload.data) ? payload.data : payload;

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    throw new Error(`The ${resourceName} response did not contain a record.`);
  }

  return record;
}

export function resolveAssetUrl(value) {
  if (typeof value !== "string" || !value.trim()) return "";
  if (/^(https?:)?\/\//i.test(value)) return value;
  if (value.startsWith("data:")) return value;
  if (!API_BASE_URL) return value;

  const apiUrl = new URL(API_BASE_URL, window.location.origin);
  return value.startsWith("/")
    ? new URL(value, apiUrl.origin).toString()
    : new URL(value, `${API_BASE_URL}/`).toString();
}

export function extractImageSources(value) {
  if (!Array.isArray(value)) return [];

  return extractImageReferences(value).map(resolveAssetUrl);
}

export function extractImageReferences(value) {
  if (!Array.isArray(value)) return [];

  return value
    .map((image) => {
      if (typeof image === "string") return image;
      if (image && typeof image === "object") {
        return image.url ?? image.imageUrl ?? image.path ?? image.src ?? "";
      }
      return "";
    })
    .filter((image) => typeof image === "string" && image.length > 0);
}
