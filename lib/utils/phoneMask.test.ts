import { describe, expect, it } from "vitest";
import { maskPhone } from "./phoneMask";

describe("maskPhone", () => {
  it("formata progressivamente enquanto digita", () => {
    expect(maskPhone("1")).toBe("(1");
    expect(maskPhone("19")).toBe("(19");
    expect(maskPhone("199")).toBe("(19) 9");
    expect(maskPhone("199999")).toBe("(19) 9999");
  });

  it("formata celular completo (11 dígitos) com traço antes dos últimos 4", () => {
    expect(maskPhone("19981518165")).toBe("(19) 98151-8165");
  });

  it("formata fixo (10 dígitos)", () => {
    expect(maskPhone("1933334444")).toBe("(19) 3333-4444");
  });

  it("ignora caracteres não numéricos e limita a 11 dígitos", () => {
    expect(maskPhone("(19) 98151-8165extra999")).toBe("(19) 98151-8165");
  });

  it("string vazia retorna vazio", () => {
    expect(maskPhone("")).toBe("");
  });
});
