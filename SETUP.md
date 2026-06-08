# 📋 Setup Guide - School Management System

## System Requirements

- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher (comes with Node.js)
- **MongoDB**: v7.0 or higher
- **Git**: Latest version
- **RAM**: Minimum 2GB recommended
- **Storage**: 1GB free space

## Installation Methods

Choose one of the following installation methods:

### Method 1: Docker (Recommended - Easiest)

#### Prerequisites
- Docker Desktop installed and running
- Docker Compose (included with Docker Desktop)

#### Steps
```bash
# 1. Navigate to project directory
cd SMS

# 2. Start all services
docker-compose up -d

# 3. Wait for containers to be healthy (2-3 minutes)

# 4. Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:5000
# MongoDB: mongodb://admin:admin123@localhost:27017
```

#### Docker Commands
```bash
# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop and remove data (fresh start)
docker-compose down -v

# Rebuild containers
docker-compose up -d --build
```

### Method 2: Manual Setup (Local Development)

#### Step 1: MongoDB Setup

##### Windows
1. Download MongoDB Community Edition from https://www.mongodb.com/try/download/community
2. Run the installer and follow the installation wizard
3. MongoDB will be installed as a Windows service
4. Open PowerShell and test: `mongosh`

##### macOS
```bash
# Using Homebrew
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
mongosh
```

##### Linux (Ubuntu)
```bash
# Import GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg --dearmor -o /usr/share/keyrings/mongodb-server-7.0.gpg

# Add MongoDB repository
echo "deb [ signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] http://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# Install MongoDB
sudo apt-get update
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

#### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file with your configuration
# Key variables to update:
# - MONGODB_URI=mongodb://localhost:27017/school-management-system
# - JWT_SECRET=your-secure-random-string
# - CORS_ORIGIN=http://localhost:3000

# Start development server
npm run dev

# Expected output:
# 🚀 School Management System Server
# 📍 Running on http://localhost:5000
# 🗂️  Environment: development
```

#### Step 3: Frontend Setup (in new terminal)

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env.local file
cp .env.example .env.local

# Edit .env.local if needed
# Default values should work for localhost setup

# Start development server
npm run dev

# Expected output:
# ▲ Next.js 14.0.0
# - Ready in 5s
# - Open http://localhost:3000
```

### Method 3: Database-Only Docker + Local Apps

```bash
# Start only MongoDB in Docker
docker run --name sms-mongodb -d \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -p 27017:27017 \
  mongo:7.0

# Then follow Method 2 for Node.js setup
```

## Configuration Guide

### Backend Configuration (.env)

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
MONGODB_URI=mongodb://admin:admin123@localhost:27017/school-management-system
DB_HOST=localhost
DB_PORT=27017
DB_NAME=school-management-system

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d

# CORS Settings
CORS_ORIGIN=http://localhost:3000

# Email Configuration (Optional - for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-specific-password

# Cloud Storage (Optional - for file uploads)
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### Frontend Configuration (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_APP_NAME=School Management System

# Authentication
NEXTAUTH_SECRET=your-nextauth-secret-key
NEXTAUTH_URL=http://localhost:3000
```

## Verify Installation

### Using Docker Compose

```bash
# Check if all services are running
docker-compose ps

# Expected output:
# NAME              STATUS
# sms-mongodb       Up 2 minutes
# sms-backend       Up 2 minutes
# sms-frontend      Up 2 minutes
```

### Check Backend
```bash
# Windows PowerShell
Invoke-WebRequest http://localhost:5000/api/health

# macOS/Linux
curl http://localhost:5000/api/health

# Expected response:
# {"status":"OK","message":"Server is running","timestamp":"..."}
```

### Check Frontend
Open browser and visit: `http://localhost:3000`

You should see the School Management System dashboard.

## Database Initialization

### Seed Sample Data (Optional)

```bash
cd backend
npm run seed
```

This will populate the database with sample data for testing.

## Troubleshooting

### Port Already in Use
```bash
# Check what's using each port
# Windows
netstat -ano | findstr :<PORT>
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :<PORT>
kill -9 <PID>
```

### MongoDB Connection Error
```bash
# Check if MongoDB is running
# Windows
Get-Service | Where-Object {$_.Name -eq "MongoDB"}

# macOS
brew services list | grep mongodb-community

# Linux
sudo systemctl status mongod
```

### Frontend Not Loading
```bash
# Clear Next.js cache
rm -rf frontend/.next

# Reinstall dependencies
cd frontend
rm -rf node_modules
npm install

# Start development server
npm run dev
```

### Backend API Errors
```bash
# Check MongoDB is accessible
# Windows PowerShell
Test-NetConnection localhost -Port 27017

# macOS/Linux
nc -zv localhost 27017

# Check backend logs
docker-compose logs backend
```

## Development Commands

### Backend
```bash
npm run dev       # Start development server with auto-reload
npm run build     # Build TypeScript
npm run start     # Run production build
npm run lint      # Run ESLint
npm run type-check # Check TypeScript types
```

### Frontend
```bash
npm run dev       # Start development server
npm run build     # Build Next.js application
npm start         # Start production server
npm run lint      # Run Next.js linting
```

## Building for Production

### Backend
```bash
cd backend
npm run build
# dist/ folder contains compiled JavaScript
```

### Frontend
```bash
cd frontend
npm run build
# .next/ folder contains optimized build
npm start        # Run production build locally
```

## Additional Resources

- **MongoDB Documentation**: https://docs.mongodb.com/
- **Next.js Documentation**: https://nextjs.org/docs
- **Express.js Documentation**: https://expressjs.com/
- **Docker Documentation**: https://docs.docker.com/

## First Time Login

After setup, you can:
1. Navigate to dashboard to view the system
2. Use the navigation menu to access different modules
3. All data shown is sample/placeholder data until you add real data

## Performance Tips

- Use MongoDB Atlas for production instead of local MongoDB
- Implement caching strategies for frequently accessed data
- Optimize database queries with proper indexing
- Use CDN for static assets in production
- Enable gzip compression for API responses

## Next Steps

1. ✅ Installation complete
2. 📖 Read the main [README.md](./README.md) for feature documentation
3. 🔧 Configure environment variables for your setup
4. 📊 Explore the dashboard at http://localhost:3000
5. 🔌 Test API endpoints using Postman or similar tools
6. 🚀 Deploy to production when ready

---

**Happy Learning! 🎓**
