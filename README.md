# 🎓 NexEduManage Pro - Educational Management System

A professional, modern, and comprehensive Educational Management System built with **Next.js 14 (App Router)**, **Node.js/Express**, and **Supabase (PostgreSQL) via Prisma Client**. It features a stunning, premium light-themed UI/UX with smooth transitions, 3D card effects, and elegant glassmorphism.

---

## ✨ Key Features

### 🏢 Core Modules
- 👨‍🎓 **Student Management** - Detailed profiles, enrollment records, and academic progress tracking.
- 👨‍🏫 **Teacher Management** - Qualifications, experiences, class associations, and salary details.
- 📋 **Attendance Tracking** - Modern calendar interface for marking and tracking student & teacher attendance.
- 📊 **Grade & Report Cards** - Effortless marks entry, automatic calculations, and progress report generation.
- 💰 **Fee Ledger** - Transparent invoice listing, payment confirmation, and status tracking (paid, pending, overdue).
- 📅 **Interactive Timetables** - Weekly schedules and period coordination to avoid slot overlap conflicts.
- 🤖 **AI Assistant** - NexduManage Pro Assistant integrated to help teachers and administrators with prompt answers.

### 🎨 User Interface & Experience
- ☀️ **Premium Light Theme** - Sleek, professional, and consistent global typography and colors.
- 🎭 **Animations** - Micro-interactions, hover effects, and slide transitions using Framer Motion.
- 📱 **Mobile Responsive** - Works seamlessly on tablets, smartphones, and desktop displays.
- 🔐 **Secure Session Flow** - Next-generation JWT auth + user profile sync (name, email, phone number, and avatar).

### ⚙️ Technical Architecture
- 💾 **Supabase Database** - Relational schema built on PostgreSQL for enterprise data integrity.
- 🚀 **Prisma ORM** - Type-safe database queries and automated schema handling.
- 🔐 **Restricted Registration** - Secure sign-up flow allowing students to register with credentials synced directly into the auth schema.

---

## 🚀 Installation & Quick Start

### Prerequisites
- **Node.js** v18 or later
- **npm** or **yarn**
- A **Supabase** Project Reference (PostgreSQL Database URL)

---

### Setup Instructions

#### 1. Database Configuration
Rename `.env.example` in the `backend` folder to `.env` and configure your credentials:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:6543/postgres"
JWT_SECRET=your_jwt_secret_key
```

Run database migrations to initialize tables in Supabase:
```bash
cd backend
npx prisma db pull   # (or db push to sync schema directly)
```

#### 2. Backend Server Setup
Install dependencies and run the server:
```bash
cd backend
npm install
npm run dev
```
The server will seed the default super-administrator account (`lazy-404`) and run on `http://localhost:5000`.

#### 3. Frontend Next.js Setup
Rename `.env.example` to `.env.local` inside the `frontend` folder:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME="NexEduManage Pro"
```
Install dependencies and launch the dev environment:
```bash
cd ../frontend
npm install
npm run dev
```
Access the dashboard at `http://localhost:3000`.

---

## 📁 Project Structure

```
NexEduManage-Pro-SMS/
├── frontend/                 # Next.js 14 Web Application
│   ├── app/                 # App Router (login, register, dashboard, etc.)
│   ├── components/          # Reusable dashboard UI blocks
│   └── styles/              # Global CSS & Tailwind configuration
│
├── backend/                  # Express.js Rest API Server
│   ├── prisma/              # Prisma DB schemas & connection clients
│   ├── src/
│   │   ├── controllers/     # Route handler logic
│   │   ├── routes/          # Express API route declarations
│   │   ├── middleware/      # Authentication & Error interceptors
│   │   └── utils/           # Server utilities (config, async handlers)
│   └── package.json
```

---

## 🔐 Security & Validation

- Password hashing via **bcryptjs**.
- Custom Error Interceptors mapped to handle **Prisma Unique Constraints (P2002)**.
- Protected client-side routes backed by robust middleware request checks.

---

**Made with ❤️ for Educational Excellence**
