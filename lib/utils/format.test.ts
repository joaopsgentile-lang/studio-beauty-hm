import { describe, expect, it } from "vitest";
import { formatCurrency, formatDuration } from "./format";

describe("formatCurrency", () => {
  it("formata valores em Real brasileiro", () => {
    expect(formatCurrency(25)).toContain("25,00");
    expect(formatCurrency(25)).toContain("R$");
    expect(formatCurrency(480)).toContain("480,00");
  });
});

describe("formatDuration", () => {
  it("mostra apenas minutos quando menor que 1h", () => {
    expect(formatDuration(40)).toBe("40min");
  });

  it("mostra horas cheias sem sobra de minutos", () => {
    expect(formatDuration(60)).toBe("1h");
  });

  it("mostra horas e minutos combinados", () => {
    expect(formatDuration(90)).toBe("1h30min");
  });
});
