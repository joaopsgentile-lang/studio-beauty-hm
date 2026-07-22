export function getUpcomingSaturdays(quantidade: number, from = new Date()): Date[] {
  const saturdays: Date[] = [];
  const date = new Date(from);
  date.setHours(0, 0, 0, 0);

  while (saturdays.length < quantidade) {
    date.setDate(date.getDate() + 1);
    if (date.getDay() === 6) {
      saturdays.push(new Date(date));
    }
  }

  return saturdays;
}

export function generateTimeSlots(
  abertura: string,
  fechamento: string,
  duracaoMinutos: number
): string[] {
  const [horaInicio, minutoInicio] = abertura.split(":").map(Number);
  const [horaFim, minutoFim] = fechamento.split(":").map(Number);

  const inicioMinutos = horaInicio * 60 + minutoInicio;
  const fimMinutos = horaFim * 60 + minutoFim;

  const slots: string[] = [];
  for (
    let atual = inicioMinutos;
    atual + duracaoMinutos <= fimMinutos;
    atual += duracaoMinutos
  ) {
    const h = Math.floor(atual / 60)
      .toString()
      .padStart(2, "0");
    const m = (atual % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
  }

  return slots;
}

// Gera horários candidatos de início a cada `stepMinutos`, mas só inclui um
// horário se o serviço (com sua própria duração) couber antes do fechamento.
export function generateCandidateStarts(
  abertura: string,
  fechamento: string,
  stepMinutos: number,
  duracaoMinutos: number
): string[] {
  const [horaInicio, minutoInicio] = abertura.split(":").map(Number);
  const [horaFim, minutoFim] = fechamento.split(":").map(Number);

  const inicioMinutos = horaInicio * 60 + minutoInicio;
  const fimMinutos = horaFim * 60 + minutoFim;

  const slots: string[] = [];
  for (
    let atual = inicioMinutos;
    atual + duracaoMinutos <= fimMinutos;
    atual += stepMinutos
  ) {
    const h = Math.floor(atual / 60)
      .toString()
      .padStart(2, "0");
    const m = (atual % 60).toString().padStart(2, "0");
    slots.push(`${h}:${m}`);
  }

  return slots;
}

export function timeToMinutes(horario: string): number {
  const [h, m] = horario.split(":").map(Number);
  return h * 60 + m;
}

export function intervalosSeSobrepoe(
  inicioA: number,
  fimA: number,
  inicioB: number,
  fimB: number
): boolean {
  return inicioA < fimB && fimA > inicioB;
}

export function formatDateLabel(date: Date): string {
  const label = date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

export function toDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

export function parseDateKey(dataIso: string): Date {
  const [ano, mes, dia] = dataIso.split("-").map(Number);
  return new Date(ano, mes - 1, dia);
}
