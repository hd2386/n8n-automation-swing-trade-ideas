const stocks = $json.stocks;
const profileDefaults = {
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

const userProfile = {
  ...profileDefaults,
  ...($json.userProfile || {}),
};

const entryPreferenceGuidance = {
  pullback:
    "Priorisiere Pullback-Setups (EMA20/BB Middle/SMA50). Breakouts nur, wenn der Trend außergewöhnlich stark ist.",
  breakout:
    "Momentum-orientiert: Breakouts mit starkem Volumen bevorzugen, Pullbacks nur bei klarer Trendbestätigung.",
  balanced:
    "Nutze Pullback- und Breakout-Signale gleichwertig; entscheide anhand von Momentum/Volumen.",
};

const riskProfileGuidance = {
  defensive:
    "Defensives Profil: Setze eher konservative Stops (1.2-1.5x ATR), nur sehr saubere Trends handeln, bevorzugt 2-4 Wochen Haltezeit.",
  balanced:
    "Ausgewogenes Profil: Standard Stops (1.5x ATR). Kombination aus Trend- und Mean-Reversion-Setups erlaubt.",
  aggressive:
    "Aggressives Profil: Momentum bevorzugt, Stops bis 2x ATR zulässig. Höhere Beta-Werte akzeptabel, aber klar dokumentieren.",
};

const earningsSensitivityGuidance = {
  strict:
    "Strict Earnings Mode: Setze bereits ab <7 Tagen vor Earnings automatisch auf Hold und weise explizit auf Earnings-Risiko hin.",
  neutral:
    "Standard Earnings Mode: Nutze bestehende Regeln (Hold bei <3 Tagen, Pre-Earnings bei 3-14 Tagen).",
  opportunistic:
    "Opportunistic Mode: Pre-Earnings Trades erlaubt, jedoch Grund für erhöhtes Risiko im Reason-Feld erläutern.",
};

const betaToleranceGuidance = {
  low: "Beta <= 1 bevorzugen. Bei Beta > 1 ausdrücklich begründen und Stop enger halten (1.2x ATR).",
  medium:
    "Beta <= 1.5 akzeptiert. Standard Stop-Logik verwenden, hohe Beta nur mit Momentum-Bestätigung.",
  high: "Hohe Beta zugelassen (>1.5). Nutze 2x ATR Stops und verkürzte Timeframes (1-2 Wochen).",
};

const profileContext = `### BENUTZERPROFIL ###
- Risiko-Profil: ${userProfile.riskProfile} (${
  riskProfileGuidance[userProfile.riskProfile]
})
- Kapital: ${userProfile.capital} USD | Risiko pro Trade: ${
  userProfile.riskPerTrade
}%
- Zeithorizont: ${userProfile.timeHorizon}
- Earnings-Sensitivität: ${userProfile.earningsSensitivity} (${
  earningsSensitivityGuidance[userProfile.earningsSensitivity]
})
- Beta-Toleranz: ${userProfile.betaTolerance} (${
  betaToleranceGuidance[userProfile.betaTolerance]
})
- Exposure-Limit: Max. ${userProfile.exposureLimit} gleichzeitige Signale.
- Entry-Präferenz: ${userProfile.entryPreference} (${
  entryPreferenceGuidance[userProfile.entryPreference]
})
- Wunsch-Ticker (falls nicht in Liste): ${
  userProfile.customTicker || "keine Vorgabe"
}

### PERSONALISIERTE REGELN ###
1. Passe Stop-Loss Multiplikatoren, Timeframes und Richtung der Signale an das Risiko- und Beta-Profil an (siehe oben).
2. Überschreite das Exposure-Limit nicht – wenn bereits ${
  userProfile.exposureLimit
} aktive Trades vorgeschlagen würden, zusätzliche Aktien als 'Hold' markieren und einen konkreten zukünftigen Einstieg beschreiben.
3. Entry-Präferenz beachten: ${
  entryPreferenceGuidance[userProfile.entryPreference]
}
4. Earnings-Sensitivität anwenden: ${
  earningsSensitivityGuidance[userProfile.earningsSensitivity]
}
5. Wenn ein Wunsch-Ticker hinterlegt ist (${
  userProfile.customTicker || "keiner"
}), beziehe ihn in die Begründungen ein (z. B. Alternativen oder Szenarien).`;

let formattedStocks = stocks
  .map((stock) => {
    return `Firma: ${stock.name} (${stock.symbol})
Price: ${stock.price}
Open: ${stock.open}
High: ${stock.dayHigh}
Low: ${stock.dayLow}
Prev Close: ${stock.prevClose}
Change %: ${stock.changePercent}
Volume: ${stock.volume}
Avg Volume (10D): ${stock.avgVolume10D}
Avg Volume (3M): ${stock.avgVolume3M}
50DMA: ${stock.fiftyDayAvg}
200DMA: ${stock.twoHundredDayAvg}
52W High: ${stock.fiftyTwoWeekHigh}
52W Low: ${stock.fiftyTwoWeekLow}
Beta: ${stock.beta}
Volume vs Avg(10D): ${stock.volumeVsAvg10D}
Earnings in Days: ${stock.earningsInDays}
Short Ratio: ${stock.shortRatio}
Market Cap: ${stock.marketCap}
Target Price (Mean): ${stock.targetPriceMean}
Target Price (High): ${stock.targetPriceHigh}
Target Price (Low): ${stock.targetPriceLow}
Earnings Date: ${stock.earningsDate || "N/A"}
RSI(14): ${stock.rsi14}
MACD Line (12-26): ${stock.macd}
MACD Signal (9): ${stock.macdSignal}
MACD Histogram: ${stock.macdHist}
ATR(14): ${stock.atr14}
Bollinger Upper: ${stock.bbUpper}
Bollinger Middle: ${stock.bbMiddle}
Bollinger Lower: ${stock.bbLower}
SMA20: ${stock.sma20}
SMA50: ${stock.sma50}
EMA20: ${stock.ema20}
EMA50: ${stock.ema50}
MFI(14): ${stock.mfi14}`;
  })
  .join("\n\n");

return [
  {
    json: {
      prompt: `Du bist ein Swing Trading Assistent für US-Aktien und ein Experte für technische Analyse. Dein Ziel ist es, aus den bereitgestellten Daten Swing Trading Entscheidungen zu generieren, **indem du einen ausgewogenen Ansatz verfolgst, der weder zu viele noch zu wenige Signale erzeugt**.

${profileContext}

### ANZUWENDENDE STRATEGIE ###

1. **Haupttrend-Filter:**
* **Für Buy-Signal:** Selbst wenn der Preis bis zu 5% unter dem 200DMA liegt (Preis ≥ 200DMA × 0,95), **sind Kaufpositionen erlaubt, wenn die Bedingungen des mittelfristigen Trends (Schritt 2) erfüllt sind**. Normalerweise sollte der Preis über dem 200DMA liegen.
* **Für Sell-Signal:** Selbst wenn der Preis bis zu 5% über dem 200DMA liegt (Preis ≤ 200DMA × 1,05), **sind Verkaufspositionen erlaubt, wenn die Bedingungen des mittelfristigen Trends (Schritt 2) erfüllt sind**. Normalerweise sollte der Preis unter dem 200DMA liegen.
* Falls der mittelfristige Trend ebenfalls nicht eindeutig ist, wird die Aktie als 'Hold' bewertet.

2. **Mittelfristiger Trend:**
* **Für Buy-Signal:** 
  - OPTIMAL: EMA20 > EMA50 UND Preis > EMA50.
  - AKZEPTABEL (Übergangszone): Wenn EMA20 innerhalb 2% von EMA50 liegt UND Preis > EMA20 UND MACD Line > Signal Line UND MACD Histogram > 0 → Buy möglich bei starkem Momentum.
* **Für Sell-Signal:** 
  - OPTIMAL: EMA20 < EMA50 UND Preis < EMA50.
  - AKZEPTABEL (Übergangszone): Wenn EMA20 innerhalb 2% von EMA50 liegt UND Preis < EMA20 UND MACD Line < Signal Line UND MACD Histogram < 0 → Sell möglich bei schwachem Momentum.

3. **Einstiegssignal (Entry):**
* **WICHTIG:** Da nur aktuelle EOD-Daten (End-of-Day) vorliegen, wird geprüft, ob der aktuelle Preis innerhalb der Entry-Zonen liegt. Dies simuliert die Bedingung, dass der Preis in den letzten 5-7 Bars (Handelstagen) diese Zonen erreicht hat.

* **Buy:** Der Preis muss aktuell eine der folgenden Bedingungen erfüllen:
  - Pullback zum EMA20: Preis innerhalb \`2 * ATR(14)\` von EMA20, ODER
  - Pullback zum Bollinger Middle Band: Preis innerhalb \`1,5 * ATR(14)\` von bbMiddle, ODER
  - Pullback zum SMA50: Preis innerhalb \`2 * ATR(14)\` von SMA50 UND MACD Line > 0.

* **Sell:** Der Preis muss aktuell eine der folgenden Bedingungen erfüllen:
  - Bounce zum EMA20: Preis innerhalb \`2 * ATR(14)\` von EMA20, ODER
  - Bounce zum Bollinger Middle Band: Preis innerhalb \`1,5 * ATR(14)\` von bbMiddle, ODER
  - Widerstand am SMA50: Preis innerhalb \`2 * ATR(14)\` von SMA50 UND MACD Line < 0.

* **Entry-Level:** Wenn die Bedingung erfüllt ist: Entry = \`currentPrice\`.

4. **Bestätigungssignale (Confirmation):**
* **RSI(14):** 
  - Für Buy: RSI zwischen 35-65 (optimal 40-60). RSI > 65 = hohes Risiko, aber mit starkem Momentum akzeptabel.
  - Für Sell: RSI zwischen 35-65 (optimal 40-60). RSI < 35 = hohes Risiko, aber bei Abwärtstrend akzeptabel.
* **MACD:** 
  - Für Buy: 
    * OPTIMAL: MACD Line > Signal Line UND Histogram > 0
    * AKZEPTABEL: Nur Histogram > 0 (aber Line < Signal) = schwächeres Signal, nur bei starkem Trend akzeptabel
  - Für Sell: 
    * OPTIMAL: MACD Line < Signal Line UND Histogram < 0
    * AKZEPTABEL: Nur Histogram < 0 (aber Line > Signal) = schwächeres Signal, nur bei starkem Trend akzeptabel
* **MFI(14):** Für Buy unter 75, für Sell über 25.
* **Volumen:** Hohes Volumen (\`volumeVsAvg10D > 1.2\`) wirkt sich positiv als Bestätigungssignal aus und erhöht die Signalqualität. Bei \`volumeVsAvg10D < 0.8\` = schwaches Signal, Vorsicht geboten.
* **Beta:** Wenn Beta über 1,5 liegt, sollte Stop Loss auf \`2 * ATR(14)\` erweitert werden und Zeitrahmen verkürzt werden (1-2 Wochen statt 2-4).

### AUSGABE-REGELN ###

* Erstelle für jede Aktie ein JSON-Objekt im folgenden Format. **Für 'Hold'-Entscheidungen ist das 'suggestion'-Feld zwingend auszufüllen!**
{
    "symbol": "...",
    "name": "...",
    "currentPrice": ...,
    "direction": "Buy", "Sell" oder "Hold",
    "entry": ...,
    "target": ...,
    "stopLoss": ...,
    "timeFrame": "... Tage" oder "... Wochen",
    "riskRewardRatio": ...,
    "reason": "...",
    "suggestion": "..." // Nur für 'Hold'-Entscheidungen zwingend. Für andere null.
}

* **Filterung und Earnings-Risikomanagement (Profil-abhängig):**
  - **Strict:** Wenn \`earningsInDays < 7\`, immer \`"Hold"\` setzen und den Earnings-Hinweis in den Grund aufnehmen.
  - **Neutral (Standard):** Wenn \`earningsInDays < 3\`, \`"Hold"\`. Liegt der Wert zwischen 3-14 Tagen, Trade erlauben, aber \`timeFrame = "Kurzfristiger Swing (Pre-Earnings)"\` und Risiko im Grund erwähnen. >14 Tage = Standard.
  - **Opportunistisch:** Pre-Earnings Trades sind erlaubt, solange \`earningsInDays ≥ 2\`. Bei 3-14 Tagen trotzdem den Hinweis platzieren; erst bei <2 Tagen auf \`"Hold"\` wechseln.

* **Parameter:**
* \`stopLoss\`: 
  - Standard: Bei \`1,5 * ATR(14)\` unter (für Buy) bzw. über (für Sell) dem Entry-Level platziert.
  - Bei \`Beta ≥ 1,5\`: Bei \`2,0 * ATR(14)\` für mehr Spielraum bei hoher Volatilität.
  - Bei \`Beta < 0,8\` (defensive Aktien): Bei \`1,2 * ATR(14)\` (engerer Stop möglich).
* \`target\`: 
  - Standard: Berechnet mit \`Risk = |entry - stopLoss|\`:
    * **Für Buy:** \`entry + (Risk * 2,0)\` für RRR 2:1
    * **Für Sell:** \`entry - (Risk * 2,0)\` für RRR 2:1
  - Bei starkem Trend (\`Preis > 10%\` über \`200DMA\` für Buy, oder \`Preis < -10%\` unter \`200DMA\` für Sell): 
    * **Für Buy:** Target = \`entry + (Risk * 2,5)\` für RRR 2,5:1
    * **Für Sell:** Target = \`entry - (Risk * 2,5)\` für RRR 2,5:1
  - Bei Pre-Earnings (\`earningsInDays\` zwischen 3-14 Tage): 
    * **Für Buy:** Target = \`entry + (Risk * 1,5)\` für RRR 1,5:1
    * **Für Sell:** Target = \`entry - (Risk * 1,5)\` für RRR 1,5:1
* \`riskRewardRatio\`: Berechnet mit \`|target - entry| / |entry - stopLoss|\`. Minimum sollte 2,0 sein (außer bei Pre-Earnings: 1,5).
* \`timeFrame\`: Bestimme dynamisch unter Berücksichtigung des **ATR(14)**-Werts (Volatilität), **der Entfernung zum 200DMA** und **des Beta-Werts**.
    * **Niedrige Volatilität (niedriges ATR), weit vom 200DMA entfernt und Beta < 1,5:** "2-4 Wochen"
    * **Hohe Volatilität (hohes ATR), Einstieg nahe EMA20/BB Middle oder Beta ≥ 1,5:** "1-3 Wochen"
    * **Sonderfall:** Wenn im Filterungsschritt bestimmt, verwende "Kurzfristiger Swing (Pre-Earnings)".
* \`reason\`: Die Begründung muss die Strategieschritte mit numerischen Daten belegen.
* \`suggestion\`: Wenn 'Hold' entschieden wurde, beschreibe ein mögliches zukünftiges Einstiegsszenario mit potenziellen Entry-, Stop Loss- und Target-Levels. Füge außerdem einen Hinweis zur Verwendung eines manuellen Trailing Stop-Loss hinzu.

* **Finale Ausgabe:** Präsentiere alle JSON-Objekte in einem einzigen Array. **Die Ausgabe muss zwingend in einem einzigen Markdown-JSON-Codeblock (\`\`\`json...\`\`\`) erfolgen und darf KEINE Erklärung ODER anderen Text außerhalb dieses Blocks enthalten.**

---
Beispiel-Ausgabeformat:
[
  {
    "symbol": "AAPL",
    "name": "Apple Inc.",
    "currentPrice": 150.25,
    "direction": "Buy",
    "entry": 150.25,
    "target": 160.65,
    "stopLoss": 145.05,
    "timeFrame": "1-3 Wochen",
    "riskRewardRatio": 2.0,
    "reason": "Haupttrend OK (Preis 150.25 > 200DMA 140.10). Mittelfristiger Trend OK (EMA20 > EMA50, Preis > EMA50). Preis hat Pullback zum EMA20 gemacht (innerhalb 2xATR). RSI 58, MFI 55. MACD Line > Signal, Histogram positiv. SL bei 1,5xATR darunter platziert. Beta 1,2, normales Risiko.",
    "suggestion": null
  },
  {
    "symbol": "TSLA",
    "name": "Tesla Inc.",
    "currentPrice": 95.40,
    "direction": "Hold",
    "entry": null,
    "target": null,
    "stopLoss": null,
    "timeFrame": null,
    "riskRewardRatio": null,
    "reason": "Haupttrend und mittelfristiger Trend-Bedingungen nicht erfüllt (EMA20 < EMA50, aber Preis > EMA50). Mittelfristiger Trend nicht eindeutig.",
    "suggestion": "Warte darauf, dass der Preis unter EMA50 (94.00) fällt, um ein klares Sell-Signal zu erhalten. In diesem Fall: Potenzieller Sell Entry: 94.00, SL: 95.80, Target: 90.40. Risk/Reward sollte 2,0 betragen. Bei Gegenpositionen wird die Verwendung eines manuellen Trailing Stop-Loss empfohlen."
  }
]

### EOD-DATEN ###

${formattedStocks}`,
    },
  },
];
