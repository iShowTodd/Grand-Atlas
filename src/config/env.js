const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

if (!configuredApiBaseUrl) {
  throw new Error(
    "VITE_API_BASE_URL is required. Set it in the environment before starting the app.",
  );
}

if (import.meta.env.PROD) {
  let apiUrl;
  try {
    apiUrl = new URL(configuredApiBaseUrl);
  } catch {
    throw new Error(
      "VITE_API_BASE_URL must be a full HTTPS URL in production.",
    );
  }

  if (apiUrl.protocol !== "https:" || !apiUrl.hostname) {
    throw new Error(
      "VITE_API_BASE_URL must be a full HTTPS URL in production.",
    );
  }
}

export const API_BASE_URL = configuredApiBaseUrl.replace(/\/+$/, "");
export const SITE_URL =
  typeof window !== "undefined" ? window.location.origin : "";
export const SOCIAL_LINKS = {
  facebook: "https://facebook.com",
  instagram: "https://instagram.com",
  tiktok: "https://tiktok.com",
};
