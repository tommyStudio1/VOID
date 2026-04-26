# VOID Performance – Website Setup

## Projektstruktur

```
void-website/
├── index.html                  ← Deine Website + Chatbot
├── netlify.toml                ← Netlify Konfiguration
├── netlify/
│   └── functions/
│       └── chat.js             ← API Proxy (schützt deinen API Key)
├── logo.png                    ← Deine Bilder hier ablegen
├── can-gym.png
├── can-strike.png
├── can-void.png
└── can-abyss.png
```

---

## Schritt-für-Schritt Anleitung

### 1. GitHub Repository erstellen
1. Gehe zu https://github.com/new
2. Repository Name: `void-website`
3. Sichtbarkeit: **Private** (empfohlen)
4. Klicke **Create repository**

### 2. Dateien hochladen
- Lade alle Dateien aus diesem Ordner hoch (inkl. `netlify/functions/chat.js` und `netlify.toml`)
- Vergiss nicht deine Bilder: `logo.png`, `can-gym.png`, `can-strike.png`, `can-void.png`, `can-abyss.png`

### 3. Netlify einrichten
1. Gehe zu https://netlify.com und erstelle einen kostenlosen Account
2. Klicke **Add new site** → **Import an existing project**
3. Wähle **GitHub** und verbinde deinen Account
4. Wähle das `void-website` Repository
5. Klicke **Deploy site**

### 4. Anthropic API Key hinterlegen
1. Hole dir einen API Key auf https://console.anthropic.com
2. In Netlify: **Site settings** → **Environment variables**
3. Klicke **Add variable**:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (dein Key)
4. Speichern & **Redeploy** (Deploys → Trigger deploy)

### 5. Fertig!
Deine Website ist jetzt live unter einer Netlify-URL (z.B. `void-performance.netlify.app`).
Du kannst später eine eigene Domain in den Netlify-Einstellungen verknüpfen.

---

## Warum dieser Aufbau?

Der API Key wird **niemals** im Frontend-Code gespeichert.
Die `netlify/functions/chat.js` läuft als sicherer Server und leitet
Anfragen weiter – so kann niemand deinen Key stehlen.
