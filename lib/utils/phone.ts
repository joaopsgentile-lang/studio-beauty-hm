const INTERNAL_EMAIL_DOMAIN = "clientes.studiobeautyhm.com.br";

export function normalizePhoneDigits(telefone: string): string {
  return telefone.replace(/\D/g, "");
}

// Supabase Auth exige um e-mail como identificador. Para permitir cadastro só
// com telefone (público mais velho tem dificuldade com e-mail), geramos um
// e-mail interno a partir do telefone — nunca exibido nem usado para envio.
export function phoneToInternalEmail(telefone: string): string {
  return `${normalizePhoneDigits(telefone)}@${INTERNAL_EMAIL_DOMAIN}`;
}

export function isInternalEmail(email: string): boolean {
  return email.endsWith(`@${INTERNAL_EMAIL_DOMAIN}`);
}
