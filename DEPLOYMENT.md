# Deployment Guide - INFRAALL

This guide will help you deploy your INFRAALL application to the internet.

## Overview

**Tech Stack:**
- Frontend: React + Vite + TypeScript
- Backend: Node.js + Express
- Database: MySQL
- File Storage: Cloudinary
- Payment: Razorpay

## Deployment Options

### Option 1: Quick Deploy (Recommended for Beginners)

#### A. Database - Railway (Free Tier)
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Provision MySQL"
4. Copy these credentials:
   - `MYSQLHOST`
   - `MYSQLPORT`
   - `MYSQLDATABASE`
   - `MYSQLUSER`
   - `MYSQLPASSWORD`

#### B. Backend - Render (Free Tier)
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: infraall-backend
   - **Root Directory**: `backend`
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

6. Add Environment Variables (click "Environment"):
   ```
   PORT=5000
   DB_HOST=<railway-mysql-host>
   DB_PORT=<railway-mysql-port>
   DB_USER=<railway-mysql-user>
   DB_PASSWORD=<railway-mysql-password>
   DB_NAME=<railway-mysql-database>
   JWT_SECRET=your-random-secret-key-here-12345
   
   CLOUDINARY_CLOUD_NAME=<your-cloudinary-name>
   CLOUDINARY_API_KEY=<your-cloudinary-key>
   CLOUDINARY_API_SECRET=<your-cloudinary-secret>
   
   CLIENT_URL=https://your-frontend-url.vercel.app
   
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=Admin@123456
   
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASSWORD=<gmail-app-password>
   EMAIL_FROM=INFRAALL <your-email@gmail.com>
   
   RAZORPAY_KEY_ID=<your-razorpay-key>
   RAZORPAY_KEY_SECRET=<your-razorpay-secret>
   
   TWOFACTOR_API_KEY=<your-2factor-key>
   
   GOOGLE_CLIENT_ID=<your-google-client-id>
   GOOGLE_CLIENT_SECRET=<your-google-secret>
   GOOGLE_CALLBACK_URL=https://your-backend.onrender.com/api/auth/google/callback
   
   SESSION_SECRET=another-random-secret-12345
   ```

7. Click "Create Web Service"
8. Copy your backend URL: `https://infraall-backend.onrender.com`

#### C. Frontend - Vercel (Free Tier)
1. Go to https://vercel.com
2. Sign up with GitHub
3. Click "New Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variables:
   ```
   VITE_API_URL=https://infraall-backend.onrender.com/api
   VITE_GOOGLE_CLIENT_ID=<your-google-client-id>
   VITE_RAZORPAY_KEY_ID=<your-razorpay-key>
   ```

7. Click "Deploy"
8. Your site will be live at: `https://your-project.vercel.app`

9. **Important**: Go back to Render and update `CLIENT_URL` to your Vercel URL

---

### Option 2: Alternative Platforms

#### Database Alternatives
- **PlanetScale** (https://planetscale.com) - Serverless MySQL
- **Aiven** (https://aiven.io) - Free MySQL tier
- **FreeSQLDatabase** (https://freesqldatabase.com) - Free MySQL hosting

#### Backend Alternatives
- **Railway** (https://railway.app) - Easy deployment
- **Fly.io** (https://fly.io) - Global deployment
- **Cyclic** (https://cyclic.sh) - Serverless backend

#### Frontend Alternatives
- **Netlify** (https://netlify.com) - Similar to Vercel
- **GitHub Pages** - Free static hosting
- **Cloudflare Pages** - Free with CDN

---

## Pre-Deployment Checklist

### 1. Update CORS Settings
In `backend/src/index.js`, update CORS to allow your production URLs:

```javascript
app.use(cors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend.vercel.app'  // Add your production URL
  ],
  credentials: true
}));
```

### 2. Setup Gmail App Password (for emails)
1. Go to Google Account → Security
2. Enable 2-Factor Authentication
3. Search "App Passwords"
4. Generate password for "Mail"
5. Use this password in `EMAIL_PASSWORD` env variable

### 3. Update Google OAuth URLs
1. Go to https://console.cloud.google.com
2. Select your project
3. Go to "Credentials"
4. Edit OAuth 2.0 Client
5. Add Authorized JavaScript origins:
   - `https://your-frontend.vercel.app`
6. Add Authorized redirect URIs:
   - `https://your-backend.onrender.com/api/auth/google/callback`

### 4. Update Razorpay Settings
1. Login to Razorpay Dashboard
2. For production, move from Test Mode to Live Mode
3. Generate Live API keys
4. Update webhook URLs if using payment webhooks

### 5. Setup Cloudinary
- Already configured, no changes needed
- Verify limits on free tier

---

## Post-Deployment Steps

### 1. Initialize Database
The first time your backend starts, Sequelize will:
- Create all necessary tables
- Setup relationships
- Create admin user (from env variables)

### 2. Test Your Application
1. Visit your frontend URL
2. Try to register/login
3. Test Google OAuth login
4. Create a test listing
5. Test payment flow (use Razorpay test cards)

### 3. Monitor Logs
- **Render**: Click on your service → "Logs" tab
- **Vercel**: Click on your deployment → "Logs" tab
- **Railway**: Click on your database → "Logs" tab

### 4. Setup Custom Domain (Optional)
- **Vercel**: Settings → Domains → Add Domain
- **Render**: Settings → Custom Domain → Add Domain

---

## Common Issues & Solutions

### Issue 1: Database Connection Timeout
**Solution**: Make sure Railway/PlanetScale is using MySQL version 8+

### Issue 2: CORS Errors
**Solution**: 
- Update CORS origins in backend
- Ensure `credentials: true` is set
- Update `CLIENT_URL` in backend env

### Issue 3: Google OAuth Not Working
**Solution**:
- Check authorized origins and redirect URIs
- Ensure URLs match exactly (http vs https)
- Clear browser cache

### Issue 4: Images Not Uploading
**Solution**:
- Verify Cloudinary credentials
- Check file size limits
- Ensure multer is configured correctly

### Issue 5: Payment Failing
**Solution**:
- Use Razorpay test keys initially
- Test with Razorpay test cards
- Check webhook configuration

---

## Free Tier Limits

### Render (Backend)
- 750 hours/month
- 512 MB RAM
- Sleeps after 15 min inactivity
- First request may be slow (cold start)

### Vercel (Frontend)
- 100 GB bandwidth/month
- Unlimited deployments
- Custom domain included

### Railway (Database)
- $5 free credit/month
- ~500 hours of MySQL
- 1 GB storage

---

## Monitoring & Maintenance

### 1. Setup Uptime Monitoring
Use https://uptimerobot.com (free) to ping your backend every 5 minutes
- Prevents Render from sleeping
- Get alerts when site is down

### 2. Backup Database
Railway provides automatic backups. Or use:
```bash
# Export database (local)
mysqldump -u username -p database_name > backup.sql

# Import backup
mysql -u username -p database_name < backup.sql
```

### 3. Update Dependencies
```bash
# Check for updates
npm outdated

# Update packages
npm update
```

---

## Production Optimization

### 1. Enable GZIP Compression
In backend, install compression:
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Frontend Build Optimization
Already optimized with Vite. Build size ~500KB gzipped.

### 3. Database Indexing
Add indexes to frequently queried columns in your Sequelize models.

### 4. Caching
Consider adding Redis for session storage (upgrade from free tier)

---

## Cost Estimation

### Starting Free (0 users)
- Database: $0 (Railway free credit)
- Backend: $0 (Render free tier)
- Frontend: $0 (Vercel free tier)
- **Total: $0/month**

### Growing (100-1000 users)
- Database: $5-10/month (Railway)
- Backend: $7/month (Render paid)
- Frontend: $0 (Still free on Vercel)
- **Total: $12-17/month**

### Scaling (1000+ users)
- Database: $20+/month (Dedicated)
- Backend: $25+/month (Multiple instances)
- Frontend: $20/month (Vercel Pro)
- CDN: $10/month (Cloudflare/BunnyCDN)
- **Total: $75+/month**

---

## Next Steps

1. ✅ Push code to GitHub
2. ✅ Deploy database (Railway)
3. ✅ Deploy backend (Render)
4. ✅ Deploy frontend (Vercel)
5. ✅ Update environment variables
6. ✅ Test application thoroughly
7. ✅ Setup monitoring
8. ✅ Get custom domain
9. ✅ Enable HTTPS (automatic)
10. ✅ Launch! 🚀

---

## Support

If you face issues:
1. Check Render/Vercel logs
2. Test API endpoints with Postman
3. Verify environment variables
4. Check database connection
5. Review CORS settings

## Need Help?
- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Railway Docs: https://docs.railway.app

Good luck with your deployment! 🎉
