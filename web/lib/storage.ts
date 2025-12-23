const isBrowser = typeof window !== "undefined";

const PENDING_SUBSCRIPTION_KEY = "pending_subscription";

export const pendingSubscriptionStorage = {
  get() {
    if (!isBrowser) return null;
    try {
      const stored = localStorage.getItem(PENDING_SUBSCRIPTION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
  set(data: any) {
    if (!isBrowser) return;
    try {
      localStorage.setItem(PENDING_SUBSCRIPTION_KEY, JSON.stringify(data));
    } catch {
      // Ignore storage errors
    }
  },
  clear() {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(PENDING_SUBSCRIPTION_KEY);
    } catch {
      // Ignore storage errors
    }
  },
};
