import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { BUSINESS, BUSINESS_HOURS } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="border-t border-foreground/10 bg-white/60">
      <Container className="grid gap-10 py-14 sm:grid-cols-3">
        <div>
          <p className="font-display text-2xl tracking-wide text-foreground">
            {BUSINESS.name}
          </p>
          <p className="mt-2 text-sm text-foreground/60">{BUSINESS.tagline}</p>
        </div>

        <div className="text-sm text-foreground/70">
          <p className="font-medium text-foreground">Endereço</p>
          <p className="mt-2">{BUSINESS.address.street}</p>
          <p>
            {BUSINESS.address.neighborhood} — {BUSINESS.address.city}
          </p>
          <p className="mt-4 font-medium text-foreground">Horário</p>
          <p className="mt-2">{BUSINESS_HOURS.label}</p>
        </div>

        <div className="text-sm text-foreground/70">
          <p className="font-medium text-foreground">Contato</p>
          <p className="mt-2">
            <a
              href={`https://wa.me/${BUSINESS.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              WhatsApp: {BUSINESS.whatsappDisplay}
            </a>
          </p>
          <p className="mt-1">
            <a
              href={BUSINESS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              Instagram: {BUSINESS.instagramHandle}
            </a>
          </p>
          <p className="mt-4">
            <Link href="/agendar" className="underline underline-offset-4">
              Agendar horário
            </Link>
          </p>
        </div>
      </Container>

      <div className="border-t border-foreground/10 py-6">
        <Container>
          <p className="text-xs text-foreground/50">
            © {new Date().getFullYear()} {BUSINESS.name}. Todos os direitos reservados.
          </p>
        </Container>
      </div>
    </footer>
  );
}
