import { z } from "zod";

const ProfileSchema = z.object({
  image: z.any().optional(),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(3, "City name must be at least 3 characters long"),
  postalCode: z.coerce
    .number()
    .min(1, "Price must be greater than 0")
    .refine((val) => !isNaN(val), "Price must be a valid number"),
  gender: z.enum(["male", "female"], {
    errorMap: () => ({
      message: "Gender must be selected from Male or Female",
    }),
  }),
  phoneNumber: z.coerce
    .number()
    .min(1, "Price must be greater than 0")
    .refine((val) => !isNaN(val), "PhoneNumber must be a valid number"),
});

export default ProfileSchema;
