import { WHATSAPP_NUMBER } from "@/lib/utils";

const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? WHATSAPP_NUMBER;

export function buildWhatsAppLink(productName: string): string {
  const message = encodeURIComponent(`Hi, I would like to order: ${productName}`);
  return `https://wa.me/${number}?text=${message}`;
}
