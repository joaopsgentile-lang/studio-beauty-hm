import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { criarAgendamentoSchema } from "@/lib/validations/agendamento";
import { getHorariosDisponiveis, isSabado } from "@/lib/server/disponibilidade";

function somarMinutos(horario: string, minutos: number) {
  const [h, m] = horario.split(":").map(Number);
  const total = h * 60 + m + minutos;
  const hh = Math.floor(total / 60)
    .toString()
    .padStart(2, "0");
  const mm = (total % 60).toString().padStart(2, "0");
  return `${hh}:${mm}`;
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "É necessário estar autenticado." }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = criarAgendamentoSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { servicoId, data, horario } = parsed.data;

  if (!isSabado(data)) {
    return NextResponse.json(
      { error: "Atendimento apenas aos sábados." },
      { status: 400 }
    );
  }

  const { data: servico, error: servicoError } = await supabase
    .from("services")
    .select("id, nome, duracao_minutos, preco, ativo")
    .eq("id", servicoId)
    .single();

  if (servicoError || !servico || !servico.ativo) {
    return NextResponse.json({ error: "Serviço não encontrado." }, { status: 404 });
  }

  const disponiveis = await getHorariosDisponiveis(data);
  if (!disponiveis.includes(horario)) {
    return NextResponse.json(
      { error: "Esse horário não está mais disponível." },
      { status: 409 }
    );
  }

  const horaFim = somarMinutos(horario, servico.duracao_minutos);

  const { data: agendamento, error: insertError } = await supabase
    .from("appointments")
    .insert({
      cliente_id: user.id,
      service_id: servico.id,
      data,
      hora_inicio: horario,
      hora_fim: horaFim,
    })
    .select("id, data, hora_inicio, hora_fim, status")
    .single();

  if (insertError) {
    if (insertError.code === "23505") {
      return NextResponse.json(
        { error: "Esse horário acabou de ser reservado por outra pessoa." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Não foi possível agendar." }, { status: 500 });
  }

  return NextResponse.json({ agendamento, servico }, { status: 201 });
}
