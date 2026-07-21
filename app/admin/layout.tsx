import type { Metadata } from "next";
import Link from "next/link";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { BUSINESS } from "@/lib/constants";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const links = [
  { href: "/admin", label: "Agenda" },
  { href: "/admin/agendamentos", label: "Agendamentos" },
  { href: "/admin/bloqueios", label: "Bloqueios" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-1 flex-col sm:flex-row">
      <header className="border-b border-foreground/10 bg-white sm:hidden">
        <div className="px-6 py-4">
          <p className="font-display text-xl tracking-wide text-foreground">
            {BUSINESS.name}
          </p>
          <p className="mt-0.5 text-xs uppercase tracking-wide text-foreground/40">
            Painel administrativo
          </p>
        </div>
        <nav className="flex gap-4 overflow-x-auto px-6 pb-4 text-sm font-medium text-foreground/70">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="whitespace-nowrap hover:text-foreground">
              {link.label}
            </Link>
          ))}
          <LogoutButton className="whitespace-nowrap text-foreground/50 hover:text-foreground" />
        </nav>
      </header>

      <aside className="hidden w-60 shrink-0 border-r border-foreground/10 bg-white sm:block">
        <div className="border-b border-foreground/10 px-6 py-6">
          <p className="font-display text-xl tracking-wide text-foreground">
            {BUSINESS.name}
          </p>
          <p className="mt-1 text-xs uppercase tracking-wide text-foreground/40">
            Painel administrativo
          </p>
        </div>
        <nav className="flex flex-col gap-1 p-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-foreground/70 hover:bg-brand-50 hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
          <LogoutButton className="mt-4 block w-full rounded-lg px-4 py-2.5 text-left text-sm font-medium text-foreground/50 hover:bg-foreground/5" />
        </nav>
      </aside>

      <main className="flex-1 bg-brand-50/30 px-6 py-10 sm:px-10">
        {children}
      </main>
    </div>
  );
}
