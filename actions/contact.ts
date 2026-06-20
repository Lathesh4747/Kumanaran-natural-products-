"use server";

import { z } from "zod";
import { db } from "@/db";
import { contactSubmissions } from "@/db/schema";

export type ContactState = {
  success: boolean;
  error?: string;
};

const contactSchema = z.object({
  name: z.string().trim().min(1, "Please enter your name."),
  email: z.string().trim().email("Please enter a valid email address."),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Message must be at least 10 characters."),
});

export async function submitContactForm(
  _prev: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name") ?? "",
    email: formData.get("email") ?? "",
    phone: formData.get("phone") ?? "",
    message: formData.get("message") ?? "",
  });

  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Please check the form." };
  }

  const { name, email, phone, message } = parsed.data;

  try {
    await db.insert(contactSubmissions).values([
      { name, email, phone: phone || null, message },
    ]);
    return { success: true };
  } catch (error) {
    console.error("[actions/contact]", error);
    return {
      success: false,
      error: "Something went wrong. Please reach out via WhatsApp instead.",
    };
  }
}
