import { createAdminClient } from "@/lib/supabase/admin";
import { BUSINESS_HOURS, AGENDA_STEP_MINUTOS } from "@/lib/constants";
import { generateCandidateStarts, intervalosSeSobrepoe, timeToMinutes } from "@/lib/utils/dates";

export function isSabado(dataIso: string) {
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  return new Date(ano, mes - 1, dia).getDay() === 6;
}

// Considera a duração real do serviço: um horário só é oferecido se o
// intervalo inteiro [início, início+duração) não colidir com nenhum
// agendamento confirmado nem bloqueio manual da profissional.
export async function getHorariosDisponiveis(data: string, duracaoMinutos: number) {
  const supabase = createAdminClient();

  const [{ data: agendamentos }, { data: bloqueios }] = await Promise.all([
    supabase
      .from("appointments")
      .select("hora_inicio, hora_fim")
      .eq("data", data)
      .neq("status", "cancelado"),
    supabase.from("blocked_slots").select("hora_inicio, hora_fim").eq("data", data),
  ]);

  const ocupados = [...(agendamentos ?? []), ...(bloqueios ?? [])].map((o) => ({
    inicio: timeToMinutes(o.hora_inicio.slice(0, 5)),
    fim: timeToMinutes(o.hora_fim.slice(0, 5)),
  }));

  const candidatos = generateCandidateStarts(
    BUSINESS_HOURS.abertura,
    BUSINESS_HOURS.fechamento,
    AGENDA_STEP_MINUTOS,
    duracaoMinutos
  );

  return candidatos.filter((horario) => {
    const inicio = timeToMinutes(horario);
    const fim = inicio + duracaoMinutos;
    return !ocupados.some((o) => intervalosSeSobrepoe(inicio, fim, o.inicio, o.fim));
  });
}
