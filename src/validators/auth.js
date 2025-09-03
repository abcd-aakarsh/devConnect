import { z } from "zod";

export const signUpSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .nonempty("First name is required")
      .min(2, "First name must be at least 2 characters long")
      .max(30, "First name must be at most 30 characters long")
      .trim(),
    lastName: z
      .string()
      .max(30, "Last name must be at most 30 characters long")
      .trim()
      .optional(),
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long")

      .trim(),
    dob: z.coerce
      .date() // 👈 converts string -> Date automatically
      .min(new Date(1900, 0, 1), { message: "DOB cannot be before 1900" })
      .max(new Date(), { message: "DOB cannot be in the future" })
      .refine(
        (date) => {
          const today = new Date();
          let age = today.getFullYear() - date.getFullYear();
          const monthDiff = today.getMonth() - date.getMonth();
          const dayDiff = today.getDate() - date.getDate();

          if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--; // adjust age if birthday hasn't occurred yet this year
          }

          return age >= 13;
        },
        { message: "You must be at least 13 years old" }
      ),
  }),
});
export const loginSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
    password: z
      .string()
      .min(4, "Password must be at least 4 characters long")
      .trim(),
  }),
});
export const forgotPasswordSchema = z.object({
  body: z.object({
    email: z.string().email("Invalid email format").toLowerCase().trim(),
  }),
});
