# 🚀 Quick Start Guide

Get the School Management System up and running in less than 5 minutes!

## Prerequisites
- Docker Desktop installed and running (easiest method)
- OR Node.js 18+ and MongoDB 7.0+ for manual setup

## Method 1: Docker (Recommended - 2 Minutes)

### Step 1: Start All Services
```bash
cd SMS
docker-compose up -d
```

### Step 2: Wait for Services to Start
```bash
# Check container status (wait 2-3 minutes)
docker-compose ps

# Expected output:
# NAME              STATUS
# sms-mongodb       Up 2 minutes
# sms-backend       Up 2 minutes
# sms-frontend      Up 2 minutes
```

### Step 3: Access the Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api/health
- **MongoDB**: mongodb://admin:admin123@localhost:27017

### Step 4: Stop Services (When Done)
```bash
docker-compose down
```

---

## Method 2: Manual Setup (5 Minutes)

### Step 1: Backend Setup
```bash
cd SMS/backend
npm install
cp .env.example .env

# Start development server
npm run dev

# Expected output:
# 🚀 School Management System Server
# 📍 Running on http://localhost:5000
```

### Step 2: Frontend Setup (New Terminal)
```bash
cd SMS/frontend
npm install
cp .env.example .env.local

# Start development server
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Ready in 5s
# - Open http://localhost:3000
```

### Step 3: Open in Browser
- Frontend: http://localhost:3000
- API Health: http://localhost:5000/api/health

---

## First Time Usage

### 1. Explore the Dashboard
- Visit http://localhost:3000
- View statistics and recent activity
- Check the sidebar for navigation

### 2. Test Different Sections
- **Students**: View and manage student records
- **Teachers**: View and manage teacher records
- **Attendance**: Check attendance statistics
- **Grades**: View grade distribution
- **Fees**: Check financial status
- **Timetable**: View class schedule
- **Library**: Browse available books

### 3. Try API Endpoints
```bash
# Health check
curl http://localhost:5000/api/health

# Get all students
curl http://localhost:5000/api/students

# Get all teachers
curl http://localhost:5000/api/teachers
```

---

## Common Tasks

### Add a Student (API)
```bash
curl -X POST http://localhost:5000/api/students \
  -H "Content-Type: application/json" \
  -d '{
    "rollNumber": "STU001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "dateOfBirth": "2008-05-15",
    "gender": "male",
    "class": "507f1f77bcf86cd799439012",
    "section": "A",
    "parentName": "Jane Doe",
    "parentPhone": "0987654321"
  }'
```

### View Database
```bash
# Connect to MongoDB
mongosh mongodb://admin:admin123@localhost:27017

# Switch to database
use school-management-system

# List collections
show collections

# View students
db.students.find().pretty()
```

### View Logs
```bash
# Docker logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Frontend development logs
# Check terminal where you ran 'npm run dev'

# Backend development logs
# Check terminal where you ran 'npm run dev'
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and stop process using port
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Verify MongoDB is running
# Docker
docker ps | grep mongodb

# Manual setup
mongosh
```

### Frontend Not Loading
```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules .next
npm install
npm run dev
```

---

## Project Structure Overview

```
SMS/
├── frontend/              # React/Next.js Frontend
│   ├── app/              # Pages and routes
│   ├── components/       # React components
│   ├── lib/              # Utilities and API client
│   └── styles/           # Global styles
│
├── backend/              # Express.js Backend
│   ├── src/
│   │   ├── models/       # MongoDB schemas
│   │   ├── controllers/  # Business logic
│   │   ├── routes/       # API routes
│   │   └── middleware/   # Middleware functions
│   └── dist/             # Compiled output
│
├── docker-compose.yml    # Docker orchestration
├── README.md            # Main documentation
├── SETUP.md             # Detailed setup guide
└── docs/                # Additional documentation
    ├── API.md           # API documentation
    ├── ARCHITECTURE.md  # System architecture
    └── CONTRIBUTING.md  # Contributing guide
```

---

## Key Features at a Glance

✨ **8 Major Modules**
- Student Management
- Teacher Management
- Attendance Tracking
- Grade Management
- Fee Management
- Timetable/Scheduling
- Library Management
- Dashboard Analytics

🎨 **Modern UI Features**
- Glassmorphism design
- Smooth animations
- Responsive layout
- Dark theme
- Interactive components

🚀 **Technical Features**
- React/Next.js frontend
- Express.js backend
- MongoDB database
- JWT authentication
- Docker containerization

---

## Next Steps

1. **Read Documentation**
   - Check [README.md](../README.md) for full feature list
   - Read [SETUP.md](../SETUP.md) for detailed setup
   - Review [docs/API.md](../docs/API.md) for API reference

2. **Explore Code**
   - Frontend: `frontend/components/`
   - Backend: `backend/src/`

3. **Customize**
   - Edit environment variables
   - Modify colors in `frontend/tailwind.config.js`
   - Add new features

4. **Deploy**
   - See [SETUP.md](../SETUP.md) for deployment options
   - Deploy to Docker, Vercel, Heroku, etc.

---

## Useful Commands Cheat Sheet

```bash
# Docker
docker-compose up -d           # Start all services
docker-compose down            # Stop services
docker-compose logs -f         # View logs
docker-compose ps              # Check status

# Frontend Development
npm run dev                     # Start dev server
npm run build                   # Build production
npm run lint                    # Run linter

# Backend Development
npm run dev                     # Start with auto-reload
npm run build                   # Build TypeScript
npm run start                   # Run production
npm run lint                    # Run linter

# Database
mongosh                         # Connect to MongoDB
use school-management-system    # Select database
db.students.find()             # View students
```

---

## Support & Help

- 📖 Check [README.md](../README.md) for complete documentation
- 🔧 See [SETUP.md](../SETUP.md) for detailed setup instructions
- 📚 Read [docs/API.md](../docs/API.md) for API documentation
- 🏗️ Review [docs/ARCHITECTURE.md](../docs/ARCHITECTURE.md) for system design
- 🤝 Check [docs/CONTRIBUTING.md](../docs/CONTRIBUTING.md) to contribute

---

**That's it! You're ready to go! 🎉**

Start exploring the School Management System at **http://localhost:3000**
