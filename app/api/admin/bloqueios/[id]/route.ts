import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/server/auth";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { supabase, errorResponse } = await requireAdmin();
  if (errorResponse) return errorResponse;

  const { error } = await supabase.from("blocked_slots").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: "Não foi possível remover o bloqueio." }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
