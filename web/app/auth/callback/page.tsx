"use client";

import { useEffect, useState, Suspense } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { useRouter, useSearchParams } from "next/navigation";
import { pendingSubscriptionStorage } from "@/lib/storage";

function AuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/subscribe";
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const supabase = createBrowserSupabase();

        // Validate next parameter to prevent open redirects
        const safeNext =
          rawNext.startsWith("/") && !rawNext.startsWith("//")
            ? rawNext
            : "/subscribe";

        // Magic links from Supabase may include hash tokens
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1)
        );
        const accessToken = hashParams.get("access_token");
        const refreshToken = hashParams.get("refresh_token");
        const type = hashParams.get("type");

        // 1) Prefer implicit hash tokens (magic link)
        if (accessToken && refreshToken) {
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          });

          if (!sessionError && data.session) {
            // Clear hash from URL for security
            window.history.replaceState(
              null,
              "",
              window.location.pathname + window.location.search
            );

            // Check if there's pending subscription data to submit
            const pendingData = pendingSubscriptionStorage.get();
            if (pendingData && data.user?.email === pendingData.email) {
              // Submit pending subscription
              try {
                const response = await fetch("/api/profile", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(pendingData),
                });

                if (response.ok) {
                  pendingSubscriptionStorage.clear();
                }
              } catch {
                // Ignore errors - user can resubmit manually
              }
            }

            router.push(safeNext);
            return;
          }
        }

        // 2) If there's a code, attempt PKCE exchange (OAuth/OTP flows)
        if (code) {
          const { data, error: exchangeError } =
            await supabase.auth.exchangeCodeForSession(code);

          if (!exchangeError && data.session) {
            // Check if there's pending subscription data to submit
            const pendingData = pendingSubscriptionStorage.get();
            if (pendingData && data.user?.email === pendingData.email) {
              // Submit pending subscription
              try {
                const response = await fetch("/api/profile", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(pendingData),
                });

                if (response.ok) {
                  pendingSubscriptionStorage.clear();
                }
              } catch {
                // Ignore errors - user can resubmit manually
              }
            }

            router.push(safeNext);
            return;
          }
        }

        // 3) Fallback: check for existing session
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          setError("Session error. Please try logging in again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/login?error=auth_failed");
          }, 2000);
          return;
        }

        if (session) {
          router.push(safeNext);
        } else {
          setError("No session found. Please try logging in again.");
          setLoading(false);
          setTimeout(() => {
            router.push("/login");
          }, 2000);
        }
      } catch (err) {
        setError("An unexpected error occurred. Please try again.");
        setLoading(false);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    void handleCallback();
  }, [code, rawNext, router]);

  if (error) {
    return (
      <div className="container flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">Authentication Error</h1>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Redirecting to login...
          </p>
        </div>
      </div>
    );
  }

  if (!loading) {
    return null;
  }

  return (
    <div className="container flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
        <p>Completing sign in...</p>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  );
}
