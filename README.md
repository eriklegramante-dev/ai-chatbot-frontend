# 🌆 SYNTH_MATH // 1984 — Client Terminal

> **React + Next.js** client interface for a Multi-Agent AI system, styled with a **Synthwave / Retrowave / 1984** aesthetic.

![React](https://img.shields.io/badge/React-20232A?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?logo=tailwindcss)

---

## 👁️ Overview

The **SYNTH_MATH // 1984 Client Terminal** serves as the presentation layer for the Multi-Agent AI system. The interface delivers an immersive retro-futuristic CRT terminal experience, combining modern UI/UX patterns with 1980s cyberpunk styling.

---

## ✨ Features

- 💬 Real-time chat interface
- 🧠 Context persistence via `localStorage`
- 📚 Session management and dialogue history
- ➕ New session initialization
- 🗑️ Conversation deletion and cache clearance
- ⚡ Animated "Processing Calculation..." status indicators
- 🌈 Dual-tone Synthwave palette (Neon Pink / Cyan)
- 📱 Fully responsive layout (desktop and mobile)
- 🔌 Seamless REST integration with FastAPI
- 🐳 Production-ready Docker containerization

---

## 🧱 Tech Stack

- **Framework:** Next.js (App Router, Client Components)
- **Library:** React
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Networking:** Native Fetch API
- **Client Storage:** Web Storage API (`localStorage`)

---

## 🏗️ Architecture

```text
User Interface (UI)
        │
        ▼
Session Manager
        │
        ▼
History Formatter
        │
        ▼
Fetch API Client
        │
        ▼
FastAPI Backend
        │
        ▼
CrewAI Orchestrator + LLMs
```

---

## 🚀 Installation & Setup

### Using npm

```bash
git clone [https://github.com/eriklegramante-dev/ai-chatbot-frontend.git](https://github.com/eriklegramante-dev/ai-chatbot-frontend.git)
cd synth-math-client
npm install
npm run dev
```

### Using yarn

```bash
git clone [https://github.com/eriklegramante-dev/synth](https://github.com/eriklegramante-dev/synth)