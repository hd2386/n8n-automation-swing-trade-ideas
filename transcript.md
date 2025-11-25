# [0:00 - 0:15] INTRO

[confidently] „In diesem kurzen Demo-Video zeige ich Ihnen, wie unser personalisiertes Swing-Trade-Signalsystem funktioniert – vom ersten Registrierungsschritt bis hin zur individuellen E-Mail mit konkreten Trading-Empfehlungen.“

# [0:15 - 0:45] WEBSITE FORM

[calmly] „Der Kunde öffnet unsere Website und füllt das Anmeldeformular aus.
[matter-of-fact] Hier trägt er seine E-Mail-Adresse ein, wählt bis zu fünf Aktien aus und gibt sein Risikoprofil, sein verfügbares Kapital sowie seine Trading-Präferenzen an.
[reassuring] Diese Informationen sind die Grundlage für unsere personalisierte Analyse.“

[0:45 - 1:30] N8N WORKFLOW

[slightly excited] „Sobald das Formular abgeschickt wird, werden die Daten gespeichert.
[explaining] Hier sehen Sie die einzelnen Nodes: Jeden Abend nach US-Marktschluss wird der Flow automatisch gestartet.
[calmly] Zuerst werden die Profildaten abgerufen, die zuvor über die Website erfasst wurden.
Anschließend werden für jede ausgewählte Aktie die aktuellen Marktdaten aus Yahoo Finance und Alpaca geladen.
[informative] In unserem Code-Node berechnen wir daraus verschiedene technische Indikatoren.
[confidently] Auf dieser Basis wird für jeden Kunden ein spezifischer Prompt generiert und an das LLM übergeben.“

[1:30 - 2:00] DETERMINISTIC OUTPUT

[matter-of-fact] „Um konsistente und klar strukturierte Ergebnisse sicherzustellen, verwenden wir für das LLM eine Temperatur von null und ein fest definiertes JSON-Schema.
[clearly] Das LLM liefert die Ausgaben immer im gleichen Format: Ticker, Aktion, Entry-Preis, Stop-Loss sowie eine personalisierte, technisch fundierte Begründung.
[calmly] Abschließend werden alle Trade-Empfehlungen per E-Mail an den jeweiligen Nutzer verschickt.“

[2:00 – 2:30] E-MAIL ERGEBNIS

[slightly excited] „Und hier sehen Sie das Endergebnis:
[confidently] Eine personalisierte E-Mail mit konkreten Trading-Empfehlungen – exakt abgestimmt auf das Risikoprofil und die Präferenzen des Kunden, inklusive technischer Analyse und klarer Handelsempfehlung.“
