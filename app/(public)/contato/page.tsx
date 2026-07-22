import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { BUSINESS, BUSINESS_HOURS, PAYMENT_METHODS } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contato",
  description:
    "Endereço, WhatsApp e horário de atendimento do StudioBeautyHM em Santa Bárbara D'Oeste - SP.",
};

const mapQuery = encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.neighborhood}, ${BUSINESS.address.city}`
);

export default function ContatoPage() {
  return (
    <section className="py-20">
      <Container className="grid gap-12 sm:grid-cols-2">
        <div>
          <SectionHeading eyebrow="Fale com a gente" title="Contato" />

          <dl className="mt-8 space-y-6 text-sm text-foreground/70">
            <div>
              <dt className="font-medium text-foreground">Endereço</dt>
              <dd className="mt-1">
                {BUSINESS.address.street}
                <br />
                {BUSINESS.address.neighborhood} — {BUSINESS.address.city}
              </dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Horário de atendimento</dt>
              <dd className="mt-1">{BUSINESS_HOURS.label}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">WhatsApp</dt>
              <dd className="mt-1">{BUSINESS.whatsappDisplay}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Instagram</dt>
              <dd className="mt-1">{BUSINESS.instagramHandle}</dd>
            </div>
            <div>
              <dt className="font-medium text-foreground">Formas de pagamento</dt>
              <dd className="mt-1">{PAYMENT_METHODS.join(", ")}</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <Button href={`https://wa.me/${BUSINESS.whatsapp}`}>
              Falar no WhatsApp
            </Button>
            <Button href={BUSINESS.instagram} variant="outline">
              Ver Instagram
            </Button>
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-foreground/10">
          <iframe
            title="Localização do StudioBeautyHM"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-full min-h-96 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </Container>
    </section>
  );
}
