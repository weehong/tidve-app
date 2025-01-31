import { z } from "zod";

export const SubscriptionFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  currency: z.string().min(1, { message: "Currency is required" }),
  price: z.number().min(0.01, { message: "Price must be greater than 0" }),
  cycle: z.number().min(1, { message: "Cycle must be at least 1 month" }),
  start_date: z
    .string()
    .min(1, { message: "Start date is required" })
    .refine(
      (val) =>
        /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime()),
      { message: "Start date must be a valid date in YYYY-MM-DD format" },
    ),
  end_date: z
    .string()
    .min(1, { message: "End date is required" })
    .refine(
      (val) =>
        /^\d{4}-\d{2}-\d{2}$/.test(val) && !isNaN(new Date(val).getTime()),
      { message: "End date must be a valid date in YYYY-MM-DD format" },
    ),
});

export type SubscriptionFormValues = z.infer<typeof SubscriptionFormSchema>;
