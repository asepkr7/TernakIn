import { z } from "zod";
const loginFormSchema = z.object({
  email: z.string().trim().min(1, "Email cannot be empty"),
  password: z.string().trim().min(1, "Password cannot be empty"),
});

export default loginFormSchema;
