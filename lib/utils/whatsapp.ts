import { BUSINESS } from "@/lib/constants";

export function buildWhatsappLink(mensagem: string): string {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

export function buildAgendamentoMensagem({
  nome,
  servico,
  dataLabel,
  horario,
}: {
  nome: string;
  servico: string;
  dataLabel: string;
  horario: string;
}): string {
  return `Olá! Sou ${nome} e acabei de agendar o serviço "${servico}" para ${dataLabel} às ${horario} pelo site do ${BUSINESS.name}.`;
}
