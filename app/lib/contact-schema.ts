import { z } from "zod/v4";

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required").max(100, "Name must be 100 characters or fewer"),
  email: z.email("Please enter a valid email address"),
  message: z
    .string()
    .min(1, "Message is required")
    .max(5000, "Message must be 5,000 characters or fewer"),
  website: z.string().max(0).optional(),
  turnstileToken: z.string().min(1, "Please complete the verification"),
});

export type ContactFormData = z.infer<typeof contactSchema>;
