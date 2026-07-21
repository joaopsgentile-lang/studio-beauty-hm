"use client";

import { useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { LogoutButton } from "@/components/auth/LogoutButton";

const links = [
  { href: "/servicos", label: "Serviços" },
  { href: "/agendar", label: "Agendar" },
  { href: "/contato", label: "Contato" },
];

export function MobileNav({
  accountHref,
  accountLabel,
  loggedIn,
}: {
  accountHref: string;
  accountLabel: string;
  loggedIn: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        aria-label={open ? "Fechar menu" : "Abrir menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="flex h-10 w-10 items-center justify-center rounded-full border border-foreground/15"
      >
        <span className="sr-only">Menu</span>
        <div className="space-y-1.5">
          <span
            className={clsx(
              "block h-px w-5 bg-foreground transition-transform",
              open && "translate-y-[7px] rotate-45"
            )}
          />
          <span
            className={clsx(
              "block h-px w-5 bg-foreground transition-opacity",
              open && "opacity-0"
            )}
          />
          <span
            className={clsx(
              "block h-px w-5 bg-foreground transition-transform",
              open && "-translate-y-[7px] -rotate-45"
            )}
          />
        </div>
      </button>

      {open && (
        <nav className="absolute inset-x-0 top-full border-t border-foreground/10 bg-background px-6 py-4 shadow-sm">
          <ul className="flex flex-col gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block text-base font-medium tracking-wide text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href={accountHref}
                onClick={() => setOpen(false)}
                className="block text-base font-medium tracking-wide text-foreground"
              >
                {accountLabel}
              </Link>
            </li>
            {loggedIn && (
              <li>
                <LogoutButton className="block text-base font-medium tracking-wide text-foreground/60" />
              </li>
            )}
          </ul>
        </nav>
      )}
    </div>
  );
}
