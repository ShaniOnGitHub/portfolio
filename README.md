# Shani's Digital Canvas

> **Most engineers can build. Most marketers can sell. I do both.**

Welcome to my portfolio. I move between two worlds: content and code. I help scale personal brands and grow communities, and I build AI systems that actually ship. Give me a brand to grow or a problem to automate, and I'll own it end to end.

This repository hosts my personal developer portfolio, featuring a fully client-side, serverless RAG chatbot (**ShaniGPT**), selected projects, work history, and interactive timeline.

---

## 🛠️ The Tech Stack

- **Framework**: [TanStack Start](https://tanstack.com/router/v1/docs/start/overview) (React + TypeScript)
- **Styling**: Tailwind CSS
- **Vector Database (Local)**: Static JSON vector store compiled at build time
- **AI/Embeddings**: `Xenova/all-MiniLM-L6-v2` run locally in-browser via `@xenova/transformers` (Transformers.js)

---

## 🤖 ShaniGPT: Client-Side RAG Chatbot

This portfolio features **ShaniGPT**, a serverless, client-side Retrieval-Augmented Generation (RAG) chatbot. It runs 100% in the visitor's browser with **zero server cost, zero API keys, and complete data privacy**.

### Architecture & Pipeline
1. **One-Time Indexing (Build Step)**:
   - A Node.js pipeline parses my knowledge base (`PersonalData.pdf`) and merges it with custom QA overrides (`src/data/additional-qa.json`).
   - Generates 384-dimensional vector embeddings for all 48 chunks using `Xenova/all-MiniLM-L6-v2`.
   - Saves the compiled chunks + vectors to a static `knowledge-index.json` file in the public folder.
2. **In-Browser Inference (Runtime Step)**:
   - When a user query is received, the same model is lazily loaded and cached locally in the browser to embed the query.
   - Computes cosine similarity between the query vector and every chunk in the static index.
   - Uses **length-scaled token keyword overlap** combined with semantic similarity (hybrid search) to ensure exact matches (e.g. prompt chips) succeed perfectly, while vague queries (like "why" or "really") correctly trigger fallback matches.
   - Threshold limit is set to `0.45` to prevent false positive matches.
   - Short greetings (like "hello" or "hey") bypass inference entirely and return instant responses.

---

## 📁 Key Projects

### 🦷 DentraFlow
*Co-Founder & Head of Growth*
- AI receptionist product built for UK dental clinics to handle inbound calls 24/7.
- Developed the go-to-market (GTM) strategy, sales scripting, objection handling, and gatekeeper strategy.

### 📝 SmartExam
*Student Portal & Notifications Owner (FYP)*
- AI-assisted online exam proctoring platform.
- Managed end-to-end development of Student Portal and Notifications modules.

### ⚙️ Support Automation
*AI Systems Builder*
- Multi-tenant AI support system built with FastAPI, PostgreSQL/pgvector, and Gemini.
- Implemented document embedding in a production RAG pipeline with strict tenant data isolation.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- npm

### Installation
1. Clone this repository:
   ```bash
   git clone https://github.com/ShaniOnGitHub/portfolio.git
   cd portfolio
   ```
2. Install dependencies:
   ```bash
   npm install
   ```

### Indexing the Knowledge Base
To update ShaniGPT's knowledge base from `PersonalData.pdf` and `src/data/additional-qa.json`:
```bash
npm run build:index
```

### Running Locally
To launch the hot-reloading development server:
```bash
npm run dev
```
Open `http://localhost:8081` in your browser.

### Building for Production
To build a static production bundle:
```bash
npm run build
```

---

## 📮 Get In Touch
- **Booking**: [Cal.com Discovery Call](https://cal.com/roshaan)
- **LinkedIn**: [linkedin.com/in/roshaan-ali-shah](https://linkedin.com/in/roshaan-ali-shah)
- **GitHub**: [github.com/ShaniOnGitHub](https://github.com/ShaniOnGitHub)
- **Email**: [roshaanali128@gmail.com](mailto:roshaanali128@gmail.com)
