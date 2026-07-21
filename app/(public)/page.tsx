import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { BUSINESS, BUSINESS_HOURS } from "@/lib/constants";
import { createClient } from "@/lib/supabase/server";

const mapQuery = encodeURIComponent(
  `${BUSINESS.address.street}, ${BUSINESS.address.city}`
);

const DESTAQUES = ["design-personalizado", "brow-lamination", "micropigmentacao-fio-a-fio"];

export default async function HomePage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("slug, nome, descricao, duracao_minutos, preco")
    .eq("ativo", true)
    .order("ordem");

  const featured = (services ?? []).filter((s) => DESTAQUES.includes(s.slug));

  return (
    <>
      <section className="border-b border-foreground/10 bg-gradient-to-b from-brand-50 to-background py-24">
        <Container className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-500">
            {BUSINESS.address.city}
          </p>
          <h1 className="font-display mx-auto mt-4 max-w-3xl text-5xl font-medium tracking-wide text-foreground sm:text-6xl">
            Sobrancelhas com design, técnica e cuidado
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-foreground/70">
            Atendimento personalizado no {BUSINESS.name}. Design, henna, brow
            lamination e micropigmentação — agende seu horário em poucos
            cliques.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Button href="/agendar">Agendar horário</Button>
            <Button href="/servicos" variant="outline">
              Ver serviços
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="grid gap-12 sm:grid-cols-2 sm:items-center">
          <div>
            <SectionHeading
              eyebrow="Sobre o estúdio"
              title="Atendimento individual, feito sob medida"
              description="No StudioBeautyHM cada procedimento é pensado para valorizar o formato natural do seu olhar. Um espaço pensado para você relaxar enquanto cuidamos dos detalhes."
            />
          </div>
          <div className="rounded-2xl border border-foreground/10 bg-white/60 p-8">
            <p className="font-display text-2xl text-foreground">
              Informações importantes
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-relaxed text-foreground/70">
              <li>
                Tolerância de atraso de{" "}
                <strong className="text-foreground">10 minutos</strong> para
                não afetar o próximo atendimento.
              </li>
              <li>
                Em caso de desistência, avise com{" "}
                <strong className="text-foreground">12h de antecedência</strong>.
              </li>
              <li>
                Pagamento em dinheiro, Pix ou cartão de crédito.
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="border-y border-foreground/10 bg-white/40 py-24">
        <Container>
          <SectionHeading
            eyebrow="Serviços"
            title="Procedimentos em destaque"
            align="center"
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {featured.map((service) => (
              <ServiceCard key={service.slug} service={service} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/servicos" variant="outline">
              Ver tabela completa de serviços
            </Button>
          </div>
        </Container>
      </section>

      <section className="py-24">
        <Container className="grid gap-10 sm:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Localização"
              title="Onde estamos"
              description={`${BUSINESS.address.street} — ${BUSINESS.address.city}. Atendimento aos ${BUSINESS_HOURS.label.toLowerCase()}.`}
            />
            <div className="mt-6">
              <Button
                href={`https://wa.me/${BUSINESS.whatsapp}`}
              >
                Falar no WhatsApp
              </Button>
            </div>
          </div>
          <div className="overflow-hidden rounded-2xl border border-foreground/10">
            <iframe
              title="Localização do StudioBeautyHM"
              src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Container>
      </section>
    </>
  );
}
