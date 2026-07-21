import { describe, expect, it } from "vitest";
import {
  formatDateLabel,
  generateTimeSlots,
  getUpcomingSaturdays,
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
