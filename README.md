# CRMP-full: Collaborative Research Management Platform

A modern, full-stack monorepo for collaborative document management and rich-text editing, built with **NestJS**, **Next.js**, **Drizzle ORM**, and **Tiptap**.

## 🚀 Project Overview

CRMP-full is a high-performance platform designed for managing research documents with real-time collaboration readiness. It features a secure authentication system, a modular backend architecture, and a premium frontend editor with versioning and snapshot support.

---

## 🏗 System Architecture

The project is divided into two main components:

### 1. Backend (`/backend`)
A robust API powered by **NestJS** and **PostgreSQL**.

- **Framework**: [NestJS](https://nestjs.com/) (Modular Architecture)
- **ORM**: [Drizzle ORM](https://orm.drizzle.team/) for type-safe database interactions.
- **Database**: PostgreSQL with custom schemas for:
  - `users`: Identity management.
  - `documents`: Core metadata and latest JSON snapshots.
  - `document_versions`: Historical snapshots (Versioning system).
  - `document_access`: Role-based access control (RBAC).
- **Security**: JWT-based authentication with Passport.js strategies.
- **Modules**:
  - `AuthModule`: Handles login, registration, and token issuance.
  - `DocumentsModule`: Manages CRUD and snapshot versioning.
  - `DrizzleModule`: Global database provider.

### 2. Frontend (`/frontend`)
A sleek, responsive client built with **Next.js** (App Router).

- **Framework**: [Next.js 15+](https://nextjs.org/)
- **Auth**: [NextAuth.js](https://next-auth.js.org/) for seamless session management.
- **Editor**: [Tiptap](https://tiptap.dev/) rich-text editor with custom extensions (Images, Tables, Highlights, etc.).
- **Styling**: Tailwind CSS with a premium glassmorphic UI.
- **State Management**: React Context and Server Components for optimized data fetching.
- **Key Features**:
  - **Dashboard**: Real-time listing of owned and shared research.
  - **Snapshot System**: "Save Draft" functionality that stores Tiptap JSON states on the backend.
  - **Server-Side Fetching**: Uses Server Components to fetch document data securely before rendering the editor.

---

## 📁 Directory Structure

```text
CRMP-full/
├── backend/                # NestJS Application
│   ├── src/
│   │   ├── auth/          # JWT & Authentication Logic
│   │   ├── documents/     # Document Service & Controllers
│   │   ├── drizzle/       # Database Schema & Migrations
│   │   └── main.ts        # Entry Point
│   └── package.json
├── frontend/               # Next.js Application
│   ├── app/               # App Router (Pages & API Routes)
│   ├── src/
│   │   ├── features/      # Modular Feature Folders (e.g., Editor)
│   │   ├── components/    # Common UI Components
│   │   ├── lib/           # Shared Utilities (API helpers)
│   │   └── hooks/         # Custom React Hooks
│   └── package.json
└── README.md              # This file
```

---

## 🛠 Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL Database

### Installation

1. **Clone the repository**
2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   # Configure .env with DATABASE_URL and JWT_SECRET
   npm run db:generate
   npm run db:push
   npm run start:dev
   ```
3. **Setup Frontend**:
   ```bash
   cd frontend
   npm install
   # Configure .env.local with NEXTAUTH_SECRET and NEXT_PUBLIC_API_URL
   npm run dev
   ```

---

## 🔐 Security Concepts
- **CORS**: Configured to handle multiple development origins.
- **RBAC**: Backend enforces ownership or shared access before returning document data.
- **Versioning**: Each 'Manual Save' creates a persistent row in `document_versions`, allowing for future "Undo to Version" features.

---

## 🛠 Tech Stack Summary
| Frontend | Backend | Database | Tools |
| :--- | :--- | :--- | :--- |
| Next.js, React 19 | NestJS | PostgreSQL | Tiptap Editor |
| Tailwind CSS | Passport JWT | Drizzle ORM | Lucide Icons |
| NextAuth.js | TypeScript | Drizzle Kit | Y.js (Ready) |
