# INFRAALL - Property Rental & Sale Platform

A comprehensive property management platform for rentals, sales, and home services by INFRAALL.com.

## Tech Stack

### Frontend
- React 19 with TypeScript
- Vite (Build Tool)
- TailwindCSS 4.0
- React Router v7
- Zustand (State Management)
- Socket.io Client (Real-time)
- Google OAuth
- Razorpay Integration

### Backend
- Node.js + Express.js
- MySQL Database
- Sequelize ORM
- JWT Authentication
- Passport.js (Google OAuth)
- Cloudinary (File Storage)
- Razorpay (Payment Gateway)
- Socket.io (Real-time)
- Nodemailer (Email)
- Node-cron (Scheduled Tasks)

## Features

- Property Listings (Rent/Sale)
- Furniture Rental
- Building Materials
- Leisure/Event Spaces
- Home Services & Subscriptions
- Admin Dashboard
- Owner Portal
- Payment Integration (Razorpay)
- Google OAuth Login
- Real-time Notifications
- Advertisement System

## Quick Start (Local Development)

### Prerequisites
- Node.js 18+
- MySQL 8+
- Git

### Setup

1. **Clone Repository**
```bash
git clone <your-repo-url>
cd KothiLikki-main
```

2. **Backend Setup**
```bash
cd backend
npm install

# Configure .env file (see .env.example)
# Update database credentials, API keys, etc.

npm start
```

3. **Frontend Setup**
```bash
cd frontend
npm install

# Configure .env file (see .env.example)
# Update API URL and keys

npm run dev
```

4. **Database Setup**
- Create MySQL database named `nestbazaar`
- Tables will be created automatically by Sequelize

5. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions for:
- Render (Backend)
- Vercel/Netlify (Frontend)
- Railway/PlanetScale (Database)

## Environment Variables

### Backend (.env)
```
PORT=5000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=nestbazaar
JWT_SECRET=your-secret
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
CLIENT_URL=your-frontend-url
RAZORPAY_KEY_ID=your-razorpay-key
RAZORPAY_KEY_SECRET=your-razorpay-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Frontend (.env)
```
VITE_API_URL=your-backend-url
VITE_GOOGLE_CLIENT_ID=your-google-client-id
VITE_RAZORPAY_KEY_ID=your-razorpay-key
```

## Admin Credentials
Check your .env file for admin email and password.

## License
MIT
