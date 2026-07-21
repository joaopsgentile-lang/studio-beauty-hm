import { SectionHeading } from "@/components/ui/SectionHeading";
import { BUSINESS_HOURS, SLOT_DURATION_MINUTOS } from "@/lib/constants";
import { formatDateLabel, generateTimeSlots, getUpcomingSaturdays, toDateKey } from "@/lib/utils/dates";
import { createClient } from "@/lib/supabase/server";

const [proximoSabado] = getUpcomingSaturdays(1);
const dataKey = toDateKey(proximoSabado);
const slots = generateTimeSlots(
  BUSINESS_HOURS.abertura,
  BUSINESS_HOURS.fechamento,
  SLOT_DURATION_MINUTOS
);

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const [{ data: agendamentos }, { data: bloqueios }, { data: profiles }, { data: services }] =
    await Promise.all([
      supabase
        .from("appointments")
        .select("cliente_id, service_id, hora_inicio")
        .eq("data", dataKey)
        .eq("status", "confirmado"),
      supabase.from("blocked_slots").select("hora_inicio, hora_fim, motivo").eq("data", dataKey),
      supabase.from("profiles").select("id, nome"),
      supabase.from("services").select("id, nome"),
    ]);

  const nomePorClienteId = new Map((profiles ?? []).map((p) => [p.id, p.nome]));
  const nomePorServicoId = new Map((services ?? []).map((s) => [s.id, s.nome]));

  return (
    <div>
      <SectionHeading
        eyebrow="Agenda"
        title="Próximo sábado"
        description={`Visão geral de ${formatDateLabel(proximoSabado)}.`}
      />

      <div className="mt-8 divide-y divide-foreground/10 overflow-hidden rounded-2xl border border-foreground/10 bg-white">
        {slots.map((slot) => {
          const agendamento = (agendamentos ?? []).find(
            (a) => a.hora_inicio.slice(0, 5) === slot
          );
          const bloqueio = (bloqueios ?? []).find(
            (b) => b.hora_inicio.slice(0, 5) <= slot && slot < b.hora_fim.slice(0, 5)
          );

          return (
            <div key={slot} className="flex items-center justify-between px-6 py-4 text-sm">
              <span className="w-16 font-medium text-foreground">{slot}</span>
              {agendamento ? (
                <span className="flex-1 text-foreground/80">
                  {nomePorClienteId.get(agendamento.cliente_id) ?? "Cliente"} —{" "}
                  {nomePorServicoId.get(agendamento.service_id) ?? "Serviço"}
                </span>
              ) : bloqueio ? (
                <span className="flex-1 text-foreground/40">
                  Bloqueado {bloqueio.motivo && `(${bloqueio.motivo})`}
                </span>
              ) : (
                <span className="flex-1 text-emerald-600">Livre</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
