# Account Management Feature - Implementation Summary

## Overview
Added a new **Account Management** section in the admin panel to create and manage Owner and Vendor accounts with email-based password setup.

## Features Implemented

### 1. Backend Implementation

#### New Controller: `accountManagementController.js`
Located at: `backend/src/controllers/accountManagementController.js`

**Owner Account Management:**
- `getOwnerAccounts` - Get all owner accounts with their properties
- `initiateOwnerAccount` - Create owner account and send password setup email
- `resendOwnerSetupEmail` - Resend password setup email to owner

**Vendor Account Management:**
- `getVendorAccounts` - Get all vendor accounts
- `initiateVendorAccount` - Create vendor account and send password setup email
- `resendVendorSetupEmail` - Resend password setup email to vendor

**Public Endpoints:**
- `verifySetupToken` - Verify password setup token validity
- `completePasswordSetup` - Complete password setup and activate account

#### New Routes: `accountManagement.js`
Located at: `backend/src/routes/accountManagement.js`

**Admin Protected Routes:**
- `GET /api/account-management/owners` - List all owner accounts
- `POST /api/account-management/owners/initiate` - Create owner account
- `POST /api/account-management/owners/:userId/resend` - Resend owner setup email
- `GET /api/account-management/vendors` - List all vendor accounts
- `POST /api/account-management/vendors/initiate` - Create vendor account
- `POST /api/account-management/vendors/:vendorId/resend` - Resend vendor setup email

**Public Routes:**
- `GET /api/account-management/verify-token` - Verify setup token
- `POST /api/account-management/complete-setup` - Complete password setup

#### Database Changes
Added to `users` table:
- `passwordSetupToken` (VARCHAR 255, nullable) - Token for password setup
- `passwordSetupExpiry` (DATETIME, nullable) - Token expiration time

Migration script: `backend/scripts/addPasswordSetupFields.js`

### 2. Frontend Implementation

#### Admin Panel Page: `AdminAccountManagement.tsx`
Located at: `frontend/src/pages/admin/AdminAccountManagement.tsx`

**Features:**
- Two tabs: Owner Accounts and Vendor Accounts
- Add new accounts with email
- View account status (Pending Setup / Active)
- Resend setup emails
- View owner properties inline
- Display property counts and stats

**Owner Account Display:**
- Name, email, phone
- Account status (Pending/Verified)
- Total properties, active properties, rented properties
- Expandable property list with images and details

**Vendor Account Display:**
- Business name, contact person
- Email, phone
- Vendor type
- Account status (Pending/Active)

#### Password Setup Pages

**Owner Password Setup: `OwnerPasswordSetup.tsx`**
Located at: `frontend/src/pages/OwnerPasswordSetup.tsx`
- Public page accessible via email link
- Token verification
- Password creation form
- Shows account email (username)
- Redirects to owner login after success

**Vendor Password Setup: `VendorPasswordSetup.tsx`**
Located at: `frontend/src/pages/VendorPasswordSetup.tsx`
- Public page accessible via email link
- Token verification
- Password creation form
- Shows business name and email
- Redirects to vendor login after success

### 3. Email Templates

#### Owner Account Setup Email
**Subject:** Set Up Your INFRAALL Owner Account

**Content Includes:**
- Welcome message
- Password setup button/link
- Login credentials box showing:
  - Username: their email
  - Password: instruction to set via link
  - Login URL: owner portal link
- Account details (email, link validity)
- Features list (what they can do in owner portal)
- Contact information

**Link Format:** `{CLIENT_URL}/owner/setup-password?token={setupToken}`
**Validity:** 48 hours

#### Vendor Account Setup Email
**Subject:** Set Up Your INFRAALL Vendor Account

**Content Includes:**
- Welcome message
- Password setup button/link
- Business details (name, email, vendor type)
- Features list (what they can do in vendor portal)
- Contact information

**Link Format:** `{CLIENT_URL}/vendor/setup-password?token={setupToken}`
**Validity:** 48 hours

### 4. Routes Added

**App.tsx Routes:**
- `/admin/account-management` - Admin account management page
- `/owner/setup-password` - Owner password setup page
- `/vendor/setup-password` - Vendor password setup page

**Admin Menu:**
- Added "Account Management" menu item in AdminLayout

## Workflow

### Creating an Owner Account

1. **Admin initiates account creation:**
   - Goes to Admin Panel → Account Management → Owner Accounts tab
   - Clicks "Add Owner Account"
   - Enters: Email (required), Name (optional), Phone (optional)
   - Clicks "Send Setup Email"

2. **System creates account:**
   - Creates User record with temporary password
   - Generates password setup token (48-hour validity)
   - Sends email to owner with setup link

3. **Owner sets password:**
   - Receives email with setup link
   - Clicks link → Opens password setup page
   - Sees their email (username) and login URL
   - Sets new password (min 6 characters)
   - Account becomes verified and active

4. **Owner can login:**
   - Goes to owner portal login
   - Uses email as username
   - Uses the password they set
   - Access owner dashboard

### Creating a Vendor Account

1. **Admin initiates account creation:**
   - Goes to Admin Panel → Account Management → Vendor Accounts tab
   - Clicks "Add Vendor Account"
   - Enters: Email (required), Business Name, Contact Person, Phone, Vendor Type
   - Clicks "Send Setup Email"

2. **System creates account:**
   - Creates User record with temporary password
   - Creates Vendor profile linked to user
   - Generates password setup token (48-hour validity)
   - Sends email to vendor with setup link

3. **Vendor sets password:**
   - Receives email with setup link
   - Clicks link → Opens password setup page
   - Sees business name and email (username)
   - Sets new password (min 6 characters)
   - Account becomes active

4. **Vendor can login:**
   - Goes to vendor portal login
   - Uses email as username
   - Uses the password they set
   - Access vendor dashboard

## Account Status

### Owner Accounts
- **Pending Setup:** `passwordSetupToken` is not null (yellow badge)
- **Verified:** `passwordSetupToken` is null and `isVerified` is true (green badge)

### Vendor Accounts
- **Pending Setup:** User's `passwordSetupToken` is not null (yellow badge)
- **Active:** User's `passwordSetupToken` is null and `isVerified` is true (green badge)

## Security Features

1. **Token-based password setup:**
   - Cryptographically secure random tokens
   - 48-hour expiration
   - One-time use (cleared after password set)

2. **Password requirements:**
   - Minimum 6 characters
   - Hashed using bcrypt before storage

3. **Email verification:**
   - Only owner/vendor can set their password
   - Admin never sees the password

4. **Account activation:**
   - Accounts only become active after password is set
   - Cannot login until password setup is complete

## Admin Features

### Owner Account Management
- View all owner accounts
- See property statistics per owner
- View owner's properties inline
- Resend setup emails for pending accounts
- Search and filter owners

### Vendor Account Management
- View all vendor accounts
- See vendor type and business details
- Resend setup emails for pending accounts
- Search and filter vendors

## Testing

### Test Owner Account Creation
```bash
# Run backend
cd backend
npm start

# In another terminal, test the API
curl -X POST http://localhost:5000/api/account-management/owners/initiate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"owner@test.com","name":"Test Owner","phone":"1234567890"}'
```

### Test Vendor Account Creation
```bash
curl -X POST http://localhost:5000/api/account-management/vendors/initiate \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"email":"vendor@test.com","businessName":"Test Business","contactPerson":"John Doe","phone":"1234567890","vendorType":"home_services"}'
```

## Files Modified/Created

### Backend
- ✅ Created: `backend/src/controllers/accountManagementController.js`
- ✅ Created: `backend/src/routes/accountManagement.js`
- ✅ Modified: `backend/src/index.js` (added route)
- ✅ Modified: `backend/src/models/User.js` (added password setup fields)
- ✅ Created: `backend/scripts/addPasswordSetupFields.js` (migration)

### Frontend
- ✅ Created: `frontend/src/pages/admin/AdminAccountManagement.tsx`
- ✅ Created: `frontend/src/pages/OwnerPasswordSetup.tsx`
- ✅ Created: `frontend/src/pages/VendorPasswordSetup.tsx`
- ✅ Modified: `frontend/src/App.tsx` (added routes and imports)
- ✅ Modified: `frontend/src/pages/admin/AdminLayout.tsx` (added menu item)

## Environment Variables Required

Make sure these are set in your `.env` file:

```env
# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=INFRAALL <noreply@infraall.com>
ADMIN_EMAIL=admin@infraall.com

# URLs
CLIENT_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

## Next Steps

1. ✅ Backend API endpoints created
2. ✅ Database migration completed
3. ✅ Email templates created
4. ✅ Admin panel UI created
5. ✅ Password setup pages created
6. ✅ Routes configured

**Ready to use!** Admin can now create owner and vendor accounts through the Account Management section.

## Notes

- The existing Owner Management page (`AdminOwnerManagement.tsx`) is kept unchanged
- This new Account Management feature is separate and additional
- Both owner and vendor accounts use the User model for authentication
- Vendor profiles are linked to User accounts via `userId`
- Email service must be properly configured for password setup emails to work
