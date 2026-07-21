import Link from "next/link";
import type { Database } from "@/types/database.types";
import { formatCurrency, formatDuration } from "@/lib/utils/format";

type Service = Pick<
  Database["public"]["Tables"]["services"]["Row"],
  "slug" | "nome" | "descricao" | "duracao_minutos" | "preco"
>;

export function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex flex-col justify-between rounded-2xl border border-foreground/10 bg-white/60 p-6 transition-shadow hover:shadow-lg hover:shadow-brand-100">
      <div>
        <h3 className="font-display text-2xl font-medium text-foreground">
          {service.nome}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-foreground/70">
          {service.descricao}
        </p>
        <p className="mt-3 text-xs uppercase tracking-wide text-foreground/50">
          Duração aproximada: {formatDuration(service.duracao_minutos)}
        </p>
      </div>
      <div className="mt-6 flex items-center justify-between">
        <span className="font-display text-2xl text-brand-600">
          {formatCurrency(Number(service.preco))}
        </span>
        <Link
          href={`/agendar?servico=${service.slug}`}
          className="text-sm font-medium tracking-wide text-brand-500 underline-offset-4 hover:underline"
        >
          Agendar →
        </Link>
      </div>
    </div>
  );
}
