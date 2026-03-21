import { describe, it, expect } from "vitest";
import { getTeamMeta } from "@/constants/teams";

describe("getTeamMeta", () => {
  it("devuelve la metadata correcta para equipos conocidos", () => {
    const meta = getTeamMeta("ferrari");
    expect(meta.name).toBe("Scuderia Ferrari");
    expect(meta.primaryColor).toBe("#E8002D");
  });

  it("devuelve metadata precisa para Sauber tras corrección de dominio histórico", () => {
    const meta = getTeamMeta("sauber");
    expect(meta.name).toBe("Kick Sauber");
    expect(meta.shortName).toBe("Sauber");
    expect(meta.primaryColor).toBe("#00E701");
  });

  it("genera un fallback capitalizado y gris para IDs desconocidos", () => {
    const meta = getTeamMeta("minardi");
    expect(meta.name).toBe("Minardi");
    expect(meta.shortName).toBe("Minardi");
    expect(meta.primaryColor).toBe("#a1a1aa");
  });
});
