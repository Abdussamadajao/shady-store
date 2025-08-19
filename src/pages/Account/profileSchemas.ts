import { z } from "zod";

export const profileSchema = z.object({
  firstName: z
    .string()
    .optional()
    .refine(
      (value) => !value || (value.length >= 2 && value.length <= 50),
      "First name must be between 2 and 50 characters"
    ),
  lastName: z
    .string()
    .optional()
    .refine(
      (value) => !value || (value.length >= 2 && value.length <= 50),
      "Last name must be between 2 and 50 characters"
    ),
  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || /^\+?[\d\s\-\(\)]+$/.test(value),
      "Please enter a valid phone number"
    ),
  email: z.email().optional(),
  image: z.string().optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
