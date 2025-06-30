# 🧠 DEVLOG AI

Your Personal Coding Journal with AI Superpowers  
[Live Demo](https://devlog-ai.vercel.app/) • Frontend on Vercel • Backend & Database on Render

---

## 🎯 What Is DEVLOG AI?

DEVLOG AI is a personal web app that transforms your daily coding notes, bugs, breakthroughs, and brainstorms into an organized, searchable journal—augmented by AI. Think of it as a smarter dev diary that helps you reflect, tag, summarize, and even draft polished blog posts from your own logs.

---

## 🚀 Features

### Core & Utility (MVP → Phase 2)
- **Authentication** (email/password, OAuth)
- **Journal CRUD** (add, edit, delete)
- **Markdown & Plain-Text**  
  - Write in plain text or Markdown  
  - **“Convert to Markdown”** → pop-up compares original vs. AI-generated Markdown; accept/regenerate/copy/close  
  - Live side-by-side preview (mobile: stacked view)
- **Grammar & Structure Improvement**  
  - **“Improve Writing”** → opens a pop-up with AI suggestions; accept/regenerate/copy/close  
- **Tag Management**  
  - Auto-generate tags via Gemini  
  - Add/delete unlimited tags (flat list, index preserved)
- **Search**  
  - Full-text search across titles, tags, content  
  - Always shows up-to-date results
- **Stats**  
  - Weekly/monthly entry counts  
  - GitHub-style calendar heatmap (darker color = more entries)
  - Streak counter (consecutive days with ≥ 1 entry, including today)
- **Theme Toggle** (light/dark; persisted in `localStorage`)

### AI Layer (Phase 3)
- **Auto-Summaries**  
  - Generate an AI summary per journal entry  
  - Download summary as PDF (via html2pdf.js; includes featured image)
- **Blog Draft Generation** (coming soon)

### Media & Export (Phase 4)
- **Featured Images**  
  - Upload any size image; stored in Cloudinary  
  - Automatically optimized by Cloudinary
- **PDF Export**  
  - Download full entry as PDF (Markdown → HTML → PDF via html2pdf.js)
- **Drafts & Sharing**  
  - (Upcoming) Save as draft for later edits  
  - (Upcoming) Public or user-specific shareable links

---

## 🧱 Tech Stack

- **Frontend:** Next.js (App Router) · Tailwind CSS · shadcn/ui  
- **Backend:** NestJS · TypeORM · PostgreSQL (Render) · Redis  
- **AI Integration:** Gemini API  
- **Storage & Hosting:**  
  - Frontend on Vercel  
  - Backend & Postgres on Render  
  - Images on Cloudinary

---

## 🧪 Local Setup

1. **Clone & Install**
   ```bash
   git clone https://github.com/Milin2710/Devlog_AI
   cd devlog-ai
   ```

2. Environment Variables
   Create a .env file in both client/ and server/:

   ```env
   # client/.env
   NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key
   NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url

   # server/.env
   DATABASE_URL=postgres://user:pass@host:port/dbname
   REDIS_URL=redis://host:port
   GEMINI_API_KEY=your_gemini_key
   CLOUDINARY_URL=your_cloudinary_url
   ```

3. Run Locally

   ```bash
   # In client/
   npm install
   npm run dev

   # In server/
   npm install
   npm run start
   ```

4. Open http://localhost:3000 in your browser.

## 📈 Roadmap
### Phase 5

- Public/private share links (per-user access)
- Collaboration & user roles
- Blog-draft templating & export
- Community
- Contribution guidelines & changelog
- Add CI/build and coverage badges

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to open a PR or issue in the repo.