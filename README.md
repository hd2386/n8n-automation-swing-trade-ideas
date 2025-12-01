# Overview

This repository contains the n8n workflow **"📈 Daily 5 Swing Trade Signal Bot"**, which technically analyses five U.S. stocks every market day after the close and delivers the findings via email. This document explains how to configure the required environment variables, how the automation works, and which best practices to follow.

## Presentation Video
[▶️ Click to watch](https://drive.google.com/file/d/1-0G6Nb6WZEh_31JPR0xB1EzJKRMWL1Yy/view?usp=sharing)

## Environment Variable Setup

To keep API keys and recipient addresses out of the workflow export, all sensitive information lives in a `.env` file.

1. Create a new `.env` file in the project root:

   ```powershell
   # Windows PowerShell
   New-Item -Path .env -ItemType File
   ```

   ```bash
   # macOS / Linux
   touch .env
   ```

2. Add your real values following this template:

   ```env
   # Alpaca API Keys
   ALPACA_API_KEY_ID=your_alpaca_api_key_id
   ALPACA_API_SECRET_KEY=your_alpaca_api_secret_key

   # Yahoo Finance (RapidAPI) Key
   YAHOO_FINANCE_RAPIDAPI_KEY=your_yahoo_rapidapi_key

   # Daily email recipients
   TRADE_REPORT_RECIPIENTS=mail1@example.com, mail2@example.com

   # Optional: Gemini & Gmail if you prefer environment variables over the n8n credential store
   # GEMINI_API_KEY=your_gemini_api_key
   # GMAIL_CLIENT_ID=your_gmail_client_id
   # GMAIL_CLIENT_SECRET=your_gmail_client_secret
   ```

---

## n8n Workflow

<img width="1330" height="434" alt="görsel_2025-11-12_142515985" src="https://github.com/user-attachments/assets/428e8867-c021-40db-98b8-6ec251e2adf7" />

## E-Mail Template

<img width="634" height="565" alt="image" src="https://github.com/user-attachments/assets/558583fa-7ff9-4464-9e14-9b5682b0f2a4" />
<img width="574" height="676" alt="image" src="https://github.com/user-attachments/assets/a1dbb469-1f9e-437b-a07b-3ddc3b8fb198" />

---

## How the Automation Works

The workflow runs automatically on weekdays shortly after the market closes. The steps in order:

1. **✅ Trigger – Daily Market Close**: Fires Monday through Friday at 16:05 EST (respecting the timezone configured on your n8n instance).
2. **🔢 Prepare Stock List (Personal)**: Randomly picks five tickers from your curated universe so that the analysis rotates through different symbols.
3. **Fetch OHLCV via APCA API**: Retrieves up to 250 daily bars from Alpaca.
4. **Fetch Quote via Rapid API**: Pulls the latest price and fundamental data from the Yahoo Finance RapidAPI endpoint.
5. **Merge**: Combines the historical bars and the quote snapshot into a consolidated payload per ticker.
6. **🧮 Format EOD Data**: Computes technical indicators (RSI, MACD, ATR, Bollinger Bands, moving averages, MFI, etc.).
7. **📊 Filter Valid Stock Data**: Builds the cleaned list in the exact structure expected by the prompt builder.
8. **🗃️ Build LLM Prompt Input**: Creates a detailed German-language prompt that explains the swing-trading strategy step by step.
9. **Message a model (Gemini)**: Sends the prompt to Google Gemini, receiving structured JSON recommendations in return.
10. **Split Trade Recommendations**: Normalises the JSON so each trade idea is processed individually.
11. **📧 Send a message (Gmail)**: Delivers a formatted HTML report to the recipients defined in `TRADE_REPORT_RECIPIENTS`.

> **Important:** The workflow deliberately relies **only on technical market data** (price, volume, indicators). It does **not** consider news, macroeconomic data, fundamentals, or sentiment inputs. Outputs should be treated as technical analysis signals only.

The workflow is configured with retries for network operations and gracefully handles empty/invalid responses from the LLM.

---

## Using Environment Variables in n8n

Inside the workflow, variables are referenced with `{{ $env.VARIABLE_NAME }}`. Examples:

- `{{ $env.ALPACA_API_KEY_ID }}`
- `{{ $env.YAHOO_FINANCE_RAPIDAPI_KEY }}`
- `{{ $env.TRADE_REPORT_RECIPIENTS }}`

n8n substitutes the values at runtime from your `.env` file (or from system environment variables when running on a server).

## Key Files in This Repository

- `system-prompt.js`: Builds the structured prompt handed to Google Gemini, including every rule of the technical trading framework.
- `stocks_list.js`: Maintains the curated list of tickers the workflow samples from each day.
- `n8n-swing-email-template.html`: Provides the HTML email layout used by the Gmail node to deliver the daily report.
- `web/`: Next.js frontend that collects trader preferences and stores them in Supabase. See `web/env.example` for the required Supabase variables.

### Personalization API & Supabase

1. Launch the web UI (`web/` folder) and submit the subscription form. The form persists the following payload in Supabase (`trader_profiles` table): email, selected stocks, and a `preferences` JSON (risk profile, capital, earnings sensitivity, etc.).
2. n8n can fetch a profile by calling the deployed website endpoint:

   ```
   GET https://your-domain.com/api/profile?email=trader@example.com
   ```

   The response matches the `Subscription` type from `web/types/index.ts`.

3. In n8n, insert an HTTP Request node before `Build LLM Prompt Input`, store the JSON response in `$json.userProfile`, and then send that object along with the stock data into `system-prompt.js`.
4. `system-prompt.js` now automatically adds a **Benutzerprofil** section and adapts stop-loss, timeframe, exposure and entry-style guidance based on those preferences. Missing fields fall back to sensible defaults (`DEFAULT_TRADER_PREFERENCES`).

## Best Practices

- Double-check that your API keys are still valid (RapidAPI and Alpaca in particular).
- When the recipient list changes, update **only** the `.env` file—no workflow edits required.
- Google Gemini and Gmail are managed with n8n credential nodes. The IDs you see in the exported JSON are references only; they do not contain secrets.

## Security

- Keep `.env` local; it is excluded from Git via `.gitignore`.
- Share the workflow only without API keys. Using environment variables ensures the exported JSON stays clean.
- For production use, protect your n8n instance (VPN, reverse proxy with authentication, etc.).

> ⚠️ **Disclaimer:** The generated trade ideas are for educational/technical-analysis purposes only and do **not** constitute investment advice.

Happy automating and good luck with your trades! 🚀
