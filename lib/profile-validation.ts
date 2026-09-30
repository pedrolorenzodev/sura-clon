import type { ProfileFieldInput } from "@/lib/data/profile";

const LETTERS = /^\p{L}[\p{L}\s'’.-]*$/u;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const cleanValue = (value: string) => value.trim().replace(/\s+/g, " ");

export function formatBirthDate(raw: string, previous: string) {
  const digits = raw.replace(/\D/g, "").slice(0, 8);
  const growing = raw.length > previous.length;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4);

  if (digits.length > 4) return `${day}/${month}/${year}`;
  if (digits.length > 2) return `${day}/${month}${growing && digits.length === 4 ? "/" : ""}`;
  return `${day}${growing && digits.length === 2 ? "/" : ""}`;
}

function dateError(value: string) {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value);
  if (!match) return "Completá el día, el mes y el año.";
  const [day, month, year] = match.slice(1).map(Number);
  const date = new Date(year, month - 1, day);
  if (date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) return "Esa fecha no existe.";
  if (year < 1900) return "Revisá el año.";
  if (date > new Date()) return "La fecha no puede ser futura.";
  return null;
}

export function validateProfileValue(input: ProfileFieldInput, value: string) {
  if (input === "date") return dateError(value);
  if (input === "email") return EMAIL.test(value) ? null : "Revisá el email: falta la @ o el dominio.";
  if (value.length < 2) return input === "country" ? "Escribí el nombre de un país." : "Escribí al menos dos letras.";
  if (!LETTERS.test(value)) return "Usá sólo letras.";
  return null;
}
