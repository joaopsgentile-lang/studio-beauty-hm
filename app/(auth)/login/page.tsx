"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField } from "@/components/ui/FormField";
import { Button } from "@/components/ui/Button";
import { loginSchema, LoginInput } from "@/lib/validations/auth";
import { createClient } from "@/lib/supabase/client";
import { phoneToInternalEmail } from "@/lib/utils/phone";
import { maskPhone } from "@/lib/utils/phoneMask";

export default function LoginPage() {
  const router = useRouter();
  const [erroGeral, setErroGeral] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginInput) {
    setErroGeral(null);
    const supabase = createClient();

    const email = values.identificador.includes("@")
      ? values.identificador
      : phoneToInternalEmail(values.identificador);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: values.senha,
    });

    if (error) {
      setErroGeral("Telefone ou senha inválidos.");
      return;
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", data.user.id)
      .single();

    router.push(profile?.role === "admin" ? "/admin" : "/minha-conta");
    router.refresh();
  }

  return (
    <div>
      <h1 className="font-display text-3xl text-foreground">Entrar</h1>
      <p className="mt-2 text-sm text-foreground/60">
        Acesse sua conta para agendar e acompanhar seus horários.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
        <FormField
          label="Telefone"
          type="tel"
          placeholder="(19) 90000-0000"
          autoComplete="tel"
          error={errors.identificador?.message}
          {...register("identificador", {
            onChange: (e) => {
              const pareceTelefone = /^[\d\s()+-]*$/.test(e.target.value);
              if (pareceTelefone) {
                e.target.value = maskPhone(e.target.value);
              }
            },
          })}
        />
        <FormField
          label="Senha"
          type="password"
          autoComplete="current-password"
          error={errors.senha?.message}
          {...register("senha")}
        />

        {erroGeral && <p className="text-sm text-red-500">{erroGeral}</p>}

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
        >
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-foreground/60">
        Ainda não tem conta?{" "}
        <Link href="/cadastro" className="font-medium text-brand-500 underline underline-offset-4">
          Cadastre-se
        </Link>
      </p>
    </div>
  );
}
