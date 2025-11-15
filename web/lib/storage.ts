import { Subscription } from "@/types";
import { STORAGE_KEY } from "./constants";

/**
 * Storage abstraction layer for subscriptions
 * Currently uses localStorage, but can be easily swapped for API calls
 */
export const subscriptionStorage = {
  /**
   * Save or update a subscription
   */
  save(
    subscription: Omit<Subscription, "createdAt" | "updatedAt">
  ): Subscription {
    const now = new Date().toISOString();
    const existing = this.get();

    const newSubscription: Subscription = {
      ...subscription,
      createdAt: existing?.createdAt || now,
      updatedAt: now,
    };

    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSubscription));
    }

    return newSubscription;
  },

  /**
   * Get the current subscription
   */
  get(): Subscription | null {
    if (typeof window === "undefined") {
      return null;
    }

    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return null;

      return JSON.parse(data) as Subscription;
    } catch (error) {
      console.error("Error reading subscription from storage:", error);
      return null;
    }
  },

  /**
   * Update an existing subscription
   */
  update(
    updates: Partial<Omit<Subscription, "createdAt" | "updatedAt">>
  ): Subscription | null {
    const existing = this.get();
    if (!existing) {
      return null;
    }

    return this.save({
      email: updates.email ?? existing.email,
      selectedStocks: updates.selectedStocks ?? existing.selectedStocks,
    });
  },

  /**
   * Delete the subscription
   */
  delete(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
  },

  /**
   * Check if a subscription exists
   */
  exists(): boolean {
    return this.get() !== null;
  },
};
