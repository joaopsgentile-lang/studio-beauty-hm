import { BUSINESS, BUSINESS_HOURS } from "@/lib/constants";

export function getLocalBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BeautySalon",
    name: BUSINESS.name,
    description: `Estúdio de design de sobrancelhas em ${BUSINESS.address.city}.`,
    url: "https://studiobeautyhm.com.br",
    telephone: `+${BUSINESS.whatsapp}`,
    priceRange: "R$10-R$480",
    address: {
      "@type": "PostalAddress",
      streetAddress: BUSINESS.address.street,
      addressLocality: "Santa Bárbara D'Oeste",
      addressRegion: "SP",
      addressCountry: "BR",
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: BUSINESS_HOURS.abertura,
      closes: BUSINESS_HOURS.fechamento,
    },
    sameAs: [BUSINESS.instagram],
  };
}
