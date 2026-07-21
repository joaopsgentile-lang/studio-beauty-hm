import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ClienteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-foreground/10 bg-background/95">
        <Container className="flex flex-col gap-3 py-4 sm:h-20 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-0">
          <Link href="/" className="font-display text-xl tracking-wide text-foreground sm:text-2xl">
            {BUSINESS.name}
          </Link>
          <nav className="flex items-center gap-4 text-xs font-medium tracking-wide text-foreground/80 sm:gap-6 sm:text-sm">
            <Link href="/minha-conta" className="hover:text-foreground">
              Minha conta
            </Link>
            <Link href="/agendar" className="hover:text-foreground">
              Agendar
            </Link>
            <LogoutButton className="hover:text-foreground" />
          </nav>
        </Container>
      </header>
      <main className="flex-1 bg-brand-50/40">{children}</main>
    </>
  );
}
