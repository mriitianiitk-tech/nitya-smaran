# Nitya Smaran — Constant Remembrance (नित्य स्मरण)

> *"Whatever you do, whatever you eat, whatever you offer or give away—do that as an offering unto Me."*  
> — **Bhagavad Gita 9.27**

**Nitya Smaran** is a modern, responsive, installable Progressive Web Application (PWA) designed to transform daily work, duties, and routines into continuous spiritual remembrance (*Smaran*) and Karma Yoga (*Bhagavad-Arpanam*).

---

## ✨ Features

- **🌺 Bhava & Karma Dedicator (Sankalpa & Arpanam)**:
  - Consciously set an inner intention (*Bhava*) before starting any meeting, inspection, duty, or family activity:
    - *Nimitta Matra* (Instrument of Bhagwan)
    - *Kartavya Puja* (Duty as Worship)
    - *Seva Bhava* (Selfless Service)
    - *Sakshi Bhava* (Detached Witness)
  - Dedicated task list with time stamps and single-click *Arpanam* (dedicating both effort and results).

- **📿 Digital Mala Counter & Likhita Smaran**:
  - Interactive 108-bead counter with keyboard shortcut support (press **Spacebar** to chant).
  - Web Audio API synthesized temple bell chime (528 Hz Solfeggio tone) and haptic feedback.
  - Tracking for daily malas and total chants.
  - Likhita Japa input stream for typing sacred names or prayers.

- **🔔 1-Breath Smaran Mindfulness Pause**:
  - Configurable interval chime (15m, 30m, 60m) with full-screen meditative breathing pause featuring a pulsating Om.

- **🕉️ Customizable Ishta Dev & Presets**:
  - Built-in presets for *Sri Sita-Ram*, *Sri Radha-Krishna*, *Bhagwan Shiva*, *Sri Lakshmi Narayana*, and *Sri Hanuman Ji*.
  - Ability to customize your own Ishta Dev title, primary mantra, and dedication phrase.

- **🎨 Themes & Languages**:
  - Themes: *Sandalwood Light (चन्दन)* and *Brahma Muhurta Dark (रात्रि/ध्यान)*.
  - Languages: Mix (English + Devanagari), Hindi / Sanskrit, and English.

- **☁️ Cloudflare Pages & D1 Sync Support**:
  - Serverless sync backend with Cloudflare D1 database (`functions/api/sync.js`).
  - Full local fallback when offline.
  - JSON backup export and restore.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Local Development

```bash
# Clone the repository
git clone https://github.com/mriitianiitk-tech/nitya-smaran.git
cd nitya-smaran

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`.

### Production Build

```bash
npm run build
```

The compiled assets will be in the `dist/` directory, ready to deploy to Cloudflare Pages, Vercel, or any static host.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Lucide Icons, Vanilla CSS
- **Audio & Haptics**: Web Audio API, Navigator Vibrate API
- **Deployment & Cloud Backend**: Cloudflare Pages, Cloudflare D1 SQLite Database, Wrangler
