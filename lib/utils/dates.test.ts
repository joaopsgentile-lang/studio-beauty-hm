import { describe, expect, it } from "vitest";
import {
  formatDateLabel,
  generateCandidateStarts,
  generateTimeSlots,
  getUpcomingSaturdays,
  intervalosSeSobrepoe,
  parseDateKey,
  toDateKey,
} from "./dates";

describe("getUpcomingSaturdays", () => {
  it("retorna apenas sábados, em ordem, sempre depois da data de referência", () => {
    const from = new Date(2026, 6, 21); // terça-feira, 21/07/2026
    const saturdays = getUpcomingSaturdays(4, from);

    expect(saturdays).toHaveLength(4);
    saturdays.forEach((d) => {
      expect(d.getDay()).toBe(6);
      expect(d.getTime()).toBeGreaterThan(from.getTime());
    });

    for (let i = 1; i < saturdays.length; i++) {
      const diffDias = (saturdays[i].getTime() - saturdays[i - 1].getTime()) / 86_400_000;
      expect(diffDias).toBe(7);
    }
  });

  it("quando a data de referência é um sábado, retorna o próximo sábado (não o mesmo dia)", () => {
    const umSabado = new Date(2026, 6, 25); // sábado, 25/07/2026
    const [proximo] = getUpcomingSaturdays(1, umSabado);
    expect(toDateKey(proximo)).toBe("2026-08-01");
  });
});

describe("generateTimeSlots", () => {
  it("gera slots de 40min entre 07:00 e 16:00, sem ultrapassar o fechamento", () => {
    const slots = generateTimeSlots("07:00", "16:00", 40);
    expect(slots[0]).toBe("07:00");
    expect(slots[slots.length - 1]).toBe("15:00");
    expect(slots).toHaveLength(13);
    expect(slots).not.toContain("15:40");
  });

  it("não gera nenhum slot quando a duração é maior que a janela disponível", () => {
    expect(generateTimeSlots("15:30", "16:00", 40)).toEqual([]);
  });
});

describe("generateCandidateStarts", () => {
  it("respeita a duração real do serviço, não um slot fixo", () => {
    // Micropigmentação (150min): último início possível é 13:30 (13:30+150=16:00)
    const slots = generateCandidateStarts("07:00", "16:00", 40, 150);
    expect(slots[0]).toBe("07:00");
    expect(slots[slots.length - 1]).toBe("13:00");
    expect(slots).not.toContain("13:40"); // 13:40 + 150min = 16:10, passaria do fechamento
  });

  it("serviço curto (35min) permite mais horários próximos do fechamento", () => {
    const slots = generateCandidateStarts("07:00", "16:00", 40, 35);
    expect(slots[slots.length - 1]).toBe("15:00");
  });
});

describe("intervalosSeSobrepoe", () => {
  it("detecta sobreposição parcial", () => {
    // 09:00-11:30 vs 10:00-10:45 (em minutos desde 00:00)
    expect(intervalosSeSobrepoe(540, 690, 600, 645)).toBe(true);
  });

  it("intervalos encostados (fim de um = início do outro) não se sobrepõem", () => {
    expect(intervalosSeSobrepoe(540, 600, 600, 640)).toBe(false);
  });

  it("intervalos totalmente separados não se sobrepõem", () => {
    expect(intervalosSeSobrepoe(540, 580, 700, 740)).toBe(false);
  });
});

describe("formatDateLabel", () => {
  it("capitaliza apenas a primeira letra, mantendo 'de' em minúsculo", () => {
    const label = formatDateLabel(new Date(2026, 6, 25));
    expect(label.startsWith("S")).toBe(true);
    expect(label).not.toMatch(/\bDe\b/);
    expect(label).toContain("de julho");
  });
});

describe("toDateKey / parseDateKey", () => {
  it("faz o round-trip preservando ano, mês e dia locais", () => {
    const original = new Date(2026, 6, 25);
    const key = toDateKey(original);
    const parsed = parseDateKey(key);

    expect(parsed.getFullYear()).toBe(original.getFullYear());
    expect(parsed.getMonth()).toBe(original.getMonth());
    expect(parsed.getDate()).toBe(original.getDate());
  });
});
