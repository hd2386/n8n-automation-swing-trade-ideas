import { PROFILE_EMAIL_STORAGE_KEY } from "./constants";

const isBrowser = typeof window !== "undefined";

export const profileEmailStorage = {
  get(): string | null {
    if (!isBrowser) return null;
    try {
      return localStorage.getItem(PROFILE_EMAIL_STORAGE_KEY);
    } catch (error) {
      console.error("Error reading profile email from storage:", error);
      return null;
    }
  },
  set(email: string): void {
    if (!isBrowser) return;
    try {
      localStorage.setItem(PROFILE_EMAIL_STORAGE_KEY, email);
    } catch (error) {
      console.error("Error saving profile email to storage:", error);
    }
  },
  clear(): void {
    if (!isBrowser) return;
    try {
      localStorage.removeItem(PROFILE_EMAIL_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing profile email from storage:", error);
    }
  },
};
