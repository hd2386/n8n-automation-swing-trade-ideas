export type RiskProfile = "defensive" | "balanced" | "aggressive";
export type TimeHorizon = "short" | "standard" | "flexible";
export type EarningsSensitivity = "strict" | "neutral" | "opportunistic";
export type BetaTolerance = "low" | "medium" | "high";
export type EntryPreference = "pullback" | "breakout" | "balanced";

export interface TraderPreferences {
  riskProfile: RiskProfile;
  capital: number;
  riskPerTrade: number;
  timeHorizon: TimeHorizon;
  earningsSensitivity: EarningsSensitivity;
  betaTolerance: BetaTolerance;
  exposureLimit: number;
  customTicker: string;
  entryPreference: EntryPreference;
}

export interface Subscription {
  email: string;
  selectedStocks: string[];
  preferences: TraderPreferences;
  createdAt: string;
  updatedAt: string;
}

export interface Stock {
  ticker: string;
  name: string;
}

export interface WorkflowStep {
  title: string;
  description: string;
  icon?: string;
}
