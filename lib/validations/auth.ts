import { z } from "zod";
import { normalizePhoneDigits } from "@/lib/utils/phone";

export const loginSchema = z.object({
  identificador: z.string().min(1, "Informe seu telefone"),
  senha: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

const telefoneSchema = z
  .string()
  .min(1, "Informe seu telefone")
  .refine((v) => normalizePhoneDigits(v).length >= 10 && normalizePhoneDigits(v).length <= 11, {
    message: "Informe um telefone válido com DDD",
  });

export const cadastroSchema = z
  .object({
    nome: z.string().min(2, "Informe seu nome completo"),
    telefone: telefoneSchema,
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type CadastroInput = z.infer<typeof cadastroSchema>;
