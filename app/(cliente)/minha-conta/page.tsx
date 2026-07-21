import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { AppointmentsList, AppointmentItem } from "@/components/conta/AppointmentsList";
import { createClient } from "@/lib/supabase/server";

export default async function MinhaContaPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: agendamentos }, { data: services }] = await Promise.all([
    supabase.from("profiles").select("nome").eq("id", user!.id).single(),
    supabase
      .from("appointments")
      .select("id, service_id, data, hora_inicio, status")
      .eq("cliente_id", user!.id)
      .order("data", { ascending: false })
      .order("hora_inicio", { ascending: false }),
    supabase.from("services").select("id, nome"),
  ]);

  const nomeServicoPorId = new Map((services ?? []).map((s) => [s.id, s.nome]));

  const items: AppointmentItem[] = (agendamentos ?? []).map((a) => ({
    id: a.id,
    servicoNome: nomeServicoPorId.get(a.service_id) ?? "Serviço",
    data: a.data,
    horario: a.hora_inicio.slice(0, 5),
    status: a.status,
  }));

  const primeiroNome = profile?.nome?.split(" ")[0] ?? "";

  return (
    <section className="py-16">
      <Container>
        <SectionHeading
          eyebrow="Minha conta"
          title={primeiroNome ? `Olá, ${primeiroNome}` : "Minha conta"}
          description="Acompanhe seus agendamentos no StudioBeautyHM."
        />

        <AppointmentsList agendamentos={items} />

        <div className="mt-10">
          <Button href="/agendar">Novo agendamento</Button>
        </div>
      </Container>
    </section>
  );
}
