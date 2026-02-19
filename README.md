# 🧠 DEVLOG AI  
### A Personal Coding Journal with AI-Powered Refinement
---
## ✨ What is DEVLOG AI?

DEVLOG AI is a full-stack web application that helps developers transform messy daily coding notes into structured, searchable, and AI-refined knowledge.

## 🔗 Live Demo
https://devlog-ai.vercel.app/

## 🧪 Demo Access

You may create a temporary account, or use:

Email: demo@devlog.ai  
Password: demo123

## 🧰 Built With

Next.js · NestJS · PostgreSQL · TypeORM · Gemini API · Cloudinary · JWT Auth

---

It’s designed around a simple loop:

> Capture → Refine → Organize → Reuse

Instead of scattered notes across tools, DEVLOG AI turns:
- Raw debugging logs → structured Markdown
- Rough thoughts → improved writing
- Daily entries → searchable knowledge base
- Logs → exportable summaries

This project focuses on clean architecture, AI integration, and production-style deployment.

---

## 📸 Screenshots

### Dashboard
![Dashboard](./readme-assets/dashboard.png)

### Journal Editor
![Editor](./readme-assets/editjournal.png)

### AI Summary
![AI Summary](./readme-assets/summary.png)

### Sharing Controls
![Sharing](./readme-assets/sharejournal.png)

---

## 🏗 System Architecture

### High-Level Flow

1. **Next.js (App Router)** handles UI rendering and client interactions.
2. API requests are sent to a **NestJS backend (REST API)**.
3. Backend:
   - Handles authentication & validation
   - Interacts with PostgreSQL via TypeORM
   - Calls Gemini API for AI features
4. Media uploads are stored and optimized using Cloudinary.
5. PDF exports are generated client-side (HTML → PDF pipeline).

### 🔐 Authorization & Sharing Model

- Public access links generated per entry
- AI summaries gated behind authenticated sessions
- Email-based access control stored in PostgreSQL
- Backend-level permission enforcement (unauthorized users cannot fetch restricted entries)
- Resource-level access validation on every request

---

## 🚀 Core Features

### 📝 Journal Engine
- Create, edit, delete journal entries
- Markdown + plain-text writing support
- Live preview (split view on desktop)
- Full-text search across:
  - Title
  - Content
  - Tags
- GitHub-style activity heatmap
- Streak tracking logic

---

### 🤖 AI Features (Backend-Proxied)

All AI requests are routed through the backend to:
- Protect API keys
- Control usage
- Maintain clean separation of concerns

Features include:

- **Convert to Markdown**
  - Plain text → structured Markdown
  - Side-by-side comparison modal

- **Improve Writing**
  - Grammar + clarity enhancement

- **Auto Tag Generation**
  - Context-aware tag suggestions

- **Entry Summarization**
  - AI-generated summary per entry
  - Exportable as PDF

---

### 🖼 Media & Export
- Featured image uploads (Cloudinary auto-optimization)
- Entry → HTML → PDF export
- Summary → downloadable PDF
- Persistent light/dark theme

---

## 🧱 Tech Stack

### Frontend
- Next.js (App Router)
- React
- Tailwind CSS
- shadcn/ui

### Backend
- NestJS
- TypeORM
- PostgreSQL

### AI & Media
- Gemini API
- Cloudinary

---

## 🗄 Database Design

Relational schema designed for scalability and future collaboration features.

Core tables:

- `users`
- `journal_entries`
- `tags`
- `entry_tags` (many-to-many relation)
- `summaries`

---

## 🔐 Security & Engineering Decisions

- JWT-based authentication
- Password hashing with bcrypt
- Server-side AI API key protection
- Environment-based configuration
- DTO validation via NestJS pipes
- Clean separation: controller → service → repository layers

---

## ⚡ Performance Considerations

- Indexed Postgres queries for search
- Efficient relational joins (TypeORM)
- Cloudinary CDN optimization
- Client-side rendering optimizations with Next.js App Router
- Minimized unnecessary re-renders in React components

---

## 📦 Local Development

### 1️⃣ Clone

```bash
git clone https://github.com/Milin2710/Devlog_AI
cd Devlog_AI
```
### 2️⃣ Environment Variables

Create .env in both client/ and server/.

#### client/.env
```
NEXT_PUBLIC_CLOUDINARY_URL=your_cloudinary_url
```
#### server/.env
```
DATABASE_URL=postgres://user:pass@host:port/dbname
GEMINI_API_KEY=your_gemini_key
CLOUDINARY_URL=your_cloudinary_url
JWT_SECRET=your_secret
```
### 3️⃣ Run Locally
```
# client
npm install
npm run dev

# server
npm install
npm run start:dev
```
Visit → http://localhost:3000

## 📈 Roadmap

- Role-based permission tiers (viewer/editor)
- AI-powered blog draft generation
- Prompt customization panel
- CI/CD integration
- Automated testing coverage

---

## 🧠 Engineering Highlights

- Modular NestJS architecture
- Resource-level authorization
- AI request proxying for key security
- Relational modeling with scalable join tables
- Deployment split: Vercel (frontend) + Render (backend)

---

## 🎯 Why This Project Matters

DEVLOG AI demonstrates:

- End-to-end full-stack system design
- Production-style deployment architecture
- Backend authorization & resource-level access control
- Secure AI integration via server proxy
- Relational data modeling with scalability in mind

It reflects a product-first engineering approach rather than a tutorial-style CRUD application.