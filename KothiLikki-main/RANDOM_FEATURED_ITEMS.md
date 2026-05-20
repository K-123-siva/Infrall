# Random Featured Items Feature

## Overview
Updated the "Best of INFRAALL" section on the homepage to show **different random items** from each category every time the website loads.

## What Changed

### 1. Backend Changes ✅

#### Listings Controller
**File**: `backend/src/controllers/listingController.js`

Added `sort` parameter support to `getListings()` function:
- **`sort=newest`** (default): Shows newest listings first
- **`sort=random`**: Returns listings in random order using `RAND()`
- **`sort=price_low`**: Sorts by price ascending
- **`sort=price_high`**: Sorts by price descending

**Implementation**:
```javascript
// Determine sort order
let orderClause;
if (sort === 'random') {
  // Random order using RAND() function
  orderClause = sequelize.literal('RAND()');
} else if (sort === 'price_low') {
  orderClause = [['price', 'ASC']];
} else if (sort === 'price_high') {
  orderClause = [['price', 'DESC']];
} else {
  // Default: newest first
  orderClause = [['createdAt', 'DESC']];
}
```

### 2. Frontend Changes ✅

#### FeaturedItemsShowcase Component
**File**: `frontend/src/components/ads/FeaturedItemsShowcase.tsx`

**Changes Made**:
1. **Random API calls**: Added `sort: 'random'` parameter to all API requests
2. **Client-side shuffle**: Added additional randomization by shuffling the results array
3. **Fixed category names**: 
   - Changed `furniture_rent` → `furniture`
   - Added `property_rent` alongside `property_sell`
4. **Fixed field mapping**: Uses `item.category` instead of `item.listingType`
5. **Image handling**: Maps both `photos` and `images` fields

**API Calls**:
```javascript
const [propertiesSell, propertiesRent, furniture, services, materials] = await Promise.all([
  api.get('/listings', { params: { limit: 1, category: 'property_sell', sort: 'random' } }),
  api.get('/listings', { params: { limit: 1, category: 'property_rent', sort: 'random' } }),
  api.get('/listings', { params: { limit: 1, category: 'furniture', sort: 'random' } }),
  api.get('/listings', { params: { limit: 1, category: 'services', sort: 'random' } }),
  api.get('/listings', { params: { limit: 1, category: 'materials', sort: 'random' } })
]);
```

**Additional Randomization**:
```javascript
// Shuffle the items array for additional randomness
const shuffledItems = mappedItems.sort(() => Math.random() - 0.5);
```

## How It Works

### User Experience
1. User opens the website homepage
2. "Best of INFRAALL" section loads
3. Shows 5 random items (one from each category):
   - 🏠 1 random Property for Sale (Purple)
   - 🔑 1 random Property for Rent (Blue)
   - 🛋️ 1 random Furniture item (Orange)
   - 🔧 1 random Service (Green)
   - 🏗️ 1 random Material (Red)
4. **Every page refresh** shows different items
5. Items are displayed in random order (shuffled)

### Randomization Strategy
**Two-level randomization** for maximum variety:

1. **Backend Level**: 
   - MySQL `RAND()` function selects random items from database
   - Each category query returns different items on each request

2. **Frontend Level**:
   - JavaScript `Math.random()` shuffles the order of displayed items
   - Ensures items appear in different positions each time

### Example Scenarios

**Visit 1**:
- Property Sale: "Luxury Villa in Bangalore"
- Property Rent: "2BHK Apartment"
- Furniture: "Sofa Set"
- Service: "Plumbing Service"
- Material: "Cement Bags"

**Visit 2** (refresh page):
- Material: "Steel Rods"
- Service: "Painting Service"
- Property Sale: "Plot in Hyderabad"
- Furniture: "Dining Table"
- Property Rent: "3BHK House"

**Visit 3** (refresh again):
- Different items in different order!

## Benefits

1. **Fresh Content**: Users see different items every visit
2. **Fair Exposure**: All listings get equal chance to be featured
3. **Engagement**: Encourages users to refresh and explore more
4. **Discovery**: Users discover items they might not have searched for
5. **Dynamic Feel**: Website feels alive and constantly updated

## Technical Details

### Database Query
```sql
SELECT * FROM Listings 
WHERE category = 'property_sell' AND status = 'active'
ORDER BY RAND()
LIMIT 1;
```

### Performance Considerations
- `RAND()` is used with `LIMIT 1`, so performance impact is minimal
- Each category is queried separately for better control
- Results are not cached, ensuring true randomness

### Fallback Behavior
- If a category has no items, that slot is simply empty
- Component gracefully handles missing data
- No errors shown to users

## Files Modified

### Backend
- `backend/src/controllers/listingController.js`
  - Added `sort` parameter support
  - Implemented random ordering with `RAND()`

### Frontend
- `frontend/src/components/ads/FeaturedItemsShowcase.tsx`
  - Added `sort: 'random'` to API calls
  - Fixed category names and field mappings
  - Added client-side shuffling
  - Improved error handling

## Testing

### Manual Testing Steps
1. ✅ Open homepage
2. ✅ Verify 5 items are shown (one per category)
3. ✅ Refresh page multiple times
4. ✅ Confirm different items appear each time
5. ✅ Verify items are in different order each time
6. ✅ Check all category badges show correct colors
7. ✅ Click items to verify navigation works

### Expected Results
- Each refresh shows different items
- Items appear in random order
- All 5 categories are represented
- No duplicate items in same view
- Smooth loading with skeleton screens

## Future Enhancements

Possible improvements:
1. **Weighted Random**: Prioritize newer or verified listings
2. **User Preferences**: Show random items based on user's browsing history
3. **Time-based**: Change items every X minutes without refresh
4. **Analytics**: Track which random items get most clicks
5. **Smart Random**: Avoid showing same items to same user within 24 hours

## Notes
- Randomization happens on every page load
- No caching is used to ensure true randomness
- Backend `RAND()` provides database-level randomization
- Frontend shuffle provides display-level randomization
- Both levels combined ensure maximum variety
