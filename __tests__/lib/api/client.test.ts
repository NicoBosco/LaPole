import { describe, it, expect, vi, beforeEach } from "vitest";
import { apiFetch } from "@/lib/api/client";
import { z } from "zod";

const mockSchema = z.object({
  MRData: z.object({
    total: z.string(),
  }),
});

describe("apiFetch", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("construye la URL correctamente y devuelve datos parseados", async () => {
    const mockResponse = { MRData: { total: "1" } };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await apiFetch("/fictional", {}, mockSchema);
    expect(result.MRData.total).toBe("1");
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("fictional.json"),
      expect.any(Object),
    );
  });

  it("tira error si la respuesta de red no es ok", async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      text: async () => "Internal Server Error",
    });

    await expect(apiFetch("/fictional")).rejects.toThrow("API error 500");
  });

  it("tira error si la validación Zod falla", async () => {
    const invalidMockResponse = { MRData: { total: 123 } }; // Expected string, got number

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => invalidMockResponse,
    });

    await expect(apiFetch("/fictional", {}, mockSchema)).rejects.toThrow(
      "Data validation failed for API response",
    );
  });
});
