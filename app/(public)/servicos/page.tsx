import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Serviços",
  description:
    "Conheça os procedimentos do StudioBeautyHM: design personalizado, henna, brow lamination e micropigmentação de sobrancelhas em Santa Bárbara D'Oeste - SP.",
};

export default async function ServicosPage() {
  const supabase = await createClient();
  const { data: services } = await supabase
    .from("services")
    .select("slug, nome, descricao, duracao_minutos, preco")
    .eq("ativo", true)
    .order("ordem");

  return (
    <section className="py-20">
      <Container>
        <SectionHeading
          eyebrow="Tabela de valores"
          title="Nossos serviços"
          description="Escolha o procedimento e agende diretamente pelo site. Duração pode variar conforme a necessidade de cada atendimento."
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(services ?? []).map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </Container>
    </section>
  );
}
