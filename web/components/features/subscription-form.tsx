"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  subscriptionSchema,
  type SubscriptionFormData,
} from "@/lib/validation";
import { subscriptionStorage } from "@/lib/storage";
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

interface SubscriptionFormProps {
  initialEmail?: string;
  initialStocks?: string[];
  onSuccess?: () => void;
}

export function SubscriptionForm({
  initialEmail = "",
  initialStocks = [],
  onSuccess,
}: SubscriptionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      email: initialEmail,
      selectedStocks: initialStocks,
    },
  });

  const onSubmit = async (data: SubscriptionFormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      subscriptionStorage.save({
        email: data.email,
        selectedStocks: data.selectedStocks,
      });

      setIsSuccess(true);
      form.reset();

      if (onSuccess) {
        setTimeout(() => {
          onSuccess();
        }, 1500);
      }
    } catch (error) {
      console.error("Error saving subscription:", error);
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
              You'll start receiving daily signals soon.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscribe to Daily Signals</CardTitle>
        <CardDescription>
          Enter your email and select up to 5 stocks to receive daily technical
          analysis reports.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
