# Profile Personalization Playbook

## Data Flow Overview

1. **Web Form (`/subscribe`)** collects email, watchlist, and all trader preferences.
2. **Supabase** stores the payload in `public.trader_profiles` (see `supabase/migrations/0001_create_trader_profiles.sql`).
3. **Next.js API (`/api/profile`)** exposes CRUD operations for n8n or the UI.
4. **n8n HTTP Request** fetches the profile by email and attaches it as `$json.userProfile`.
5. **`system-prompt.js`** injects the profile context and adapts rules (risk, stops, exposure, entry preference, earnings sensitivity).

## Example Profile Payload

```json
{
  "email": "swing@example.com",
  "selectedStocks": ["NVDA", "MSFT", "PLTR"],
  "preferences": {
    "riskProfile": "balanced",
    "capital": 25000,
    "riskPerTrade": 2,
    "timeHorizon": "standard",
    "earningsSensitivity": "neutral",
    "betaTolerance": "medium",
    "exposureLimit": 5,
    "customTicker": "TSM",
    "entryPreference": "pullback"
  }
}
```

## Manual Test Cases

1. **API roundtrip**

   ```bash
   curl -X POST https://your-domain.com/api/profile \
     -H "Content-Type: application/json" \
     -d @tests/fixtures/profile-balanced.json

   curl "https://your-domain.com/api/profile?email=swing@example.com"
   ```

   Verify the response matches the stored payload (capital, exposure limit, etc.).

2. **Prompt personalization snapshot**

   - In n8n, inject the profile JSON into the Function node running `system-prompt.js`.
   - Ensure the rendered prompt contains the `### BENUTZERPROFIL ###` section with the correct values.
   - Confirm that the guidance strings (risk profile, entry preference, earnings sensitivity) match the chosen options.

3. **Earnings guardrail switch**

   - Update `earningsSensitivity` to `strict`, rerun the prompt builder, and check that the strategy section now references the stricter Hold logic (<7 days).

4. **Exposure limit enforcement**
   - Set `exposureLimit` to 1, feed more than one qualifying stock into the Function node, and verify that extra stocks are marked `Hold` with a suggestion referencing the limit.

Documenting these checks ensures the personalization layer works end-to-end before shipping changes to the n8n workflow.
