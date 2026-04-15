# 🎓 School Management System

A professional, modern, and comprehensive School Management System built with **React/Next.js** and **Node.js/Express**, featuring stunning UI/UX with 3D effects and smooth animations.

## ✨ Features

### Core Features
- 👨‍🎓 **Student Management** - Complete student records, profile management, and enrollment tracking
- 👨‍🏫 **Teacher Management** - Staff information, qualifications, specializations, and salary management
- 📚 **Class Management** - Class organization, section management, and capacity tracking
- 📋 **Attendance Tracking** - Daily attendance marking, reports, and attendance analytics
- 📊 **Grade Management** - Marks entry, grade calculation, result processing, and performance analysis
- 💰 **Fee Management** - Invoice generation, payment tracking, and financial reports
- 📅 **Timetable/Scheduling** - Class scheduling, period management, and conflict resolution
- 📖 **Library Management** - Book inventory, issue/return tracking, and fine management

### User Interface
- 🎨 Modern, glassmorphism design with gradient effects
- ✨ Smooth animations using Framer Motion
- 📱 Fully responsive and mobile-friendly
- 🌙 Dark theme with professional color schemes
- 🎭 Interactive components and micro-interactions
- 🔄 Real-time data updates

### Technical Features
- 🔐 Secure authentication and authorization
- 📡 RESTful API architecture
- 💾 MongoDB database with optimized queries
- 🐳 Docker containerization
- 📈 Scalable and maintainable codebase
- 🔄 Error handling and validation

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB 7.0+
- Docker and Docker Compose (optional)

### Installation

#### 1. Clone and Setup Basic Structure
```bash
cd SMS
```

#### 2. Backend Setup
```bash
cd backend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Update .env with your configuration
# Start development server
npm run dev
```

#### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Docker Setup (Recommended)

```bash
# Run everything with Docker Compose
docker-compose up -d

# The application will be available at:
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# MongoDB: localhost:27017
```

## 📁 Project Structure

```
SMS/
├── frontend/                 # Next.js React Application
│   ├── app/                 # App router and pages
│   ├── components/          # Reusable components
│   │   ├── Dashboard/
│   │   ├── Students/
│   │   ├── Teachers/
│   │   ├── Attendance/
│   │   ├── Grades/
│   │   ├── Fees/
│   │   ├── Timetable/
│   │   ├── Library/
│   │   └── Common/
│   ├── lib/                 # Utilities and helpers
│   ├── styles/              # Global styles and animations
│   └── public/              # Static assets
│
├── backend/                  # Express.js API Server
│   ├── src/
│   │   ├── models/          # MongoDB schemas
│   │   ├── controllers/     # Business logic
│   │   ├── routes/          # API routes
│   │   ├── middleware/      # Auth, validation, etc
│   │   └── utils/           # Helper functions
│   └── package.json
│
├── docker-compose.yml       # Docker orchestration
└── README.md               # This file
```

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://admin:admin123@localhost:27017/school-management-system
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
```

#### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School Management System
NEXTAUTH_SECRET=your-secret
NEXTAUTH_URL=http://localhost:3000
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Endpoints

#### Students
- `GET /students` - Get all students
- `GET /students/:id` - Get student by ID
- `POST /students` - Create new student
- `PUT /students/:id` - Update student
- `DELETE /students/:id` - Delete student

#### Teachers
- `GET /teachers` - Get all teachers
- `POST /teachers` - Create new teacher
- `PUT /teachers/:id` - Update teacher
- `DELETE /teachers/:id` - Delete teacher

#### Attendance
- `GET /attendance` - Get attendance records
- `POST /attendance` - Mark attendance
- `GET /attendance/student/:id` - Get student attendance

#### Grades
- `GET /grades` - Get all grades
- `POST /grades` - Create grade entry
- `PUT /grades/:id` - Update grade

#### Fees
- `GET /fees` - Get fee records
- `POST /fees/payment` - Record payment
- `GET /fees/student/:id` - Get student fees

#### Library
- `GET /library/books` - Get all books
- `POST /library/issue` - Issue book
- `POST /library/return` - Return book

## 🎨 Design Features

### Color Scheme
- **Primary**: Blue (#1e40af)
- **Secondary**: Teal (#0f766e)
- **Accent**: Amber (#f59e0b)
- **Background**: Dark gradient (Slate-900 to Purple-900)

### Animations
- Fade-in on load
- Slide-in effects
- Hover animations
- Smooth transitions
- Float animations
- Pulse indicators

### 3D Effects
- Glass morphism cards
- Gradient overlays
- Shadow glow effects
- Interactive depth

## 🛠️ Development

### Run Development Servers
```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: MongoDB (if not using Docker)
# Ensure MongoDB is running on localhost:27017
```

### Build for Production
```bash
# Backend
cd backend
npm run build

# Frontend
cd frontend
npm run build
npm start
```

### Linting and Type Checking
```bash
# Backend
npm run lint
npm run type-check

# Frontend
npm run lint
```

## 📊 Database Schema

### Key Collections
- **Students**: Student information and enrollment details
- **Teachers**: Staff information and credentials
- **Classes**: Class organization and structure
- **Attendance**: Daily attendance records
- **Grades**: Student grades and results
- **Fees**: Financial records and payments
- **Timetable**: Class scheduling
- **LibraryBooks**: Book inventory
- **LibraryIssues**: Book issue/return tracking

## 🔐 Security

- JWT-based authentication
- Password hashing with bcryptjs
- CORS protection
- Input validation and sanitization
- Environment variable protection
- Secure HTTP headers

## 📱 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🚀 Deployment

### Using Docker
```bash
docker-compose -f docker-compose.yml up -d
```

### Using Traditional Hosting
1. Deploy backend to Node.js hosting (Heroku, Railway, etc.)
2. Deploy frontend to Vercel, Netlify, or static hosting
3. Update environment variables on hosting platform
4. Configure MongoDB Atlas or self-hosted MongoDB

## 📝 License

This project is proprietary and intended for educational institutions.

## 🤝 Support

For issues, bugs, or feature requests, please create an issue in the project repository.

## 🎉 Future Enhancements

- [ ] Advanced 3D visualizations with Three.js
- [ ] AI-powered student performance predictions
- [ ] Mobile app (React Native)
- [ ] Video conferencing integration
- [ ] Advanced reporting and analytics
- [ ] Multi-language support
- [ ] SMS and Email notifications
- [ ] Parent portal
- [ ] Student portal
- [ ] Advanced scheduling algorithms

---

**Made with ❤️ for Educational Excellence**
