import { apiClient, unwrapCollection } from "../../../api/client";

export async function login(credentials) {
  const data = await apiClient.post("/auth/login", credentials);
  const response = data?.data ?? data;
  const token =
    response?.accessToken ?? response?.access_token ?? response?.token;

  if (typeof token !== "string" || token.length === 0) {
    throw new Error("Login response did not include an authentication token.");
  }

  const profile = response?.user ?? response?.profile ?? response;
  const user = {
    ...profile,
    email: profile.email ?? credentials.email,
    role: profile.role,
  };

  return { token, user };
}

export async function register(payload) {
  const data = await apiClient.post("/auth/register", payload);
  return data;
}

export async function fetchUsers() {
  const data = await apiClient.get("/auth/users");
  return unwrapCollection(data, "users");
}

export async function createAdminUser(payload) {
  const data = await apiClient.post("/auth/create-user", payload);
  return data;
}
