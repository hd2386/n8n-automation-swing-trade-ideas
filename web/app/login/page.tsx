"use client";

import { useState, Suspense } from "react";
import { createBrowserSupabase } from "@/lib/supabase-browser";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawNext = searchParams.get("next") || "/subscribe";
  // Validate next parameter to prevent open redirects
  const next =
    rawNext.startsWith("/") && !rawNext.startsWith("//")
      ? rawNext
      : "/subscribe";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const supabase = createBrowserSupabase();

      // Use signInWithOtp without PKCE for magic links
      // The magic link will contain a hash that Supabase can verify
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${
            window.location.origin
          }/auth/callback?next=${encodeURIComponent(next)}`,
          shouldCreateUser: true, // Auto-create user if doesn't exist
        },
      });

      if (error) {
        throw error;
      }

      setMessage({
        type: "success",
        text: "Check your email for the login link!",
      });
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to send login link",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container flex min-h-screen items-center justify-center py-10">
      <div className="mx-auto w-full max-w-md">
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
            <CardDescription>
              Enter your email to receive a magic link for instant access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {message && (
                <span
                  className={`block rounded-md px-3 py-2 text-sm font-medium ${
                    message.type === "success"
                      ? "text-primary"
                      : "text-destructive"
                  }`}
                  role="alert"
                >
                  {message.text}
                </span>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Sending..." : "Send Magic Link"}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Don't have an account? Subscribe to get started.</p>
            </div>

            <div className="mt-4 text-center">
              <Link href="/subscribe">
                <Button variant="outline" className="w-full">
                  Subscribe
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="container flex min-h-screen items-center justify-center py-10">
          <div className="mx-auto w-full max-w-md">
            <Card>
              <CardHeader>
                <CardTitle>Sign In</CardTitle>
                <CardDescription>Loading...</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
