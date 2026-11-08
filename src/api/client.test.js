import {
  API_BASE_URL,
  apiClient,
  resolveAssetUrl,
  unwrapCollection,
} from "./client";
import { normalizeUnit } from "../features/units";

describe("API response normalization", () => {
  const defaultAdapter = apiClient.defaults.adapter;

  afterEach(() => {
    apiClient.defaults.adapter = defaultAdapter;
    localStorage.clear();
  });

  it("uses the configured base URL, bearer token, and response data", async () => {
    let requestConfig;
    localStorage.setItem("grand-atlas-token", "session-token");
    apiClient.defaults.adapter = async (config) => {
      requestConfig = config;
      return {
        data: { success: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await expect(apiClient.get("/test")).resolves.toEqual({ success: true });
    expect(requestConfig.baseURL).toBe(API_BASE_URL);
    expect(requestConfig.headers.Authorization).toBe("Bearer session-token");
  });

  it("retries a network failure once", async () => {
    let attempts = 0;
    apiClient.defaults.adapter = async (config) => {
      attempts += 1;
      if (attempts === 1) {
        const error = new Error("Network Error");
        error.config = config;
        throw error;
      }

      return {
        data: { recovered: true },
        status: 200,
        statusText: "OK",
        headers: {},
        config,
      };
    };

    await expect(apiClient.get("/test")).resolves.toEqual({ recovered: true });
    expect(attempts).toBe(2);
  });

  it("accepts documented collection wrapper shapes", () => {
    expect(unwrapCollection([{ id: "1" }], "units")).toEqual([{ id: "1" }]);
    expect(unwrapCollection({ data: [{ id: "2" }] }, "units")).toEqual([
      { id: "2" },
    ]);
  });

  it("rejects unknown response shapes instead of hiding contract errors", () => {
    expect(() => unwrapCollection({ message: "ok" }, "units")).toThrow(
      "The units response did not contain a supported collection.",
    );
  });

  it("normalizes the API unit fields used by residence cards", () => {
    expect(
      normalizeUnit({
        id: "unit-1",
        title_en: "Garden Home",
        city_en: "New Cairo",
        images: ["/uploads/garden-home.jpg"],
        bedrooms: 3,
      }),
    ).toMatchObject({
      id: "unit-1",
      title: "Garden Home",
      city: "New Cairo",
      bedrooms: 3,
      images: expect.arrayContaining([
        resolveAssetUrl("/uploads/garden-home.jpg"),
      ]),
    });
  });

  it("rejects records without required identifiers and titles", () => {
    expect(() => normalizeUnit({ id: "missing-title" })).toThrow(
      "Unit missing-title is missing its title.",
    );
  });
});
