"use client";

import { useEffect, useState } from "react";
import { subscriptionStorage } from "@/lib/storage";
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
import { AVAILABLE_STOCKS } from "@/lib/constants";
import { Edit2, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SubscribePage() {
  const [subscription, setSubscription] = useState(subscriptionStorage.get());
  const [isEditing, setIsEditing] = useState(!subscription);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleSuccess = () => {
    setSubscription(subscriptionStorage.get());
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete your subscription?")) {
      subscriptionStorage.delete();
      setSubscription(null);
      setIsEditing(true);
    }
  };

  const getStockName = (ticker: string) => {
    return AVAILABLE_STOCKS.find((s) => s.ticker === ticker)?.name || ticker;
  };

  const getStockIcon = (ticker: string) => {
    // Using TradingView logo service (more reliable and up-to-date)
    return `https://s3-symbol-logo.tradingview.com/${ticker.toLowerCase()}.svg`;
  };

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
                : "Get started by entering your email and selecting stocks."}
            </p>
          </div>
          <SubscriptionForm
            initialEmail={subscription?.email || ""}
            initialStocks={subscription?.selectedStocks || []}
            onSuccess={handleSuccess}
          />
        </div>
      </div>
    );
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
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Active Subscription</CardTitle>
                <CardDescription>
                  You're receiving daily signals for the selected stocks.
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit2 className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="destructive" size="sm" onClick={handleDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
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
              <h3 className="mb-4 text-sm font-medium">
                Selected Stocks ({subscription?.selectedStocks.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2">
                {subscription?.selectedStocks.map((ticker) => (
                  <Badge
                    key={ticker}
                    variant="secondary"
                    className="flex items-center gap-2 px-3 py-1.5"
                  >
                    <div className="relative h-4 w-4 overflow-hidden rounded bg-muted flex items-center justify-center">
                      {failedImages.has(ticker) ? (
                        <span className="text-[10px] font-bold text-muted-foreground">
                          {ticker[0]}
                        </span>
                      ) : (
                        <Image
                          src={getStockIcon(ticker)}
                          alt={ticker}
                          width={16}
                          height={16}
                          className="object-contain"
                          unoptimized
                          onError={() => {
                            setFailedImages((prev) =>
                              new Set(prev).add(ticker)
                            );
                          }}
                        />
                      )}
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
