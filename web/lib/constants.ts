import { Stock, TraderPreferences, WorkflowStep } from "@/types";

// Stock list extracted from n8n workflow
export const AVAILABLE_STOCKS: Stock[] = [
  { ticker: "PLTR", name: "Palantir Technologies Inc." },
  { ticker: "HOOD", name: "Robinhood Markets, Inc." },
  { ticker: "HIMS", name: "Hims & Hers Health, Inc." },
  { ticker: "APP", name: "AppLovin Corporation" },
  { ticker: "RKLB", name: "Rocket Lab USA, Inc." },
  { ticker: "TEM", name: "Tempus AI Inc." },
  { ticker: "SOFI", name: "SoFi Technologies, Inc." },
  { ticker: "OSCR", name: "Oscar Health, Inc." },
  { ticker: "IREN", name: "Iris Energy Limited" },
  { ticker: "NVDA", name: "NVIDIA Corporation" },
  { ticker: "BMNR", name: "Bitmine Immersion Technologies Inc." },
  { ticker: "SMCI", name: "Super Micro Computer, Inc." },
  { ticker: "LMND", name: "Lemonade, Inc." },
  { ticker: "CIFR", name: "Cipher Mining Inc." },
  { ticker: "CEG", name: "Constellation Energy Corporation" },
  { ticker: "ANET", name: "Arista Networks, Inc." },
  { ticker: "CLS", name: "Celestica Inc." },
  { ticker: "ORCL", name: "Oracle Corporation" },
  { ticker: "OPEN", name: "Opendoor Technologies Inc." },
  { ticker: "TSLA", name: "Tesla, Inc." },
  { ticker: "ZETA", name: "Zeta Global Holdings Corp." },
  { ticker: "RGTI", name: "Rigetti Computing, Inc." },
  { ticker: "ASTS", name: "AST SpaceMobile, Inc." },
  { ticker: "OKLO", name: "Oklo Inc." },
  { ticker: "AMD", name: "Advanced Micro Devices, Inc." },
  { ticker: "EOSE", name: "Eos Energy Enterprises, Inc." },
  { ticker: "IONQ", name: "IonQ, Inc." },
  { ticker: "CRWD", name: "CrowdStrike Holdings, Inc." },
  { ticker: "ASML", name: "ASML Holding N.V." },
  { ticker: "META", name: "Meta Platforms, Inc." },
  { ticker: "AVGO", name: "Broadcom Inc." },
  { ticker: "BA", name: "The Boeing Company" },
  { ticker: "AAPL", name: "Apple Inc." },
  { ticker: "MSFT", name: "Microsoft Corporation" },
  { ticker: "AMZN", name: "Amazon.com, Inc." },
  { ticker: "GOOG", name: "Alphabet Inc." },
  { ticker: "ADBE", name: "Adobe Inc." },
  { ticker: "MDB", name: "MongoDB, Inc." },
  { ticker: "MRVL", name: "Marvell Technology, Inc." },
  { ticker: "DDOG", name: "Datadog, Inc." },
  { ticker: "MSTR", name: "MicroStrategy Incorporated" },
  { ticker: "AXON", name: "Axon Enterprise, Inc." },
  { ticker: "UNH", name: "UnitedHealth Group Incorporated" },
  { ticker: "LLY", name: "Eli Lilly and Company" },
  { ticker: "ALAB", name: "Astera Labs, Inc." },
  { ticker: "CRM", name: "Salesforce, Inc." },
  { ticker: "DUOL", name: "Duolingo, Inc." },
  { ticker: "SE", name: "Sea Limited" },
  { ticker: "GRAB", name: "Grab Holdings Limited" },
  { ticker: "CELH", name: "Celsius Holdings, Inc." },
  { ticker: "CRDO", name: "Credo Technology Group Holding Ltd" },
  { ticker: "MU", name: "Micron Technology, Inc." },
  { ticker: "TTD", name: "The Trade Desk, Inc." },
  { ticker: "DLO", name: "DLocal Limited" },
  { ticker: "LEU", name: "Centrus Energy Corp." },
  { ticker: "SNOW", name: "Snowflake Inc." },
  { ticker: "COIN", name: "Coinbase Global, Inc." },
  { ticker: "V", name: "Visa Inc." },
  { ticker: "BKSY", name: "BlackSky Technology Inc." },
  { ticker: "AMPX", name: "Amprius Technologies, Inc." },
  { ticker: "NVTS", name: "Navitas Semiconductor Corporation" },
  { ticker: "JOBY", name: "Joby Aviation, Inc." },
  { ticker: "QUBT", name: "Quantum Computing Inc." },
  { ticker: "ABNB", name: "Airbnb, Inc." },
  { ticker: "BKNG", name: "Booking Holdings Inc." },
  { ticker: "MCHP", name: "Microchip Technology Incorporated" },
  { ticker: "NFLX", name: "Netflix, Inc." },
  { ticker: "PYPL", name: "PayPal Holdings, Inc." },
  { ticker: "QCOM", name: "QUALCOMM Incorporated" },
  { ticker: "SHOP", name: "Shopify Inc." },
  { ticker: "WDAY", name: "Workday, Inc." },
  { ticker: "JPM", name: "JPMorgan Chase & Co." },
  { ticker: "MA", name: "Mastercard Incorporated" },
  { ticker: "WMT", name: "Walmart Inc." },
  { ticker: "SPOT", name: "Spotify Technology S.A." },
  { ticker: "MS", name: "Morgan Stanley" },
  { ticker: "INTC", name: "Intel Corporation" },
  { ticker: "CSCO", name: "Cisco Systems, Inc." },
  { ticker: "PEP", name: "PepsiCo, Inc." },
  { ticker: "COST", name: "Costco Wholesale Corporation" },
  { ticker: "CMCSA", name: "Comcast Corporation" },
  { ticker: "TXN", name: "Texas Instruments Incorporated" },
  { ticker: "GILD", name: "Gilead Sciences, Inc." },
  { ticker: "SBUX", name: "Starbucks Corporation" },
  { ticker: "ISRG", name: "Intuitive Surgical, Inc." },
  { ticker: "MDLZ", name: "Mondelez International, Inc." },
  { ticker: "ADI", name: "Analog Devices, Inc." },
  { ticker: "VRTX", name: "Vertex Pharmaceuticals Incorporated" },
  { ticker: "REGN", name: "Regeneron Pharmaceuticals, Inc." },
  { ticker: "LRCX", name: "Lam Research Corporation" },
  { ticker: "KLAC", name: "KLA Corporation" },
  { ticker: "AEP", name: "American Electric Power Company, Inc." },
  { ticker: "CTAS", name: "Cintas Corporation" },
  { ticker: "MAR", name: "Marriott International, Inc." },
  { ticker: "PANW", name: "Palo Alto Networks, Inc." },
];

// Workflow steps from README
export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Profile Intake",
    description:
      "Trader defines risk profile, capital, exposure limit and optional manual ticker for personalization.",
  },
  {
    title: "Market Data Sync",
    description:
      "Pulls the user-selected tickers (1-5) plus the manual ticker from Alpaca/Yahoo Finance with full indicator set.",
  },
  {
    title: "Prompt Builder",
    description:
      "n8n merges the technical snapshot with the saved profile and produces a structured German prompt for Gemini 2.5 Pro.",
  },
  {
    title: "Signal Delivery",
    description:
      "Gemini returns personalized swing trade JSON which is forwarded to the subscriber via email or webhook.",
  },
];

export const RISK_PROFILE_VALUES = [
  "defensive",
  "balanced",
  "aggressive",
] as const;

export const TIME_HORIZON_VALUES = ["short", "standard", "flexible"] as const;

export const EARNINGS_SENSITIVITY_VALUES = [
  "strict",
  "neutral",
  "opportunistic",
] as const;

export const BETA_TOLERANCE_VALUES = ["low", "medium", "high"] as const;

export const ENTRY_PREFERENCE_VALUES = [
  "pullback",
  "breakout",
  "balanced",
] as const;

export const RISK_PROFILE_OPTIONS = [
  {
    value: RISK_PROFILE_VALUES[0],
    label: "Defensiv – Fokus auf Kapitalerhalt",
  },
  { value: RISK_PROFILE_VALUES[1], label: "Ausgewogen – 2-4R Chance" },
  {
    value: RISK_PROFILE_VALUES[2],
    label: "Aggressiv – Momentum & hohes Risiko",
  },
] as const;

export const TIME_HORIZON_OPTIONS = [
  { value: TIME_HORIZON_VALUES[0], label: "Kurzfristig (1-2 Wochen)" },
  { value: TIME_HORIZON_VALUES[1], label: "Standard (2-4 Wochen)" },
  { value: TIME_HORIZON_VALUES[2], label: "Flexibel (1-4 Wochen)" },
] as const;

export const EARNINGS_SENSITIVITY_OPTIONS = [
  {
    value: EARNINGS_SENSITIVITY_VALUES[0],
    label: "Strikt – Kein Trading <7 Tage vor Earnings",
  },
  { value: EARNINGS_SENSITIVITY_VALUES[1], label: "Neutral – Standard-Regeln" },
  {
    value: EARNINGS_SENSITIVITY_VALUES[2],
    label: "Opportunistisch – Earnings als Chance",
  },
] as const;

export const BETA_TOLERANCE_OPTIONS = [
  { value: BETA_TOLERANCE_VALUES[0], label: "≤ 1.0 – Nur stabile Titel" },
  { value: BETA_TOLERANCE_VALUES[1], label: "≤ 1.5 – Gemischtes Risiko" },
  { value: BETA_TOLERANCE_VALUES[2], label: "> 1.5 – Hohes Momentum erlaubt" },
] as const;

export const ENTRY_PREFERENCE_OPTIONS = [
  { value: ENTRY_PREFERENCE_VALUES[0], label: "Pullback / Mean Reversion" },
  { value: ENTRY_PREFERENCE_VALUES[1], label: "Breakout / Momentum" },
  { value: ENTRY_PREFERENCE_VALUES[2], label: "Ausgewogen" },
] as const;

export const DEFAULT_TRADER_PREFERENCES: TraderPreferences = {
  riskProfile: "balanced",
  capital: 25000,
  riskPerTrade: 2,
  timeHorizon: "standard",
  earningsSensitivity: "neutral",
  betaTolerance: "medium",
  exposureLimit: 5,
  customTicker: "",
  entryPreference: "balanced",
};

export const PROFILE_EMAIL_STORAGE_KEY = "n8n-trade-profile-email";
