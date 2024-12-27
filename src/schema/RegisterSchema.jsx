import { z } from "zod";

const registerSchema = z
  .object({
    name: z.string().trim().min(1, "Name cannot be empty"),
    email: z.string().trim().email("Invalid email format"),
    username: z
      .string()
      .trim()
      .min(4, "Username must be at least 4 characters"),
    role: z.string().trim().min(1, "Please select a role"),
    password: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),
    confirmPassword: z
      .string()
      .trim()
      .min(6, "Password must be at least 6 characters"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Password confirmation must match the password",
  });

export default registerSchema;
