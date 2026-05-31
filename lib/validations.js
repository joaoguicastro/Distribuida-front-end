/**
 * Shared form validations — HealthSys frontend
 */

export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test((email || "").trim());
}

export function validateNome(nome) {
  const trimmed = (nome || "").trim();
  if (!trimmed) return "O nome é obrigatório.";
  if (trimmed.length < 3) return "O nome deve ter no mínimo 3 caracteres.";
  if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/.test(trimmed))
    return "O nome deve conter apenas letras e espaços.";
  return "";
}

/**
 * Valida telefone brasileiro: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
 * Aceita com ou sem máscara.
 */
export function validatePhone(phone) {
  const digits = (phone || "").replace(/\D/g, "");
  if (!digits) return "O telefone é obrigatório.";
  if (digits.length < 10 || digits.length > 11)
    return "Telefone inválido. Use o formato (XX) XXXXX-XXXX.";
  return "";
}

/**
 * Formata número de telefone enquanto o usuário digita.
 */
export function formatPhone(value) {
  const digits = value.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10)
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Valida data de nascimento:
 * - Não pode ser futura.
 * - Pessoa deve ter entre 0 e 150 anos.
 * - Retorna "" se válida, ou mensagem de erro.
 */
export function validateBirthDate(dateStr) {
  if (!dateStr) return "A data de nascimento é obrigatória.";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Data inválida.";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date > today) return "A data de nascimento não pode ser uma data futura.";

  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 150);
  if (date < minDate) return "Data de nascimento inválida (máximo 150 anos atrás).";

  return "";
}

/**
 * Retorna a data de hoje no formato YYYY-MM-DD (para campos type="date").
 */
export function todayISO() {
  return new Date().toISOString().split("T")[0];
}

/**
 * Valida sintomas (campo opcional, mas se preenchido deve ter mínimo de chars)
 */
export function validateSintomas(sintomas) {
  const trimmed = (sintomas || "").trim();
  if (trimmed && trimmed.length < 5)
    return "Descreva os sintomas com pelo menos 5 caracteres.";
  return "";
}
