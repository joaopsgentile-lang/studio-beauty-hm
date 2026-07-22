"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { cadastroSchema, CadastroInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { phoneToInternalEmail } from "@/lib/utils/phone";

export default function CadastroPage() {
  const router = useRouter();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const [aguardandoConfirmacao, setAguardandoConfirmacao] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CadastroInput>({ resolver: zodResolver(cadastroSchema) });

  async function onSubmit(values: CadastroInput) {
    setErroGeral(null);
    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email: phoneToInternalEmail(values.telefone),
      password: values.senha,
      options: {
        data: { nome: values.nome, telefone: values.telefone },
      },
    });

    if (error) {
      setErroGeral(
        error.message === "User already registered"
          ? "Já existe uma conta com esse telefone."
          : "Não foi possível criar sua conta. Tente novamente."
      );
      return;
    }

    if (data.session) {
      router.push("/minha-conta");
      router.refresh();
    } else {
      setAguardandoConfirmacao(true);
    }
  }

  if (aguardandoConfirmacao) {
    return (
      <div className="text-center">
        <h1 className="font-display text-3xl text-foreground">Conta criada</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
          Sua conta foi criada. Entre com seu telefone e senha para continuar.
        </p>
        <Button href="/login" className="mt-6">
          Ir para o login
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Criar conta</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Cadastre-se para agendar seus horários no {"StudioBeautyHM"}.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormField
          label="Nome completo"
          autoComplete="name"
          error={errors.nome?.message}
          {...register("nome")}
        />
        <FormField
          label="Telefone (WhatsApp)"
          type="tel"
          placeholder="(19) 90000-0000"
          autoComplete="tel"
          error={errors.telefone?.message}
          {...register("telefone")}
        />
        <FormField
          label="Senha"
          type="password"
          autoComplete="new-password"
          error={errors.senha?.message}
          {...register("senha")}
        />
        <FormField
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          error={errors.confirmarSenha?.message}
          {...register("confirmarSenha")}
        />

        {erroGeral && <p className="text-sm text-red-500">{erroGeral}</p>}

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Já tem conta?{" "}
        <Link href="/login" className="font-medium text-brand-500 underline underline-offset-4">
          Entrar
        </Link>
      </p>
    </div>
  );
}
