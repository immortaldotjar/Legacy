# Legacy — Every Passion Has a Story

**Legacy** turns a short, personal interview into an AI-generated, illustrated life story — a scrollable "film reel" of chapters, each paired with a retro-futuristic anime-style illustration, downloadable as a keepsake PDF.

Answer a handful of questions about a passion, its origin, its hardest moment, and where it's headed — Legacy writes it as a narrative arc, generates a cinematic portrait-orientation illustration for every chapter, and presents it as a scroll-driven story reel with an overlapping-card transition between chapters.

🔗 **Live demo:** [Legacy](https://legacy-every-passion-has-a-story.onrender.com/)

---

## ✨ Features

- **Guided interview** — a multi-step question flow (name, passion, origin story, challenge, motivation, achievement, future) with a progress bar and per-question validation; you can't advance on a blank answer.
- **AI-written story** — Google Gemini turns the interview answers into a structured story (title, tagline, opening quote, chapters, ending). Falls back to a locally-built story if Gemini is unavailable, so generation never hard-fails.
- **AI-illustrated chapters** — each chapter gets a custom retro-futuristic anime-poster illustration (1980s–90s Japanese sci-fi key-art style) generated via a Cloudflare Worker and hosted on Cloudinary. Includes automatic safety-filter false-positive detection (pixel-uniformity check) with an automatic softened-prompt retry, and a graceful "frame not developed" placeholder if generation still fails.
- **Cinematic scroll experience** — chapters use a sticky-stacking scroll transition so each chapter overlaps and reveals the next, with scroll-linked text/image animation (Framer Motion).
- **PDF export** — download the whole story, images included, as a paginated, print-quality PDF — generated entirely client-side (no server round-trip for the PDF itself).
- **Session-guarded story access** — a signed, httpOnly session cookie proves a story was genuinely generated, so `/story` can't be reached by manually typing the URL or editing `localStorage`.
- **Server-side validation** — required-field checks are enforced on the API itself, not just the UI, so the interview can't be bypassed via direct API calls.

---

## 🧱 Tech Stack

**Frontend (`client/`)**
- React 19 + Vite
- Tailwind CSS
- Framer Motion (scroll animation, page transitions)
- React Router
- jsPDF (lazy-loaded, client-side PDF generation)
- lucide-react (icons)

**Backend (`server/`)**
- Node.js + Express 5
- Google Gemini (`@google/genai`) — story text generation
- Cloudflare Worker — image generation proxy
- Cloudinary — image hosting/delivery
- Sharp — image analysis (blank-frame/safety-filter detection)
- Signed httpOnly cookies (Node's built-in `crypto`, no external auth library) — session guard for the story route

---

## 📁 Project Structure

```
legacy/
├── client/                  # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Interview, Story, Loading UI pieces
│   │   ├── pages/            # Home, Interview, Story, NotFound
│   │   ├── hooks/            # useInterview state machine
│   │   ├── services/         # API calls to the backend
│   │   ├── utils/             # PDF generator, timecode formatting
│   │   ├── animations/        # Framer Motion variants
│   │   └── data/               # Interview question definitions
│   └── package.json
│
└── server/                  # Express backend
    ├── routes/               # /api/story route definitions
    ├── services/              # Story generation, image generation,
    │                            Cloudinary, session, validation
    ├── app.js
    ├── server.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A [Google Gemini API key](https://aistudio.google.com/apikey)
- A [Cloudinary](https://cloudinary.com/) account (cloud name, API key, API secret)
- A deployed Cloudflare Worker for image generation (URL + API key)

### 1. Clone and install

```bash
git clone https://github.com/<your-username>/legacy.git
cd legacy

# Frontend
cd client
npm install

# Backend
cd ../server
npm install
```

### 2. Configure environment variables

**`server/.env`**
```env
GEMINI_API_KEY=your_gemini_api_key
CLOUDINARY_NAME=your_cloudinary_cloud_name
CLOUDINARY_KEY=your_cloudinary_api_key
CLOUDINARY_SECRET=your_cloudinary_api_secret
CF_WORKER_URL=https://your-worker.workers.dev/
CF_API_KEY=your_worker_api_key
PORT=5000

# Signs the session cookie proving a story was genuinely generated.
# Use a long random string, e.g. `openssl rand -hex 32`
SESSION_SECRET=

# Set to "production" when deployed on separate domains from the
# frontend (needed for the session cookie's SameSite/Secure behavior)
NODE_ENV=development
```

**`client/.env`** *(optional locally — defaults to `http://localhost:5000`)*
```env
VITE_API_URL=http://localhost:5000
```

### 3. Run it

```bash
# Terminal 1 — backend
cd server
npm run dev

# Terminal 2 — frontend
cd client
npm run dev
```

Visit `http://localhost:5173`.

---

## 🌐 API

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/story` | Accepts interview answers, returns the generated story (title, chapters, images, ending). Rejects with `400` if any required answer is blank. Sets the session cookie on success. |
| `GET` | `/api/story/session` | Returns `{ authorized: boolean }` — whether the current browser holds a valid, unexpired story session cookie. |

---

## ☁️ Deployment

This app deploys as **two separate services** since the backend needs a persistent Node process (image processing, streaming uploads, cookies) rather than serverless functions:

- **Frontend** (`client/`) → any static host (Vercel, Netlify, Render Static Site). Build command: `npm run build`, publish directory: `dist`.
- **Backend** (`server/`) → any Node host (Render, Railway, Fly.io). Start command: `npm start`.

**Important:** if frontend and backend end up on different domains/subdomains, set `NODE_ENV=production` on the backend so the session cookie switches to `SameSite=None; Secure` — required for the cookie to survive cross-site requests. Also set `VITE_API_URL` on the frontend to the backend's real deployed URL *before* building (Vite bakes it in at build time).

