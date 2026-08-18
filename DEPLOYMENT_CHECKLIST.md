# Deployment Checklist ✅

## Before Deployment

### 1. Export Your Local Database (If You Have Data)
- [ ] Double-click `EXPORT_DATABASE.bat` to create backup
- [ ] Or manually run: `mysqldump -u root -p nestbazaar > backup.sql`
- [ ] Verify `nestbazaar_backup.sql` file was created
- [ ] Keep this file safe - you'll import it after deployment

### 2. Code Preparation
- [ ] Remove all `.env` files (keep only `.env.example`)
- [ ] Update `.gitignore` to exclude sensitive files
- [ ] Remove unnecessary MD/BAT/HTML files ✅ DONE
- [ ] Test application locally one final time
- [ ] Commit all changes to Git

### 2. Get Required Services & API Keys

#### Database (Choose One)
- [ ] **Railway** - https://railway.app (Recommended)
- [ ] **PlanetScale** - https://planetscale.com
- [ ] **Aiven** - https://aiven.io

#### Cloudinary (File Storage) - REQUIRED
- [ ] Sign up at https://cloudinary.com
- [ ] Get: Cloud Name, API Key, API Secret

#### Razorpay (Payments) - REQUIRED
- [ ] Sign up at https://razorpay.com
- [ ] Get Test Keys (for testing)
- [ ] Get Live Keys (for production)

#### Google OAuth - REQUIRED
- [ ] Go to https://console.cloud.google.com
- [ ] Create new project
- [ ] Enable Google+ API
- [ ] Create OAuth 2.0 credentials
- [ ] Get: Client ID, Client Secret

#### Email (Gmail)
- [ ] Enable 2-Factor Authentication on Gmail
- [ ] Generate App Password
- [ ] Copy 16-character app password

#### 2Factor SMS (Optional)
- [ ] Sign up at https://2factor.in
- [ ] Get API Key

---

## Deployment Steps

### Step 1: Setup Database (Railway)
- [ ] Create Railway account
- [ ] Create new MySQL database
- [ ] Copy connection details:
  - Host
  - Port
  - Username
  - Password
  - Database Name
- [ ] **Import Your Data**: See `DATABASE_MIGRATION.md` for instructions
- [ ] Use MySQL Workbench or command line to import `nestbazaar_backup.sql`

### Step 2: Deploy Backend (Render)
- [ ] Create Render account
- [ ] Connect GitHub repository
- [ ] Create Web Service
- [ ] Set Root Directory: `backend`
- [ ] Set Build Command: `npm install`
- [ ] Set Start Command: `npm start`
- [ ] Add all environment variables from `.env.example`
- [ ] Wait for deployment (5-10 minutes)
- [ ] Copy backend URL: `https://your-app.onrender.com`

### Step 3: Deploy Frontend (Vercel)
- [ ] Create Vercel account
- [ ] Import GitHub repository
- [ ] Set Root Directory: `frontend`
- [ ] Set Framework: Vite
- [ ] Add environment variables:
  - `VITE_API_URL=https://your-backend.onrender.com/api`
  - `VITE_GOOGLE_CLIENT_ID=your-client-id`
  - `VITE_RAZORPAY_KEY_ID=your-razorpay-key`
- [ ] Deploy
- [ ] Copy frontend URL: `https://your-app.vercel.app`

### Step 4: Update Configurations

#### Update Backend Environment Variables
- [ ] Go to Render → Your Service → Environment
- [ ] Update `CLIENT_URL` to your Vercel URL
- [ ] Update `GOOGLE_CALLBACK_URL` to `https://your-backend.onrender.com/api/auth/google/callback`
- [ ] Redeploy backend

#### Update Google OAuth Settings
- [ ] Go to Google Cloud Console → Credentials
- [ ] Edit OAuth 2.0 Client
- [ ] Add Authorized JavaScript origins:
  - `https://your-frontend.vercel.app`
- [ ] Add Authorized redirect URIs:
  - `https://your-backend.onrender.com/api/auth/google/callback`
  - `https://your-frontend.vercel.app`

#### Update Backend CORS (if needed)
- [ ] Edit `backend/src/index.js`
- [ ] Add your production URL to CORS origins
- [ ] Commit and push changes

---

## Post-Deployment Testing

### Test Basic Functionality
- [ ] Visit your frontend URL
- [ ] Check if homepage loads
- [ ] Test registration
- [ ] Test login
- [ ] Test Google OAuth login
- [ ] Browse property listings

### Test Features
- [ ] Create a new listing (as owner)
- [ ] Upload images
- [ ] Search properties
- [ ] Test filters
- [ ] View property details
- [ ] Test payment flow (use Razorpay test cards)
- [ ] Check email notifications
- [ ] Test admin login
- [ ] Check admin dashboard

### Check Logs
- [ ] Render backend logs - No errors?
- [ ] Vercel frontend logs - No build errors?
- [ ] Railway database - Connected properly?

---

## Optional Improvements

### Performance
- [ ] Setup UptimeRobot to prevent Render sleep
- [ ] Enable Vercel Analytics
- [ ] Setup CDN for images (Cloudinary auto-handles this)

### Monitoring
- [ ] Setup error tracking (Sentry)
- [ ] Setup uptime monitoring (UptimeRobot)
- [ ] Enable email alerts for downtime

### Domain & SSL
- [ ] Buy custom domain (optional)
- [ ] Add domain to Vercel
- [ ] Add domain to Render
- [ ] SSL is automatic on both platforms ✅

### Security
- [ ] Enable rate limiting on backend
- [ ] Setup security headers
- [ ] Review and rotate API keys regularly
- [ ] Enable database backups

---

## Troubleshooting

### Backend not connecting to database?
- Check database host/port/credentials
- Ensure database is running
- Check Railway/PlanetScale status

### CORS errors?
- Update CORS origins in backend
- Match URLs exactly (http vs https)
- Clear browser cache

### Google OAuth not working?
- Check authorized origins
- Check redirect URIs
- Ensure URLs match exactly
- Clear cookies and try again

### Images not uploading?
- Verify Cloudinary credentials
- Check free tier limits
- Check file size limits (usually 10MB)

### Payment not working?
- Use Razorpay test mode initially
- Use test card: 4111 1111 1111 1111
- Check Razorpay dashboard for errors

---

## Maintenance Checklist

### Weekly
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Check database storage

### Monthly
- [ ] Update npm packages
- [ ] Review security patches
- [ ] Check API usage limits
- [ ] Review costs

### Quarterly
- [ ] Backup database
- [ ] Review user feedback
- [ ] Plan new features
- [ ] Rotate API keys (security best practice)

---

## Quick Reference

### Backend URL
`https://your-app.onrender.com`

### Frontend URL
`https://your-app.vercel.app`

### Admin Access
- Email: (check backend .env)
- Password: (check backend .env)

### Important Links
- Railway Dashboard: https://railway.app/dashboard
- Render Dashboard: https://dashboard.render.com
- Vercel Dashboard: https://vercel.com/dashboard
- Cloudinary Dashboard: https://cloudinary.com/console
- Razorpay Dashboard: https://dashboard.razorpay.com
- Google Cloud Console: https://console.cloud.google.com

---

## Cost Tracking

### Current (Free Tier)
- Railway: $5 free credit/month
- Render: 750 hours free
- Vercel: Free forever for hobby projects
- **Total: $0/month**

### When to upgrade?
- Railway credit runs out (usually ~500 hours)
- Render service sleeps too often
- Need more bandwidth
- **Estimated: $12-20/month for growing app**

---

## Success Criteria ✅

Your deployment is successful when:
- ✅ Frontend loads without errors
- ✅ Can register and login
- ✅ Google OAuth works
- ✅ Can create listings
- ✅ Images upload successfully
- ✅ Payment flow works (test mode)
- ✅ Email notifications work
- ✅ Admin dashboard accessible
- ✅ No critical errors in logs

---

**Congratulations! Your app is now live! 🎉**

Share your app URL and start getting users!
