const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is required. Set it in the environment before starting the app.",
  );
}

if (
  import.meta.env.PROD &&
  (!configuredApiBaseUrl.startsWith("/") ||
    configuredApiBaseUrl.startsWith("//"))
) {
  throw new Error(
    "VITE_API_BASE_URL must be a same-origin path in production.",
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
