import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";
import { criarBloqueioSchema } from "@/lib/validations/agendamento";

export async function POST(request: NextRequest) {
  const { supabase, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const body = await request.json().catch(() => null);
  const parsed = criarBloqueioSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos" },
      { status: 400 }
    );
  }

  const { data, horarioInicio, horarioFim, motivo } = parsed.data;

  const { data: bloqueio, error } = await supabase
    .from("blocked_slots")
    .insert({
      data,
      hora_inicio: horarioInicio,
      hora_fim: horarioFim,
      motivo: motivo || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: "Não foi possível criar o bloqueio." }, { status: 500 });
  }

  return NextResponse.json({ bloqueio }, { status: 201 });
}
