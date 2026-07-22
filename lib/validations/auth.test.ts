import { describe, expect, it } from "vitest";
import { cadastroSchema, loginSchema } from "./auth";

describe("loginSchema", () => {
  it("rejeita identificador vazio", () => {
    expect(loginSchema.safeParse({ identificador: "", senha: "123456" }).success).toBe(
      false
    );
  });

  it("aceita telefone e senha válidos", () => {
    expect(
      loginSchema.safeParse({ identificador: "19999998888", senha: "123456" }).success
    ).toBe(true);
  });
});

describe("cadastroSchema", () => {
  const base = {
    nome: "Maria Cliente",
    telefone: "19999998888",
    senha: "123456",
  };

  it("rejeita telefone com poucos dígitos", () => {
    const result = cadastroSchema.safeParse({
      ...base,
      telefone: "123",
      confirmarSenha: "123456",
    });
    expect(result.success).toBe(false);
  });

  it("aceita telefone formatado com parênteses e traço", () => {
    const result = cadastroSchema.safeParse({
      ...base,
      telefone: "(19) 99999-8888",
      confirmarSenha: "123456",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita quando a confirmação de senha não coincide", () => {
    const result = cadastroSchema.safeParse({ ...base, confirmarSenha: "outra123" });
    expect(result.success).toBe(false);
  });

  it("rejeita senha com menos de 6 caracteres", () => {
    const result = cadastroSchema.safeParse({
      ...base,
      senha: "123",
      confirmarSenha: "123",
    });
    expect(result.success).toBe(false);
  });

  it("aceita dados válidos com senhas coincidentes", () => {
    const result = cadastroSchema.safeParse({ ...base, confirmarSenha: "123456" });
    expect(result.success).toBe(true);
  });
});
