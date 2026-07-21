import { describe, expect, it } from "vitest";
import {
  criarAgendamentoSchema,
  criarBloqueioSchema,
  disponibilidadeQuerySchema,
} from "./agendamento";

const uuid = "b1ace7f8-f10f-40cf-8d31-1342e5adebb0";

describe("criarBloqueioSchema", () => {
  it("rejeita quando o horário de fim não é depois do início", () => {
    const result = criarBloqueioSchema.safeParse({
      data: "2026-07-25",
      horarioInicio: "15:00",
      horarioFim: "07:40",
    });
    expect(result.success).toBe(false);
  });

  it("rejeita quando início e fim são iguais", () => {
    const result = criarBloqueioSchema.safeParse({
      data: "2026-07-25",
      horarioInicio: "10:00",
      horarioFim: "10:00",
    });
    expect(result.success).toBe(false);
  });

  it("aceita um intervalo válido", () => {
    const result = criarBloqueioSchema.safeParse({
      data: "2026-07-25",
      horarioInicio: "15:00",
      horarioFim: "16:00",
    });
    expect(result.success).toBe(true);
  });
});

describe("criarAgendamentoSchema", () => {
  it("exige um uuid válido para o serviço", () => {
    const result = criarAgendamentoSchema.safeParse({
      servicoId: "nao-e-um-uuid",
      data: "2026-07-25",
      horario: "09:00",
    });
    expect(result.success).toBe(false);
  });

  it("aceita dados válidos", () => {
    const result = criarAgendamentoSchema.safeParse({
      servicoId: uuid,
      data: "2026-07-25",
      horario: "09:00",
    });
    expect(result.success).toBe(true);
  });
});

describe("disponibilidadeQuerySchema", () => {
  it("rejeita data em formato inválido", () => {
    const result = disponibilidadeQuerySchema.safeParse({
      data: "25/07/2026",
      servicoId: uuid,
    });
    expect(result.success).toBe(false);
  });
});
