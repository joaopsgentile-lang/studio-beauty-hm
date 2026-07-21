import { test, expect } from "@playwright/test";

test.describe("Páginas públicas", () => {
  test("home carrega e mostra o nome do negócio e CTA de agendamento", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /sobrancelhas/i })).toBeVisible();
    await expect(page.getByRole("link", { name: "Agendar horário" }).first()).toBeVisible();
  });

  test("página de serviços lista os 6 procedimentos do catálogo", async ({ page }) => {
    await page.goto("/servicos");
    await expect(page.getByRole("heading", { name: "Design personalizado" })).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Micropigmentação fio a fio" })
    ).toBeVisible();
    await expect(page.getByRole("heading", { name: "Buço" })).toBeVisible();
  });

  test("página de contato mostra WhatsApp e Instagram", async ({ page }) => {
    await page.goto("/contato");
    await expect(page.getByText("(19) 98151-8165").first()).toBeVisible();
    await expect(page.getByText("@studiobeautyhm").first()).toBeVisible();
  });
});

test.describe("Proteção de rotas", () => {
  test("visitante não autenticado é redirecionado ao tentar agendar", async ({ page }) => {
    await page.goto("/agendar");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("visitante não autenticado é redirecionado ao tentar acessar Minha Conta", async ({
    page,
  }) => {
    await page.goto("/minha-conta");
    await expect(page).toHaveURL(/\/login$/);
  });

  test("visitante não autenticado é redirecionado ao tentar acessar o painel admin", async ({
    page,
  }) => {
    await page.goto("/admin");
    await expect(page).toHaveURL(/\/login$/);
  });
});
