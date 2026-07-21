import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "É necessário estar autenticado." }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("appointments")
    .update({ status: "cancelado" })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    if (error.message.includes("12 horas")) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Agendamento não encontrado ou já cancelado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ agendamento: data });
}
