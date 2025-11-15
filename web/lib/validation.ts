import { z } from "zod";

export const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  selectedStocks: z
    .array(z.string())
    .min(1, "Please select at least one stock")
    .max(5, "You can select up to 5 stocks"),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
