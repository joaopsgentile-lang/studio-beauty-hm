export const BUSINESS = {
  name: "StudioBeautyHM",
  tagline: "Design de sobrancelhas",
  address: {
    street: "Rua Pastor Antônio Munhoz, 131",
    neighborhood: "São Camilo",
    city: "Santa Bárbara D'Oeste - SP",
  },
  whatsapp: "5519981518165",
  whatsappDisplay: "(19) 98151-8165",
  instagram: "https://www.instagram.com/studiobeautyhm/",
  instagramHandle: "@studiobeautyhm",
} as const;

export const BUSINESS_HOURS = {
  diasFuncionamento: ["Sábado"],
  abertura: "07:00",
  fechamento: "16:00",
  label: "Sábado, das 07h às 16h",
} as const;

export const POLICIES = {
  toleranciaAtrasoMinutos: 10,
  antecedenciaCancelamentoHoras: 12,
} as const;

export const PAYMENT_METHODS = ["Dinheiro", "Pix", "Débito", "Crédito"] as const;

// Intervalo entre horários de início oferecidos na agenda (não é mais a
// duração do serviço, que agora varia por procedimento).
export const AGENDA_STEP_MINUTOS = 40;
