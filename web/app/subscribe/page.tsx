"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { pendingSubscriptionStorage } from "@/lib/storage";
import { SubscriptionForm } from "@/components/features/subscription-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AVAILABLE_STOCKS,
  BETA_TOLERANCE_OPTIONS,
  EARNINGS_SENSITIVITY_OPTIONS,
  ENTRY_PREFERENCE_OPTIONS,
  RISK_PROFILE_OPTIONS,
  TIME_HORIZON_OPTIONS,
} from "@/lib/constants";
import type { Subscription } from "@/types";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const getOptionLabel = (
  options: readonly { value: string; label: string }[],
  value?: string
) => options.find((option) => option.value === value)?.label ?? value ?? "-";

export default function SubscribePage() {
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const router = useRouter();

  const initialFormValues = useMemo(() => {
    if (!subscription) {
      return {
        email: userEmail || "",
        stocks: [] as string[],
        preferences: undefined,
      };
    }

    return {
      email: subscription.email,
      stocks: [...subscription.selectedStocks],
      preferences: subscription.preferences,
    };
  }, [subscription, userEmail]);

  const fetchProfile = useCallback(
    async (email: string) => {
      if (!email) return;
      setIsLoading(true);
      try {
        const response = await fetch("/api/profile");

        if (!response.ok) {
          if (response.status === 401) {
            // Not authenticated, redirect to login
            router.push("/login?next=/subscribe");
            return;
          }
          const body = await response.json().catch(() => null);
          throw new Error(body?.message || "Profile not found");
        }

        const profile = (await response.json()) as Subscription;
        setSubscription(profile);
        setIsEditing(false);
        setUserEmail(profile.email);
      } catch (error) {
        setSubscription(null);
        setIsEditing(true);
      } finally {
        setIsLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    const supabase = createBrowserSupabase();
    let authSubscription: { unsubscribe: () => void } | null = null;

    const checkAuthAndFetchProfile = async () => {
      setIsLoading(true);
      try {
        // Wait a bit for cookies to be set after auth callback
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Try to get session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        let authenticatedEmail: string | null = null;

        if (sessionError || !session) {
          // If no session, try getUser
          const {
            data: { user },
            error: userError,
          } = await supabase.auth.getUser();

          if (userError || !user || !user.email) {
            // Not authenticated - allow form to be shown, but don't fetch profile
            setIsLoading(false);
            return;
          }

          // Additional security: verify email is valid
          if (!user.email || !user.email.includes("@")) {
            setIsLoading(false);
            return;
          }

          authenticatedEmail = user.email;
          setUserEmail(user.email);
          await fetchProfile(user.email);
        } else {
          // Session exists, use it
          if (session.user?.email) {
            authenticatedEmail = session.user.email;
            setUserEmail(session.user.email);
            await fetchProfile(session.user.email);
          } else {
            setIsLoading(false);
            return;
          }
        }

        // Check for pending subscription after auth check
        // Fix Bug 1: Use authenticatedEmail instead of session?.user?.email
        const pendingData = pendingSubscriptionStorage.get();
        if (pendingData && authenticatedEmail === pendingData.email) {
          // Auto-submit pending subscription
          try {
            const response = await fetch("/api/profile", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(pendingData),
            });

            if (response.ok) {
              const savedProfile = (await response.json()) as Subscription;
              pendingSubscriptionStorage.clear();
              setSubscription(savedProfile);
              setIsEditing(false);
              setUserEmail(savedProfile.email);
            }
          } catch {
            // Ignore errors - user can resubmit manually
          }
        }
      } catch (error) {
        // Allow form to be shown even if auth check fails
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    // Set up auth state change listener
    // Fix Bug 2: Move subscription setup outside async function and handle cleanup properly
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        // Session expired or user signed out
        setSubscription(null);
        setUserEmail(null);
        setIsEditing(true);
      } else if (event === "SIGNED_IN" && session?.user?.email) {
        // User signed in - check for pending subscription and fetch profile
        const pending = pendingSubscriptionStorage.get();
        if (pending && session.user.email === pending.email) {
          // Auto-submit pending subscription
          fetch("/api/profile", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(pending),
          })
            .then((res) => res.json())
            .then((profile) => {
              pendingSubscriptionStorage.clear();
              setSubscription(profile);
              setIsEditing(false);
              if (profile.email) {
                setUserEmail(profile.email);
              }
            })
            .catch(() => {
              // Fallback to fetching existing profile
              if (session.user.email) {
                setUserEmail(session.user.email);
                void fetchProfile(session.user.email);
              }
            });
        } else {
          if (session.user.email) {
            setUserEmail(session.user.email);
            void fetchProfile(session.user.email);
          }
        }
      }
    });

    authSubscription = subscription;

    void checkAuthAndFetchProfile();

    // Fix Bug 2: Return cleanup function from useEffect, not from async function
    return () => {
      if (authSubscription) {
        authSubscription.unsubscribe();
      }
    };
  }, [fetchProfile]);

  const handleSuccess = (profile: Subscription) => {
    setSubscription(profile);
    setIsEditing(false);
    setUserEmail(profile.email);
  };

  const handleDelete = async () => {
    if (!subscription) return;
    if (
      !confirm(
        "Are you sure you want to delete your personalized trading profile?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/profile", { method: "DELETE" });

      if (!response.ok) {
        throw new Error("Unable to delete profile");
      }

      // Sign out and clear session after deleting profile
      const supabase = createBrowserSupabase();
      await supabase.auth.signOut();

      // Clear local state
      setSubscription(null);
      setUserEmail(null);
      setIsEditing(true);

      // Redirect to home page
      router.push("/");
    } catch (error) {
      console.error("Failed to delete profile:", error);
      alert("Profil konnte nicht gelöscht werden.");
    }
  };

  const getStockName = (ticker: string) => {
    return AVAILABLE_STOCKS.find((s) => s.ticker === ticker)?.name || ticker;
  };

  const getStockIcon = (ticker: string) => {
    return `https://financialmodelingprep.com/image-stock/${ticker.toUpperCase()}.png`;
  };

  if (isLoading) {
    return (
      <div className="container py-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-6 rounded-lg border bg-muted/40 p-4 text-sm text-muted-foreground">
            Lade vorhandene Einstellungen ...
          </div>
        </div>
      </div>
    );
  }

  if (isEditing) {
    return (
      <div className="container py-10 md:py-20">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 text-center">
            <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              {subscription
                ? "Update Subscription"
                : "Subscribe to Daily Signals"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {subscription
                ? "Modify your email or stock selections below."
                : "Get started by selecting stocks and setting your preferences."}
            </p>
          </div>
          <SubscriptionForm
            initialEmail={initialFormValues.email || ""}
            initialStocks={initialFormValues.stocks}
            initialPreferences={initialFormValues.preferences}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return null;
  }

  return (
    <div className="container py-10 md:py-20">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Your Subscription
          </h1>
          <p className="text-lg text-muted-foreground">
            Manage your daily signal preferences.
          </p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Active Subscription</CardTitle>
                <CardDescription>
                  You're receiving daily signals for the selected stocks.
                </CardDescription>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                  className="w-full sm:w-auto"
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleDelete}
                  className="w-full sm:w-auto"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Account
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="mb-2 text-sm font-medium">Email Address</h3>
              <p className="text-sm text-muted-foreground">
                {subscription?.email}
              </p>
            </div>

            <div>
              <h3 className="mb-4 text-sm font-medium ">
                Selected Stocks ({subscription?.selectedStocks.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {subscription?.selectedStocks.map((ticker) => (
                  <Badge
                    key={ticker}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    <div className="relative h-4 w-4 overflow-hidden rounded ">
                      <Image
                        src={getStockIcon(ticker)}
                        alt={ticker}
                        width={16}
                        height={16}
                        className="object-contain"
                        unoptimized
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = "none";
                        }}
                      />
                    </div>
                    <span className="font-medium">{ticker}</span>
                    <span className="text-xs text-muted-foreground">
                      {getStockName(ticker)}
                    </span>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">
                <strong>Subscription Date:</strong>{" "}
                {subscription?.createdAt
                  ? new Date(subscription.createdAt).toLocaleDateString()
                  : "N/A"}
              </p>
              {subscription?.updatedAt && (
                <p className="mt-1 text-sm text-muted-foreground">
                  <strong>Last Updated:</strong>{" "}
                  {new Date(subscription.updatedAt).toLocaleDateString()}
                </p>
              )}
            </div>

            {subscription?.preferences && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium">Risk Parameters</h3>
                  <div className="mt-2 grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Risikoprofil</p>
                      <p className="font-medium">
                        {getOptionLabel(
                          RISK_PROFILE_OPTIONS,
                          subscription.preferences.riskProfile
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Kapital</p>
                      <p className="font-medium">
                        {currencyFormatter.format(
                          subscription.preferences.capital
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Risiko pro Trade</p>
                      <p className="font-medium">
                        {subscription.preferences.riskPerTrade}%
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Max. gleichzeitige Positionen
                      </p>
                      <p className="font-medium">
                        {subscription.preferences.exposureLimit}
                      </p>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium">Trading-Praeferenzen</h3>
                  <div className="mt-2 grid gap-4 rounded-lg border p-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-muted-foreground">Zeithorizont</p>
                      <p className="font-medium">
                        {getOptionLabel(
                          TIME_HORIZON_OPTIONS,
                          subscription.preferences.timeHorizon
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Earnings/News Verhalten
                      </p>
                      <p className="font-medium">
                        {getOptionLabel(
                          EARNINGS_SENSITIVITY_OPTIONS,
                          subscription.preferences.earningsSensitivity
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Beta Toleranz</p>
                      <p className="font-medium">
                        {getOptionLabel(
                          BETA_TOLERANCE_OPTIONS,
                          subscription.preferences.betaTolerance
                        )}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Entry-Stil</p>
                      <p className="font-medium">
                        {getOptionLabel(
                          ENTRY_PREFERENCE_OPTIONS,
                          subscription.preferences.entryPreference
                        )}
                      </p>
                    </div>
                  </div>
                </div>
                {subscription.preferences.customTicker && (
                  <div className="rounded-lg border p-4 text-sm">
                    <p className="text-muted-foreground">Manueller Ticker</p>
                    <p className="font-medium">
                      {subscription.preferences.customTicker}
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="mt-8 text-center">
          <Link href="/">
            <Button variant="outline">Back to Home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
