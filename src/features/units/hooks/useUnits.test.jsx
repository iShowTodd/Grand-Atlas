import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { fetchUnits } from "../api/unitsApi";
import { useUnits } from "./useUnits";

jest.mock("../api/unitsApi", () => ({
  createUnit: jest.fn(),
  deleteUnit: jest.fn(),
  fetchUnit: jest.fn(),
  fetchUnits: jest.fn(),
  updateUnit: jest.fn(),
}));

describe("useUnits", () => {
  it("fetches units using the supplied API filters", async () => {
    const units = [{ id: "unit-1", title: "Garden Home" }];
    fetchUnits.mockResolvedValue(units);
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useUnits({ status: "AVAILABLE" }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(fetchUnits).toHaveBeenCalledWith({ status: "AVAILABLE" });
    expect(result.current.data).toEqual(units);
  });
});
