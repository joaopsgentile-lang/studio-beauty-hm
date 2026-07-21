import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
  senha: z.string().min(1, "Informe sua senha"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const cadastroSchema = z
  .object({
    nome: z.string().min(2, "Informe seu nome completo"),
    telefone: z
      .string()
      .min(10, "Informe um telefone válido com DDD")
      .max(15, "Informe um telefone válido com DDD"),
    email: z.string().min(1, "Informe seu e-mail").email("E-mail inválido"),
    senha: z.string().min(6, "A senha deve ter ao menos 6 caracteres"),
    confirmarSenha: z.string().min(1, "Confirme sua senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

export type CadastroInput = z.infer<typeof cadastroSchema>;
