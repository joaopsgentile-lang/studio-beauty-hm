import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { atualizarAgendamentoAdminSchema } from "@/lib/validations/agendamento";
import { getHorariosDisponiveis, isSabado } from "@/lib/server/disponibilidade";
import type { Database } from "@/types/database.types";

type AppointmentUpdate = Database["public"]["Tables"]["appointments"]["Update"];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await request.json().catch(() => null);
  const parsed = atualizarAgendamentoAdminSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { status, data, horario } = parsed.data;

  const { data: atual, error: fetchError } = await supabase
    .from("appointments")
    .select("id, service_id, services(duracao_minutos)")
    .eq("id", id)
    .single();

  if (fetchError || !atual) {
    return NextResponse.json({ error: "Agendamento não encontrado." }, { status: 404 });
  }

  const duracao =
    (atual as unknown as { services: { duracao_minutos: number } | null }).services
      ?.duracao_minutos ?? 40;

  const update: AppointmentUpdate = {};
  if (status) update.status = status;

  if (data && horario) {
    if (!isSabado(data)) {
      return NextResponse.json(
        { error: "Atendimento apenas aos sábados." },
        { status: 400 }
      );
    }

    const disponiveis = await getHorariosDisponiveis(data, duracao);
    if (!disponiveis.includes(horario)) {
      return NextResponse.json(
        { error: "Esse horário não está disponível." },
        { status: 409 }
      );
    }

    const [h, m] = horario.split(":").map(Number);
    const total = h * 60 + m + duracao;
    const hh = Math.floor(total / 60).toString().padStart(2, "0");
    const mm = (total % 60).toString().padStart(2, "0");

    update.data = data;
    update.hora_inicio = horario;
    update.hora_fim = `${hh}:${mm}`;
  }

  const { data: agendamento, error } = await supabase
    .from("appointments")
    .update(update)
    .eq("id", id)
    .select("id, data, hora_inicio, hora_fim, status")
    .single();

  if (error) {
    if (error.code === "23505" || error.code === "23P01") {
      return NextResponse.json(
        { error: "Esse horário conflita com outro agendamento." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Não foi possível atualizar o agendamento." }, { status: 500 });
  }

  return NextResponse.json({ agendamento });
}
