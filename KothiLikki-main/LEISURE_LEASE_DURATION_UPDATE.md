# Leisure Lease Duration Feature Update

## Overview
Updated the leisure/lease property feature to allow owners to specify a maximum lease period and users to select their desired lease duration (multi-year leases).

## What Changed

### 1. Database Changes ✅

#### Listings Table
- **Added Field**: `maxLeasePeriodYears` (INT, nullable)
  - Allows owners to specify maximum lease period (e.g., 1, 2, 3, 4, 5, 10 years)
  - Users can lease for any duration from 1 year up to this maximum

#### LeisureLeases Table
- **Added Field**: `leaseDurationYears` (INT, default: 1)
  - Stores the actual lease duration selected by the user
  - Supports multi-year leases (1, 2, 3, 4, 5+ years)

### 2. Backend Changes ✅

#### Models Updated
- **`backend/src/models/Listing.js`**
  - Added `maxLeasePeriodYears` field definition

- **`backend/src/models/LeisureLease.js`**
  - Added `leaseDurationYears` field definition

#### Controller Updated
- **`backend/src/controllers/leisureLeaseController.js`**
  - `createLeisureLeaseOrder()` now accepts `leaseDurationYears` parameter
  - Validates lease duration against property's `maxLeasePeriodYears`
  - Checks for conflicts across all requested years
  - Calculates total amount: `monthlyRent × 12 × leaseDurationYears`
  - Calculates end date based on duration

#### Migration Scripts Created
- **`backend/scripts/addMaxLeasePeriod.js`** ✅ Executed
- **`backend/scripts/addLeaseDuration.js`** ✅ Executed

### 3. Frontend Changes ✅

#### Property Listing Forms
- **`frontend/src/pages/PostAdPage.tsx`**
  - Added `maxLeasePeriodYears` to form state
  - Added dropdown selector (1-10 years) when `isLeisure` is checked
  - Shows only when owner enables leisure property option

- **`frontend/src/pages/admin/AdminAddProperty.tsx`**
  - Same updates as PostAdPage for admin property creation

#### Property Detail Page
- **`frontend/src/pages/ListingDetailPage.tsx`**
  - Added `leaseDurationYears` state variable
  - Updated leisure lease modal with:
    - **Lease Duration selector**: Dropdown showing 1 to max years
    - **Dynamic pricing**: Shows total for selected duration
    - **Date range display**: Shows start to end date based on duration
    - **Payment summary**: Updates based on selected years
  - Updated `handleLeisureLease()` to send `leaseDurationYears` to backend

## How It Works

### For Property Owners (Listing)
1. When listing a rental property, owner checks "🏖️ Leisure Property"
2. A new field appears: "Maximum Lease Period (Years)"
3. Owner selects maximum years they allow (1, 2, 3, 4, 5, or 10 years)
4. Example: If owner selects 4 years, users can lease for 1, 2, 3, or 4 years

### For Users (Leasing)
1. User views a leisure property and clicks "🏖️ Leisure Lease"
2. Modal shows:
   - **Lease Duration dropdown**: Options from 1 year up to owner's maximum
   - **Start Year**: Current or next year
   - **Start Date**: Specific date picker
   - **Date Range**: Automatically calculated (e.g., "Jan 1, 2024 to Jan 1, 2027" for 3 years)
   - **Payment Summary**: 
     - Monthly Rent: ₹X
     - Duration: Y years (Y × 12 months)
     - **Total Amount**: ₹(X × 12 × Y)
3. User selects desired duration and proceeds with payment

### Backend Validation
- Checks if requested duration ≤ property's `maxLeasePeriodYears`
- Checks for conflicts: If property is already leased for any year in the requested range, booking is rejected
- Example: If user wants 2024-2026 (3 years), system checks if 2024, 2025, OR 2026 are already booked

## Example Scenarios

### Scenario 1: 4-Year Maximum
- Owner lists property with `maxLeasePeriodYears = 4`
- User A leases for 2 years (2024-2025): Pays ₹10,000 × 12 × 2 = ₹2,40,000
- User B can lease for 2026-2027 (2 years available)
- User C cannot lease 2025-2028 (conflict with User A's 2025)

### Scenario 2: 1-Year Maximum
- Owner lists property with `maxLeasePeriodYears = 1`
- Users can only lease for 1 year at a time
- Different users can lease different years (2024, 2025, 2026, etc.)

## UI/UX Improvements

### Property Listing Form
```
☑️ 🏖️ Leisure Property
   ↓
   Maximum Lease Period (Years) *
   [Dropdown: 1 Year, 2 Years, 3 Years, 4 Years, 5 Years, 10 Years]
   💡 Users can lease your property for any period from 1 year up to the maximum you specify
```

### Leisure Lease Modal
```
🏖️ What is a Leisure Lease?
• Multi-year commitment with upfront payment
• Perfect for vacation homes and seasonal properties
• Maximum lease period: 4 years  ← Shows owner's limit
• Total cost: ₹2,40,000 for 2 years  ← Updates dynamically
• Exclusive access for the selected period

Lease Duration (Years) *
[Dropdown: 1 Year, 2 Years, 3 Years, 4 Years]  ← Up to max
💡 Choose how many years you want to lease (up to 4 years)

Lease Start Year *
[Dropdown: 2024, 2025]

Lease Start Date *
[Date Picker]
📅 Lease period: Jan 1, 2024 to Jan 1, 2026  ← Calculated

💰 Payment Summary
Monthly Rent: ₹10,000
Duration: 2 years (24 months)
─────────────────────
Total Amount: ₹2,40,000
```

## Testing Checklist

### Backend
- [ ] Create property with `maxLeasePeriodYears = 3`
- [ ] Lease for 2 years - should succeed
- [ ] Try to lease for 4 years - should fail (exceeds max)
- [ ] Lease overlapping years - should fail (conflict)
- [ ] Verify total amount calculation: `price × 12 × duration`

### Frontend
- [ ] Post property form shows max lease period field when leisure is checked
- [ ] Dropdown shows correct options (1 to max years)
- [ ] Leisure modal shows duration selector
- [ ] Payment summary updates when duration changes
- [ ] Date range displays correctly
- [ ] Payment processes successfully

## Files Modified

### Backend
- `backend/src/models/Listing.js`
- `backend/src/models/LeisureLease.js`
- `backend/src/controllers/leisureLeaseController.js`
- `backend/scripts/addMaxLeasePeriod.js` (new)
- `backend/scripts/addLeaseDuration.js` (new)

### Frontend
- `frontend/src/pages/PostAdPage.tsx`
- `frontend/src/pages/admin/AdminAddProperty.tsx`
- `frontend/src/pages/ListingDetailPage.tsx`

## Migration Status
✅ `maxLeasePeriodYears` added to Listings table
✅ `leaseDurationYears` added to LeisureLeases table

## Next Steps
1. Restart backend server to load updated models
2. Test property listing with leisure + max lease period
3. Test multi-year lease booking
4. Verify payment calculations
5. Test conflict detection (overlapping years)

## Notes
- Existing leisure properties will have `maxLeasePeriodYears = NULL`, which defaults to 5 years in the UI
- Existing leisure leases will have `leaseDurationYears = 1` (default value)
- The system prevents double-booking by checking all years in the requested range
- Payment is upfront for the entire duration (no installments)
