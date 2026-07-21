import { SectionHeading } from "@/components/ui/SectionHeading";
import { AdminAppointmentsList, AdminAppointmentItem } from "@/components/admin/AdminAppointmentsList";
import { createClient } from "@/lib/supabase/server";

export default async function AdminAgendamentosPage() {
  const supabase = await createClient();

  const [{ data: agendamentos }, { data: profiles }, { data: services }] = await Promise.all([
    supabase
      .from("appointments")
      .select("id, cliente_id, service_id, data, hora_inicio, status")
      .order("data", { ascending: false })
      .order("hora_inicio", { ascending: false }),
    supabase.from("profiles").select("id, nome"),
    supabase.from("services").select("id, nome"),
  ]);

  const nomePorClienteId = new Map((profiles ?? []).map((p) => [p.id, p.nome]));
  const nomePorServicoId = new Map((services ?? []).map((s) => [s.id, s.nome]));

  const items: AdminAppointmentItem[] = (agendamentos ?? []).map((a) => ({
    id: a.id,
    clienteNome: nomePorClienteId.get(a.cliente_id) ?? "Cliente",
    servicoNome: nomePorServicoId.get(a.service_id) ?? "Serviço",
    data: a.data,
    horario: a.hora_inicio.slice(0, 5),
    status: a.status,
  }));

  return (
    <div>
      <SectionHeading
        eyebrow="Gestão"
        title="Agendamentos"
        description="Cancele agendamentos em nome da cliente quando necessário."
      />
      <AdminAppointmentsList agendamentos={items} />
    </div>
  );
}
