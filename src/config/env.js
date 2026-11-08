const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is required. Add it to the project .env file before starting the app.",
  );
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
export const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "";
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
};
