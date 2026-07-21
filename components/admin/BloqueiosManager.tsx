"use client";

import { useState } from "react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BUSINESS_HOURS, SLOT_DURATION_MINUTOS } from "@/lib/constants";
import {
  formatDateLabel,
  generateTimeSlots,
  getUpcomingSaturdays,
  parseDateKey,
  toDateKey,
} from "@/lib/utils/dates";

export type BloqueioItem = {
  id: string;
  data: string;
  horarioInicio: string;
  horarioFim: string;
  motivo: string | null;
};

const saturdays = getUpcomingSaturdays(8);
const slots = generateTimeSlots(
  BUSINESS_HOURS.abertura,
  BUSINESS_HOURS.fechamento,
  SLOT_DURATION_MINUTOS
);
// Limites válidos de horário: início dos slots + o horário de fechamento,
// para permitir bloquear até o fim do expediente.
const boundaries = [...slots, BUSINESS_HOURS.fechamento];
const inicioOptions = boundaries.slice(0, -1);
const fimOptions = boundaries.slice(1);

export function BloqueiosManager({ bloqueiosIniciais }: { bloqueiosIniciais: BloqueioItem[] }) {
  const [bloqueios, setBloqueios] = useState(bloqueiosIniciais);
  const [dataSelecionada, setDataSelecionada] = useState(toDateKey(saturdays[0]));
  const [horarioInicio, setHorarioInicio] = useState(inicioOptions[0]);
  const [horarioFim, setHorarioFim] = useState(fimOptions[0]);
  const [motivo, setMotivo] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function adicionarBloqueio() {
    setEnviando(true);
    setErro(null);

    try {
      const res = await fetch("/api/admin/bloqueios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          data: dataSelecionada,
          horarioInicio,
          horarioFim,
          motivo: motivo || undefined,
        }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErro(json.error ?? "Não foi possível criar o bloqueio.");
        return;
      }

      setBloqueios((atual) => [
        ...atual,
        {
          id: json.bloqueio.id,
          data: json.bloqueio.data,
          horarioInicio: json.bloqueio.hora_inicio.slice(0, 5),
          horarioFim: json.bloqueio.hora_fim.slice(0, 5),
          motivo: json.bloqueio.motivo,
        },
      ]);
      setMotivo("");
    } catch {
      setErro("Não foi possível criar o bloqueio.");
    } finally {
      setEnviando(false);
    }
  }

  async function removerBloqueio(id: string) {
    setErro(null);
    try {
      const res = await fetch(`/api/admin/bloqueios/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const json = await res.json();
        setErro(json.error ?? "Não foi possível remover o bloqueio.");
        return;
      }
      setBloqueios((atual) => atual.filter((b) => b.id !== id));
    } catch {
      setErro("Não foi possível remover o bloqueio.");
    }
  }

  return (
    <div>
      <SectionHeading
        eyebrow="Agenda"
        title="Bloqueios de horário"
        description="Bloqueie dias ou horários em que não haverá atendimento."
      />

      <div className="mt-8 grid gap-4 rounded-2xl border border-foreground/10 bg-white p-6 sm:grid-cols-4">
        <div>
          <label className="text-sm font-medium text-foreground">Data</label>
          <select
            value={dataSelecionada}
            onChange={(e) => setDataSelecionada(e.target.value)}
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2.5 text-sm"
          >
            {saturdays.map((s) => (
              <option key={toDateKey(s)} value={toDateKey(s)}>
                {formatDateLabel(s)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Início</label>
          <select
            value={horarioInicio}
            onChange={(e) => {
              const novoInicio = e.target.value;
              setHorarioInicio(novoInicio);
              if (horarioFim <= novoInicio) {
                const proximo = fimOptions.find((s) => s > novoInicio);
                if (proximo) setHorarioFim(proximo);
              }
            }}
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2.5 text-sm"
          >
            {inicioOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Fim</label>
          <select
            value={horarioFim}
            onChange={(e) => setHorarioFim(e.target.value)}
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2.5 text-sm"
          >
            {fimOptions
              .filter((s) => s > horarioInicio)
              .map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-foreground">Motivo</label>
          <input
            value={motivo}
            onChange={(e) => setMotivo(e.target.value)}
            placeholder="Opcional"
            className="mt-2 w-full rounded-xl border border-foreground/15 bg-white px-3 py-2.5 text-sm"
          />
        </div>

        <div className="sm:col-span-4">
          <Button type="button" onClick={adicionarBloqueio} disabled={enviando}>
            {enviando ? "Adicionando..." : "Adicionar bloqueio"}
          </Button>
        </div>
      </div>

      {erro && <p className="mt-4 text-sm text-red-500">{erro}</p>}

      <div className="mt-8 space-y-3">
        {bloqueios.map((bloqueio) => (
          <div
            key={bloqueio.id}
            className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-white p-5"
          >
            <div className="text-sm">
              <p className="font-medium text-foreground">
                {formatDateLabel(parseDateKey(bloqueio.data))}
              </p>
              <p className="mt-1 text-foreground/60">
                {bloqueio.horarioInicio} às {bloqueio.horarioFim}
                {bloqueio.motivo && ` — ${bloqueio.motivo}`}
              </p>
            </div>
            <Button type="button" variant="ghost" onClick={() => removerBloqueio(bloqueio.id)}>
              Remover
            </Button>
          </div>
        ))}

        {bloqueios.length === 0 && (
          <p className="text-sm text-foreground/60">Nenhum bloqueio cadastrado.</p>
        )}
      </div>
    </div>
  );
}
