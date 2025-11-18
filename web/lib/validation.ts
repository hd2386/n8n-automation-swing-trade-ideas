import { z } from "zod";
import {
  DEFAULT_TRADER_PREFERENCES,
  BETA_TOLERANCE_VALUES,
  EARNINGS_SENSITIVITY_VALUES,
  ENTRY_PREFERENCE_VALUES,
  RISK_PROFILE_VALUES,
  TIME_HORIZON_VALUES,
} from "./constants";

export const subscriptionSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  selectedStocks: z
    .array(z.string())
    .min(1, "Please select at least one stock")
    .max(5, "You can select up to 5 stocks"),
  riskProfile: z.enum(RISK_PROFILE_VALUES),
  capital: z.coerce
    .number()
    .min(1000, "Capital should be at least $1,000")
    .max(10000000, "Please keep capital below $10M"),
  riskPerTrade: z.coerce
    .number()
    .min(0.5, "Risk per trade must be at least 0.5%")
    .max(10, "Risk per trade cannot exceed 10%"),
  timeHorizon: z.enum(TIME_HORIZON_VALUES),
  earningsSensitivity: z.enum(EARNINGS_SENSITIVITY_VALUES),
  betaTolerance: z.enum(BETA_TOLERANCE_VALUES),
  exposureLimit: z.coerce
    .number()
    .min(1, "Allow at least one concurrent position")
    .max(10, "Exposure limit capped at 10 concurrent positions"),
  customTicker: z
    .string()
    .trim()
    .max(10, "Ticker should be shorter than 10 characters")
    .regex(/^[A-Za-z0-9]*$/, "Ticker darf nur Buchstaben/Zahlen enthalten")
    .optional()
    .default(DEFAULT_TRADER_PREFERENCES.customTicker),
  entryPreference: z.enum(ENTRY_PREFERENCE_VALUES),
});

export type SubscriptionFormData = z.infer<typeof subscriptionSchema>;
