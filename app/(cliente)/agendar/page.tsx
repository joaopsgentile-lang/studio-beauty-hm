import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { AgendamentoFlow } from "@/components/agendamento/AgendamentoFlow";
import { createClient } from "@/lib/supabase/server";

export default async function AgendarPage() {
  const supabase = await createClient();

  const [{ data: services }, { data: auth }] = await Promise.all([
    supabase
      .from("services")
      .select("id, slug, nome, descricao, duracao_minutos, preco")
      .eq("ativo", true)
      .order("ordem"),
    supabase.auth.getUser(),
  ]);

  let nomeCliente = "";
  if (auth.user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("nome")
      .eq("id", auth.user.id)
      .single();
    nomeCliente = profile?.nome ?? "";
  }

  return (
    <section className="py-16">
      <Container className="max-w-2xl">
        <Suspense fallback={null}>
          <AgendamentoFlow services={services ?? []} nomeCliente={nomeCliente} />
        </Suspense>
      </Container>
    </section>
  );
}
