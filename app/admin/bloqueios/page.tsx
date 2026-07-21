import { BloqueiosManager, BloqueioItem } from "@/components/admin/BloqueiosManager";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBloqueiosPage() {
  const supabase = await createClient();

  const { data: bloqueios } = await supabase
    .from("blocked_slots")
    .select("id, data, hora_inicio, hora_fim, motivo")
    .order("data")
    .order("hora_inicio");

  const items: BloqueioItem[] = (bloqueios ?? []).map((b) => ({
    id: b.id,
    data: b.data,
    horarioInicio: b.hora_inicio.slice(0, 5),
    horarioFim: b.hora_fim.slice(0, 5),
    motivo: b.motivo,
  }));

  return <BloqueiosManager bloqueiosIniciais={items} />;
}
