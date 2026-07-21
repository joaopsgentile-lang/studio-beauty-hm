import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { disponibilidadeQuerySchema } from "@/lib/validations/agendamento";
import { getHorariosDisponiveis, isSabado } from "@/lib/server/disponibilidade";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = disponibilidadeQuerySchema.safeParse({
    data: searchParams.get("data"),
    servicoId: searchParams.get("servicoId"),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Parâmetros inválidos" },
      { status: 400 }
    );
  }

  const { data, servicoId } = parsed.data;

  if (!isSabado(data)) {
    return NextResponse.json({ horarios: [] });
  }

  const supabase = createAdminClient();
  const { data: servico, error: servicoError } = await supabase
    .from("services")
    .select("ativo")
    .eq("id", servicoId)
    .single();

  if (servicoError || !servico || !servico.ativo) {
    return NextResponse.json({ error: "Serviço não encontrado" }, { status: 404 });
  }

  const horarios = await getHorariosDisponiveis(data);
  return NextResponse.json({ horarios });
}
