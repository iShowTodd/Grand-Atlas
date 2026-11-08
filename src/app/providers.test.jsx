import { useQuery } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { AppProviders } from "./providers";

describe("AppProviders query retries", () => {
  it("does not retry a rate-limited query", async () => {
    const error = Object.assign(new Error("Too Many Requests"), {
      response: { status: 429 },
    });
    const queryFn = jest.fn().mockRejectedValue(error);

    const { result } = renderHook(
      () => useQuery({ queryKey: ["rate-limited"], queryFn }),
      { wrapper: AppProviders },
    );

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(queryFn).toHaveBeenCalledTimes(1);
  });

  it("retries a server error once", async () => {
    const error = Object.assign(new Error("Service Unavailable"), {
      response: { status: 503 },
    });
    const queryFn = jest
      .fn()
      .mockRejectedValueOnce(error)
      .mockResolvedValue("recovered");

    const { result } = renderHook(
      () => useQuery({ queryKey: ["server-error"], queryFn }),
      { wrapper: AppProviders },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true), {
      timeout: 3000,
    });
    expect(queryFn).toHaveBeenCalledTimes(2);
  });
});
