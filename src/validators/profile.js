import z from "zod";

export const editProfileSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  avatar: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  interests: z.array(z.string()).optional(),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  location: z.string().max(100).optional(),
});
