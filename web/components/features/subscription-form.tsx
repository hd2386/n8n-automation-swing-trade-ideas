"use client";

import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validation";
import { profileEmailStorage } from "@/lib/storage";
import {
  DEFAULT_TRADER_PREFERENCES,
  BETA_TOLERANCE_OPTIONS,
  EARNINGS_SENSITIVITY_OPTIONS,
  ENTRY_PREFERENCE_OPTIONS,
  RISK_PROFILE_OPTIONS,
  TIME_HORIZON_OPTIONS,
} from "@/lib/constants";
import { StockSelector } from "./stock-selector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Subscription, TraderPreferences } from "@/types";

const buildFormValues = (
  email: string,
  selectedStocks: string[],
  preferences: TraderPreferences
): SubscriptionFormData => ({
  email,
  selectedStocks,
  riskProfile: preferences.riskProfile,
  capital: preferences.capital,
  riskPerTrade: preferences.riskPerTrade,
  timeHorizon: preferences.timeHorizon,
  earningsSensitivity: preferences.earningsSensitivity,
  betaTolerance: preferences.betaTolerance,
  exposureLimit: preferences.exposureLimit,
  customTicker: preferences.customTicker,
  entryPreference: preferences.entryPreference,
});

interface SubscriptionFormProps {
  initialEmail?: string;
  initialStocks?: string[];
  initialPreferences?: TraderPreferences;
  onSuccess?: (profile: Subscription) => void;
}

export function SubscriptionForm({
  initialEmail = "",
  initialStocks = [],
  initialPreferences,
  onSuccess,
}: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mergedPreferences = useMemo<TraderPreferences>(
    () => ({
      ...DEFAULT_TRADER_PREFERENCES,
      ...(initialPreferences || {}),
    }),
    [initialPreferences]
  );

  const defaultValues = useMemo(
    () => buildFormValues(initialEmail, initialStocks, mergedPreferences),
    [initialEmail, initialStocks, mergedPreferences]
  );

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues,
  });

  useEffect(() => {
    form.reset(defaultValues);
  }, [defaultValues, form]);

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);
    setErrorMessage(null);

    try {
      const normalizedTicker = data.customTicker?.toUpperCase?.().trim() ?? "";

      const body = {
        ...data,
        customTicker: normalizedTicker,
      };

      const response = await fetch("/api/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message || "Unable to save profile");
      }

      const savedProfile = (await response.json()) as Subscription;
      profileEmailStorage.set(savedProfile.email);

      form.reset(
        buildFormValues(
          savedProfile.email,
          savedProfile.selectedStocks,
          savedProfile.preferences
        )
      );

      setIsSuccess(true);
      if (onSuccess) {
        setTimeout(() => {
          onSuccess(savedProfile);
        }, 1200);
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
      setErrorMessage(
        error instanceof Error ? error.message : "Unknown error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle2 className="mb-4 h-12 w-12 text-green-500" />
            <h3 className="mb-2 text-xl font-semibold">Subscription Saved!</h3>
            <p className="text-muted-foreground">
              Deine Trading-Präferenzen wurden gespeichert.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Personalize Your Swing Signals</CardTitle>
        <CardDescription>
          Enter your email, watchlist, and risk parameters so we can tailor the
          n8n automation to your trading style.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {errorMessage && (
              <div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {errorMessage}
              </div>
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="your.email@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We'll send daily reports to this address.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="selectedStocks"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <StockSelector
                      selectedStocks={field.value || []}
                      onSelectionChange={(stocks) => {
                        field.onChange(stocks);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="customTicker"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Manueller Ticker (optional)</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="z. B. TSM"
                      {...field}
                      onChange={(event) =>
                        field.onChange(event.target.value.toUpperCase())
                      }
                    />
                  </FormControl>
                  <FormDescription>
                    Falls dein gewünschter Wert nicht in der Liste ist, gib hier
                    ein Ticker-Kürzel an.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h4 className="text-base font-semibold">Risk & Kapital</h4>
                <p className="text-sm text-muted-foreground">
                  Diese Angaben steuern Stop-Loss-Abstaende, Positionsgroessen
                  und Timeframes im Prompt.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="riskProfile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risikoprofil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Choose profile" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {RISK_PROFILE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Verfuegbares Kapital (USD)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1000}
                          step={500}
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              Number.isNaN(event.target.valueAsNumber)
                                ? 0
                                : event.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Wird genutzt, um Positionsgroessen- und Risiko-Hinweise
                        zu formulieren.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="riskPerTrade"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Risiko pro Trade (%)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0.5}
                          max={10}
                          step={0.5}
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              Number.isNaN(event.target.valueAsNumber)
                                ? 0.5
                                : event.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Steuert die Risikorechnung (ATR-Multiplikatoren,
                        Positionsgroesse).
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="exposureLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Maximale gleichzeitige Positionen (Anzahl)
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={1}
                          max={10}
                          step={1}
                          {...field}
                          onChange={(event) =>
                            field.onChange(
                              Number.isNaN(event.target.valueAsNumber)
                                ? 1
                                : event.target.valueAsNumber
                            )
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Prompt warnt, falls mehr Signale aktiv waeren.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg border p-4">
              <div>
                <h4 className="text-base font-semibold">
                  Trading-Praeferenzen
                </h4>
                <p className="text-sm text-muted-foreground">
                  Diese Einstellungen fliessen in Timeframe-, Earnings- und
                  Entry-Logik ein.
                </p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="timeHorizon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bevorzugter Zeithorizont</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select horizon" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {TIME_HORIZON_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="earningsSensitivity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Earnings / News Verhalten</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select sensitivity" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {EARNINGS_SENSITIVITY_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="betaTolerance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Beta / Volatilitaet</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select tolerance" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BETA_TOLERANCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="entryPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Entry-Stil</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select entry style" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ENTRY_PREFERENCE_OPTIONS.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Subscribe"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
