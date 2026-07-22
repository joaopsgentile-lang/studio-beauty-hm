"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import clsx from "clsx";
import { Button } from "@/components/ui/Button";
import { BUSINESS_HOURS, POLICIES } from "@/lib/constants";
import { formatDateLabel, getUpcomingSaturdays, toDateKey } from "@/lib/utils/dates";
import { buildAgendamentoMensagem, buildWhatsappLink } from "@/lib/utils/whatsapp";
import { formatCurrency } from "@/lib/utils/format";

export type ServicoDb = {
  id: string;
  slug: string;
  nome: string;
  descricao: string | null;
  duracao_minutos: number;
  preco: number;
};

const steps = ["Serviço", "Data", "Horário", "Confirmação"];
const upcomingSaturdays = getUpcomingSaturdays(8);

export function AgendamentoFlow({
  services,
  nomeCliente,
}: {
  services: ServicoDb[];
  nomeCliente: string;
}) {
  const searchParams = useSearchParams();
  const servicoInicialSlug = searchParams.get("servico");
  const servicoInicial = services.find((s) => s.slug === servicoInicialSlug);

  const [step, setStep] = useState(servicoInicial ? 2 : 1);
  const [servicoId, setServicoId] = useState(servicoInicial?.id ?? "");
  const [data, setData] = useState<Date | null>(null);
  const [horario, setHorario] = useState<string | null>(null);
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
  const [carregandoHorarios, setCarregandoHorarios] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmado, setConfirmado] = useState(false);

  const servico = services.find((s) => s.id === servicoId);

  useEffect(() => {
    if (!servicoId || !data) return;

    let cancelado = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for the fetch started right below
    setCarregandoHorarios(true);
    setErro(null);

    fetch(`/api/disponibilidade?data=${toDateKey(data)}&servicoId=${servicoId}`)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelado) setHorariosDisponiveis(json.horarios ?? []);
      })
      .catch(() => {
        if (!cancelado) setErro("Não foi possível carregar os horários disponíveis.");
      })
      .finally(() => {
        if (!cancelado) setCarregandoHorarios(false);
      });

    return () => {
      cancelado = true;
    };
  }, [servicoId, data]);

  function podeAvancar() {
    if (step === 1) return !!servico;
    if (step === 2) return !!data;
    if (step === 3) return !!horario;
    return true;
  }

  function proximo() {
    if (!podeAvancar()) return;
    setStep((s) => Math.min(s + 1, steps.length));
  }

  function voltar() {
    setErro(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function confirmar() {
    if (!servico || !data || !horario) return;
    setEnviando(true);
    setErro(null);

    try {
      const res = await fetch("/api/agendamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ servicoId: servico.id, data: toDateKey(data), horario }),
      });
      const json = await res.json();

      if (!res.ok) {
        setErro(json.error ?? "Não foi possível agendar.");
        if (res.status === 409) setStep(3);
        return;
      }

      setConfirmado(true);
      const link = buildWhatsappLink(
        buildAgendamentoMensagem({
          nome: nomeCliente || "cliente",
          servico: servico.nome,
          dataLabel: formatDateLabel(data),
          horario,
        })
      );
      window.open(link, "_blank");
    } catch {
      setErro("Não foi possível agendar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  if (confirmado && servico && data && horario) {
    const link = buildWhatsappLink(
      buildAgendamentoMensagem({
        nome: nomeCliente || "cliente",
        servico: servico.nome,
        dataLabel: formatDateLabel(data),
        horario,
      })
    );

    return (
      <div className="rounded-2xl border border-foreground/10 bg-white p-10 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-brand-500">
          Agendamento realizado
        </p>
        <h1 className="font-display mt-3 text-3xl text-foreground">
          Tudo certo{nomeCliente ? `, ${nomeCliente.split(" ")[0]}` : ""}!
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground/70">
          {servico.nome} agendado para{" "}
          <strong className="text-foreground">{formatDateLabel(data)}</strong> às{" "}
          <strong className="text-foreground">{horario}</strong>. Abrimos o WhatsApp
          em outra aba para você confirmar — se não abriu, use o botão abaixo.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Button href={link}>Abrir WhatsApp</Button>
          <Button href="/minha-conta" variant="ghost">
            Ver meus agendamentos
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-foreground/10 bg-white p-8 sm:p-10">
      <ol className="mb-10 flex items-center justify-between gap-2">
        {steps.map((label, index) => {
          const current = index + 1 === step;
          const done = index + 1 < step;
          return (
            <li key={label} className="flex flex-1 items-center gap-2">
              <span
                className={clsx(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  current && "bg-brand-500 text-white",
                  done && "bg-brand-100 text-brand-600",
                  !current && !done && "bg-foreground/5 text-foreground/40"
                )}
              >
                {index + 1}
              </span>
              <span
                className={clsx(
                  "hidden text-xs font-medium tracking-wide sm:block",
                  current ? "text-foreground" : "text-foreground/50"
                )}
              >
                {label}
              </span>
              {index < steps.length - 1 && (
                <span className="h-px flex-1 bg-foreground/10" />
              )}
            </li>
          );
        })}
      </ol>

      {step === 1 && (
        <div>
          <h2 className="font-display text-2xl text-foreground">
            Escolha o serviço
          </h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {services.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setServicoId(s.id);
                  setHorario(null);
                  setHorariosDisponiveis([]);
                }}
                className={clsx(
                  "rounded-xl border p-4 text-left transition-colors",
                  servicoId === s.id
                    ? "border-brand-400 bg-brand-50"
                    : "border-foreground/10 hover:border-foreground/25"
                )}
              >
                <p className="font-medium text-foreground">{s.nome}</p>
                <p className="mt-1 text-sm text-foreground/60">
                  {formatCurrency(Number(s.preco))}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-2xl text-foreground">Escolha a data</h2>
          <p className="mt-1 text-sm text-foreground/60">{BUSINESS_HOURS.label}</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {upcomingSaturdays.map((d) => {
              const selected = data && toDateKey(data) === toDateKey(d);
              return (
                <button
                  key={toDateKey(d)}
                  type="button"
                  onClick={() => {
                    setData(d);
                    setHorario(null);
                    setHorariosDisponiveis([]);
                  }}
                  className={clsx(
                    "rounded-xl border p-4 text-left transition-colors",
                    selected
                      ? "border-brand-400 bg-brand-50"
                      : "border-foreground/10 hover:border-foreground/25"
                  )}
                >
                  {formatDateLabel(d)}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl text-foreground">Escolha o horário</h2>
          {data && (
            <p className="mt-1 text-sm text-foreground/60">
              {formatDateLabel(data)}
            </p>
          )}

          {carregandoHorarios ? (
            <p className="mt-6 text-sm text-foreground/60">Carregando horários...</p>
          ) : (
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4">
              {horariosDisponiveis.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setHorario(slot)}
                  className={clsx(
                    "rounded-xl border py-3 text-sm font-medium transition-colors",
                    horario === slot
                      ? "border-brand-400 bg-brand-50 text-foreground"
                      : "border-foreground/10 text-foreground/70 hover:border-foreground/25"
                  )}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
          {!carregandoHorarios && horariosDisponiveis.length === 0 && (
            <p className="mt-4 text-sm text-foreground/60">
              Nenhum horário disponível nesta data. Volte e escolha outro sábado.
            </p>
          )}
        </div>
      )}

      {step === 4 && servico && data && horario && (
        <div>
          <h2 className="font-display text-2xl text-foreground">Confirme seu agendamento</h2>
          <dl className="mt-6 space-y-3 text-sm text-foreground/70">
            <div className="flex justify-between">
              <dt>Serviço</dt>
              <dd className="font-medium text-foreground">{servico.nome}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Data</dt>
              <dd className="font-medium text-foreground">
                {formatDateLabel(data)}
              </dd>
            </div>
            <div className="flex justify-between">
              <dt>Horário</dt>
              <dd className="font-medium text-foreground">{horario}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Valor</dt>
              <dd className="font-medium text-foreground">
                {formatCurrency(Number(servico.preco))}
              </dd>
            </div>
          </dl>

          <div className="mt-6 rounded-xl bg-brand-50 p-4 text-xs leading-relaxed text-foreground/70">
            Tolerância de atraso: {POLICIES.toleranciaAtrasoMinutos} minutos.
            Em caso de desistência, avise com{" "}
            {POLICIES.antecedenciaCancelamentoHoras}h de antecedência.
          </div>
        </div>
      )}

      {erro && <p className="mt-6 text-sm text-red-500">{erro}</p>}

      <div className="mt-10 flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={voltar}
          disabled={step === 1}
        >
          Voltar
        </Button>

        {step < steps.length ? (
          <Button type="button" onClick={proximo} disabled={!podeAvancar()}>
            Continuar
          </Button>
        ) : (
          <Button type="button" onClick={confirmar} disabled={enviando}>
            {enviando ? "Agendando..." : "Confirmar agendamento"}
          </Button>
        )}
      </div>
    </div>
  );
}
