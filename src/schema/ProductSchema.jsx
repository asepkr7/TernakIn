import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(3, "City name must be at least 3 characters long"),
  wide: z.coerce
    .number()
    .min(0, "Wide must be a positive number")
    .refine((val) => !isNaN(val), "Wide must be a valid number"),
  type: z.string().min(1, "Type is required"),
  stock: z.coerce
    .number()
    .min(1, "Stock must be at least 1")
    .int("Stock must be an integer")
    .refine((val) => !isNaN(val), "Stock must be a valid number"),
  image: z.any().optional(), // No need to validate image type here
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  price: z.coerce
    .number()
    .min(1, "Price must be greater than 0")
    .refine((val) => !isNaN(val), "Price must be a valid number"),
});

export default ProductSchema;
