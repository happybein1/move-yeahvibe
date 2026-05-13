# Workout YeahVibe — HOW-TO Guide

## Project Structure

```
workout-yeahvibe/
├── index.html          ← Single page app (HTML structure)
├── css/
│   └── style.css       ← All styles (themes, layout, animations)
├── js/
│   ├── app.js          ← App logic (language, mode, video, description)
│   ├── data-fr.js      ← French exercise data (50 intense + 30 senior)
│   └── data-en.js      ← English exercise data (50 intense + 30 senior)
├── fetch-videos.js     ← One-time script to fetch YouTube video IDs
├── fetch-images.js     ← One-time script to generate SVG exercise images
├── HOW-TO.md           ← This file
└── README.md           ← Deployment guide
```

---

## fetch-videos.js — Fetch YouTube Video IDs

### What it does
Queries the YouTube Data API v3 for each exercise (FR + EN separately),
verifies that the video is truly embeddable, and rewrites `data-fr.js`
and `data-en.js` with a hardcoded `videoId` field on each exercise.

This means zero API calls at runtime — videos load instantly.

### When to run it
- **First setup** — before going live
- **Periodically** — if some videos become unavailable (monthly recommended)
- **After adding new exercises** — to fetch their video IDs

### How to run

**Step 1 — Get an unrestricted API key**
Your production key (`app.js`) is restricted to `*.yeahvibe.com/*` for security.
For the script, you need a temporary key with no domain restriction:
- Go to [console.cloud.google.com](https://console.cloud.google.com)
- Credentials → Create API key → leave restrictions as **None**
- Use this key in `fetch-videos.js` (line 1), then delete it after use

**Step 2 — Run the script**
```bash
cd workout-yeahvibe
node fetch-videos.js
```

**Step 3 — What happens**
- Fetches up to 5 YouTube candidates per exercise
- Verifies each video is `embeddable: true`, `public`, and `processed`
- Picks the first one that passes all checks
- Updates `data-fr.js` and `data-en.js` in place with `videoId` fields
- Logs progress with ✓ / ✗ for each exercise (~160 total, ~1 min)

**Step 4 — Restore key restriction**
Go back to Google Cloud Console and re-add `*.yeahvibe.com/*` to your key.

### Quota usage
- Each exercise = 2 API calls (search + verify)
- ~160 exercises × 2 = ~320 units per full run
- Free quota = 10,000 units/day → well within limits

---

## fetch-images.js — Generate SVG Exercise Illustrations

### What it does
Calls the Claude API to generate a simple animated SVG stick figure
for each exercise, then writes the SVG inline into `data-fr.js` and
`data-en.js` as a `svg` field on each exercise object.

Images are served inline — no external requests, no CDN, works offline.

### When to run it
- **First setup** — before going live
- **After adding new exercises** — to generate their illustrations

### How to run

**Step 1 — Get your Anthropic API key**
- Go to [console.anthropic.com](https://console.anthropic.com)
- API Keys → Create key
- Copy the key (starts with `sk-ant-...`)

**Step 2 — Run the script**
```bash
cd workout-yeahvibe
ANTHROPIC_API_KEY=sk-ant-YOUR_KEY node fetch-images.js
```

Or set it at the top of `fetch-images.js`:
```js
const ANTHROPIC_API_KEY = 'sk-ant-YOUR_KEY';
```

**Step 3 — What happens**
- Generates one SVG per exercise (80 exercises)
- Each SVG is a simple animated stick figure (~1-3KB)
- Updates `data-fr.js` and `data-en.js` with `svg` fields
- Logs progress with ✓ / ✗ for each exercise (~5-10 min)

---

## Adding a New Exercise

1. Open `js/data-fr.js` and `js/data-en.js`
2. Add your exercise object to the `intense` or `senior` array:

```js
{
  name:  "Exercise Name",
  min:   10,          // minimum reps or seconds
  max:   20,          // maximum reps or seconds
  unit:  "reps",      // "reps", "sec", "sec/side", "sec/leg", etc.
  emoji: "💪",
  type:  "Strength",  // category label shown on card
  desc:  "How to perform this exercise step by step...",
  note:  "Tip for senior mode (optional)",
}
```

3. Run `node fetch-videos.js` to get the video ID
4. Run `node fetch-images.js` to generate the SVG illustration
5. Push to GitHub → Cloudflare deploys automatically

---

## Changing the App Language Labels

Edit the `ui` block at the top of each data file:

```js
// js/data-fr.js
ui: {
  choose:         "CHOISISSEZ VOTRE PROGRAMME",
  intenseTitle:   "Mode Sportif",
  seniorTitle:    "Gym Douce",
  change:         "⚙️ Changer de programme",
  next:           "EXERCICE SUIVANT",
  descLabel:      "ℹ️ Comment faire",
  video:          "▶ Voir sur YouTube",
  videoSearching: "🔍 Recherche de la vidéo...",
}
```

---

## Deploying Updates

After any change to the files:

```bash
git add .
git commit -m "describe your change"
git push
```

Cloudflare Pages detects the push and redeploys automatically within ~1 minute.
