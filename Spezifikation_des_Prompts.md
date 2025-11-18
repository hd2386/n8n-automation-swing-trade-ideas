## Ziel

Technische Prompt je nach Risikofähigkeit und Nutzerkontext dynamisch anpassen.

## Benötigte User Inputs (Website)

1. **Risikoprofil** (Defensiv, Ausgewogen, Aggressiv)
   - Steuert ATR-Multiplikatoren, bevorzugte Trendstärke, Tonalität der Begründung.
2. **Gesamtes verfügbares Trading-Kapital**
   - Dient zur Ableitung der maximalen Positionsgröße (z. B. 5 % pro Trade).
3. **Maximaler Einsatz pro Trade (%)**
   - Wird im Prompt genutzt, um Positionsgrößen-Hinweise oder Warnungen zu formulieren.
4. **Bevorzugter Zeitrahmen** (Kurz 1‑2 Wochen, Standard 2‑4 Wochen, Flexibel)
   - Legt `timeFrame`-Vorschläge fest und bestimmt, ob Targets eher konservativ oder erweitert sind.
5. **Earnings-/News-Sensitivität** (Strict, Neutral, Opportunistisch)
   - Beeinflusst, ab wann automatisch `Hold` oder „Pre-Earnings“-Hinweise gesetzt werden.
6. **Beta-/Volatilitäts-Toleranz** (≤1, ≤1.5, egal)
   - Verändert Stop-Loss-Empfehlungen (1.2×, 1.5×, 2× ATR) und Filtert volatile Ticker.
7. **Portfolio-Exposure-Limit** (max. Anzahl gleichzeitiger Positionen oder % Kapital)
   - Kann im Prompt zu Warnungen führen, falls Signale Anzahl-Limit überschreiten.
8. **Wunsch-Ticker (manuell)**
   - Falls ein Ticker nicht im Selector ist, kann er hier manuell für Kontext ergänzt werden.
9. **Manual Override für Entry-Stil** (Pullback, Breakout, Balanced)

- Bestimmt, welche Entry-Regeln priorisiert im Prompt erwähnt werden.

## Mapping zum technischen System-Prompt

- Jedes Feld wird in einem `userProfile`-Payload gespeichert (DB) und vor dem technischen Datenblock in n8n eingefügt.
- `Risikoprofil`, `Beta-Toleranz`, `Max. Einsatz` → dynamische Beschreibung der Stop-Loss-Logik und Position-Sizing-Hinweise.
- `Zeit­rahmen` → Vorgabe, welche `timeFrame`-Strings bevorzugt sind.
- `Earnings-Sensitivität` → Überschreibt Standard-Grenzwerte (z. B. Strict = Hold bei <7 Tagen).
- `Portfolio-Exposure` → Zusätzliche Prüfungen, ob neue Trades Limits reißen (Begründung + Suggestion).
- `Entry-Stil` → Priorisiert die entsprechenden Abschnitte (Pullback-Regeln vs. Momentum-Regeln).
- `Wunsch-Ticker` → Wird in der Prompt-Begründung erwähnt, um Nahverwante Signale zu diskutieren.

## Umsetzungsschritte

1. Formularelemente in `web/components/features/subscription-form.tsx` ergänzen (Default-Werte, Validierung).
2. Nutzerangaben per API persistieren (z. B. Prisma + SQLite/Postgres, Tabelle `TraderProfile`).
3. n8n-Workflow ruft Profil via REST/Webhook ab und übergibt Payload an `system-prompt.js`.
4. Prompt-Bausteine verwenden Fallbacks, falls Felder fehlen, um Halluzinationen zu vermeiden.
