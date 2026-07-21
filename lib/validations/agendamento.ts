import { z } from "zod";

const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
const horarioRegex = /^([01]\d|2[0-3]):[0-5]\d$/;

export const disponibilidadeQuerySchema = z.object({
  data: z.string().regex(dataRegex, "Data inválida"),
  servicoId: z.string().uuid("Serviço inválido"),
});

export const criarAgendamentoSchema = z.object({
  servicoId: z.string().uuid("Serviço inválido"),
  data: z.string().regex(dataRegex, "Data inválida"),
  horario: z.string().regex(horarioRegex, "Horário inválido"),
});

export const criarBloqueioSchema = z
  .object({
    data: z.string().regex(dataRegex, "Data inválida"),
    horarioInicio: z.string().regex(horarioRegex, "Horário inválido"),
    horarioFim: z.string().regex(horarioRegex, "Horário inválido"),
    motivo: z.string().max(200).optional(),
  })
  .refine((data) => data.horarioFim > data.horarioInicio, {
    message: "O horário de fim deve ser depois do horário de início.",
    path: ["horarioFim"],
  });

export const atualizarAgendamentoAdminSchema = z.object({
  status: z.enum(["confirmado", "cancelado", "concluido"]).optional(),
  data: z.string().regex(dataRegex).optional(),
  horario: z.string().regex(horarioRegex).optional(),
});
