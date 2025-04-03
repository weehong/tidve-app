import { z } from "zod";

export const SubscriptionFormSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, { message: "Name is required" }),
  currency: z
    .object({
      value: z.string().min(1, { message: "Currency is required" }),
      label: z.string().min(1, { message: "Currency label is required" }),
    })
    .refine((data) => data.value && data.label, {
      message: "Currency object is invalid",
    }),
  price: z.coerce
    .number()
    .min(0.01, { message: "Price must be greater than 0" })
    .refine(
      (val) => {
        return val.toString().split(".").length <= 2;
      },
      {
        message: "Price must be a valid number",
      },
    ),
  cycle: z.coerce
    .number()
    .min(1, { message: "Cycle must be at least 1 month" }),
  url: z
    .string()
    .transform((val) => (val === "" ? undefined : val))
    .refine(
      (val) => val === undefined || z.string().url().safeParse(val).success,
      {
        message: "Invalid URL",
      },
    )
    .optional(),
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
