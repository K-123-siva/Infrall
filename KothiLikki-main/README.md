# KothiLikki

A comprehensive real estate and services platform built with React and Node.js.

## Features

### Property Management
- **Buy Property**: Browse and purchase properties
- **Rent Property**: Find rental properties with flexible options
- **Leisure Lease**: Multi-year property leasing with owner-defined maximum periods
- **Post Property**: List your property for free

### Additional Services
- **Furniture Rental**: Quality furniture on flexible rental plans
- **Home Services**: Professional services (plumbing, painting, cleaning, etc.)
- **Building Materials**: Wholesale rates on construction materials

### Advanced Features
- **Advertisement System**: Dynamic promotional banners and featured items
- **Random Featured Items**: Different items displayed on each page load
- **KYC Verification**: Secure user verification system
- **Payment Integration**: Razorpay payment gateway
- **Owner Portal**: Automated account creation for property owners
- **Vendor Management**: Vendor assignment and tracking
- **Admin Dashboard**: Comprehensive admin controls

## Tech Stack

### Frontend
- React with TypeScript
- Vite
- Zustand (State Management)
- Lucide Icons
- Axios

### Backend
- Node.js
- Express.js
- MySQL with Sequelize ORM
- JWT Authentication
- Razorpay Payment Gateway
- Cloudinary (Image Storage)
- Nodemailer (Email Service)

## Project Structure

```
LikhithaProj-main/
├── frontend/          # React frontend application
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── store/
│   │   └── api.ts
│   └── package.json
│
├── backend/           # Node.js backend application
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── config/
│   ├── scripts/       # Database migration scripts
│   └── package.json
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8 or higher)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
DB_HOST=localhost
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=infraall_db
JWT_SECRET=your_jwt_secret
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Run database migrations:
```bash
node scripts/addLeisureFeature.js
node scripts/addMaxLeasePeriod.js
node scripts/addLeaseDuration.js
```

5. Start the server:
```bash
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

4. Start the development server:
```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## Key Features Documentation

### Leisure Lease System
- Owners can specify maximum lease period (1-10 years)
- Users can select lease duration up to the maximum
- Multi-year payment calculation
- Conflict detection for overlapping bookings

### Advertisement System
- Auto-rotating promotional banners
- Service feature cards
- Dynamic featured items from all categories
- Random item selection on each page load

### Owner Account Management
- Automatic account creation when property is listed
- Email notifications with password setup links
- Secure password setup process
- Owner portal access

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Listings
- `GET /api/listings` - Get all listings (supports filters and random sort)
- `GET /api/listings/:id` - Get single listing
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing

### Leisure Lease
- `POST /api/leisure-lease/create-order` - Create lease order
- `POST /api/leisure-lease/verify-payment` - Verify payment
- `GET /api/leisure-lease/user` - Get user's leases

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/listings` - Get all listings
- `POST /api/admin/verify-listing/:id` - Verify listing

## Database Schema

### Main Tables
- **Users**: User accounts and authentication
- **Listings**: Property and service listings
- **LeisureLeases**: Multi-year property leases
- **KYC**: User verification documents
- **Rentals**: Monthly rental agreements
- **Purchases**: Purchase transactions
- **ServiceRequests**: Service bookings
- **Vendors**: Service provider accounts

## Recent Updates

### Leisure Lease Duration Feature
- Added `maxLeasePeriodYears` field to Listings
- Added `leaseDurationYears` field to LeisureLeases
- Updated UI to support multi-year lease selection
- Enhanced backend validation for lease conflicts

### Random Featured Items
- Implemented random sorting in backend API
- Added client-side shuffling for display order
- Shows different items from each category on every page load
- Two-level randomization for maximum variety

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is proprietary and confidential.

## Contact

For any queries, please contact the development team.
