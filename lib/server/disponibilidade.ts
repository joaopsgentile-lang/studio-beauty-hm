import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_HOURS, SLOT_DURATION_MINUTOS } from "@/lib/constants";
import { generateTimeSlots } from "@/lib/utils/dates";

export function isSabado(dataIso: string) {
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).getDay() === 6;
}

export async function getHorariosDisponiveis(data: string) {
  const supabase = createAdminClient();

  const [{ data: agendamentos }, { data: bloqueios }] = await Promise.all([
    supabase
      .from("appointments")
      .select("hora_inicio")
      .eq("data", data)
      .neq("status", "cancelado"),
    supabase.from("blocked_slots").select("hora_inicio, hora_fim").eq("data", data),
  ]);

  const ocupados = new Set((agendamentos ?? []).map((a) => a.hora_inicio.slice(0, 5)));
  const bloqueiosList = bloqueios ?? [];

  const todosOsSlots = generateTimeSlots(
    BUSINESS_HOURS.abertura,
    BUSINESS_HOURS.fechamento,
    SLOT_DURATION_MINUTOS
  );

  return todosOsSlots.filter((slot) => {
    if (ocupados.has(slot)) return false;
    const bloqueado = bloqueiosList.some(
      (b) => b.hora_inicio.slice(0, 5) <= slot && slot < b.hora_fim.slice(0, 5)
    );
    return !bloqueado;
  });
}
