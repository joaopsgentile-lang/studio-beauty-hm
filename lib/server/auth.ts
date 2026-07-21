import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function requireAdmin() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      supabase,
      user: null,
      errorResponse: NextResponse.json(
        { error: "É necessário estar autenticado." },
        { status: 401 }
      ),
    };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return {
      supabase,
      user,
      errorResponse: NextResponse.json({ error: "Acesso restrito." }, { status: 403 }),
    };
  }

  return { supabase, user, errorResponse: null };
}
