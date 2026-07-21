import { describe, expect, it } from "vitest";
import { cadastroSchema, loginSchema } from "./auth";

describe("loginSchema", () => {
  it("rejeita e-mail inválido", () => {
    expect(loginSchema.safeParse({ email: "nao-e-email", senha: "123456" }).success).toBe(
      false
    );
  });

  it("aceita e-mail e senha válidos", () => {
    expect(
      loginSchema.safeParse({ email: "cliente@exemplo.com", senha: "123456" }).success
    ).toBe(true);
  });
});

describe("cadastroSchema", () => {
  const base = {
    nome: "Maria Cliente",
    telefone: "19999998888",
    email: "cliente@exemplo.com",
    senha: "123456",
  };

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
