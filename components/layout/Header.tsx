import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { MobileNav } from "@/components/layout/MobileNav";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BUSINESS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

const links = [
  { href: "/servicos", label: "Serviços" },
  { href: "/contato", label: "Contato" },
];

export async function Header() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let accountHref = "/login";
  let accountLabel = "Entrar";

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();
    accountHref = profile?.role === "admin" ? "/admin" : "/minha-conta";
    accountLabel = profile?.role === "admin" ? "Painel" : "Minha conta";
  }

  return (
    <header className="relative border-b border-foreground/10 bg-background/95 backdrop-blur">
      <Container className="flex h-20 items-center justify-between">
        <Link href="/" className="font-display text-2xl tracking-wide text-foreground">
          {BUSINESS.name}
        </Link>

        <nav className="hidden items-center gap-8 sm:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href={accountHref}
            className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground"
          >
            {accountLabel}
          </Link>
          {user && (
            <LogoutButton className="text-sm font-medium tracking-wide text-foreground/80 hover:text-foreground" />
          )}
          <Button href="/agendar" className="px-5 py-2.5 text-xs">
            Agendar horário
          </Button>
        </nav>

        <MobileNav accountHref={accountHref} accountLabel={accountLabel} loggedIn={!!user} />
      </Container>
    </header>
  );
}
