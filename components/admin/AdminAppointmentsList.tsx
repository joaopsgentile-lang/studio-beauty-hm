"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { formatDateLabel, parseDateKey } from "@/lib/utils/dates";
import type { AppointmentStatus } from "@/types/database.types";

export type AdminAppointmentItem = {
  id: string;
  clienteNome: string;
  servicoNome: string;
  data: string;
  horario: string;
  status: AppointmentStatus;
};

const statusLabel: Record<AppointmentStatus, string> = {
  confirmado: "Confirmado",
  cancelado: "Cancelado",
  concluido: "Concluído",
};

const statusClasses: Record<AppointmentStatus, string> = {
  confirmado: "bg-brand-100 text-brand-700",
  cancelado: "bg-foreground/10 text-foreground/50",
  concluido: "bg-emerald-100 text-emerald-700",
};

export function AdminAppointmentsList({
  agendamentos,
}: {
  agendamentos: AdminAppointmentItem[];
}) {
  const [items, setItems] = useState(agendamentos);
  const [cancelandoId, setCancelandoId] = useState<string | null>(null);
  const [erro, setErro] = useState<string | null>(null);

  async function cancelar(id: string) {
    setCancelandoId(id);
    setErro(null);

    try {
      const res = await fetch(`/api/admin/agendamentos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "cancelado" }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErro(json.error ?? "Não foi possível cancelar.");
        return;
      }

      setItems((atual) =>
        atual.map((a) => (a.id === id ? { ...a, status: "cancelado" } : a))
      );
    } catch {
      setErro("Não foi possível cancelar. Tente novamente.");
    } finally {
      setCancelandoId(null);
    }
  }

  return (
    <div className="mt-8 space-y-4">
      {erro && <p className="text-sm text-red-500">{erro}</p>}

      {items.map((agendamento) => (
        <div
          key={agendamento.id}
          className="flex flex-col justify-between gap-4 rounded-2xl border border-foreground/10 bg-white p-6 sm:flex-row sm:items-center"
        >
          <div>
            <p className="font-medium text-foreground">{agendamento.clienteNome}</p>
            <p className="mt-1 text-sm text-foreground/60">{agendamento.servicoNome}</p>
            <p className="mt-1 text-sm text-foreground/60">
              {formatDateLabel(parseDateKey(agendamento.data))} às {agendamento.horario}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${statusClasses[agendamento.status]}`}
            >
              {statusLabel[agendamento.status]}
            </span>
            {agendamento.status === "confirmado" && (
              <Button
                type="button"
                variant="outline"
                disabled={cancelandoId === agendamento.id}
                onClick={() => cancelar(agendamento.id)}
              >
                {cancelandoId === agendamento.id ? "Cancelando..." : "Cancelar"}
              </Button>
            )}
          </div>
        </div>
      ))}

      {items.length === 0 && (
        <p className="text-sm text-foreground/60">Nenhum agendamento neste período.</p>
      )}
    </div>
  );
}
