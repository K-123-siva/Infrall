# Advertisement Components

Elegant and modern advertisement components inspired by NoBroker and CouponDunia designs.

## 📦 Components

### 1. **PromotionalBanner**
Auto-rotating promotional banner with gradient backgrounds and smooth animations.

**Features:**
- Auto-rotation with customizable interval
- Multiple position options (top, middle, bottom, sidebar)
- Closeable with smooth animations
- Hover pause functionality
- Progress indicators
- Fully responsive

**Usage:**
```tsx
import PromotionalBanner from './components/ads/PromotionalBanner';

<PromotionalBanner 
  position="top"        // 'top' | 'middle' | 'bottom' | 'sidebar'
  autoRotate={true}     // Enable auto-rotation
  rotateInterval={5000} // Rotate every 5 seconds
/>
```

---

### 2. **ServiceAdCards**
Grid of service advertisement cards with hover effects and discount badges.

**Features:**
- Responsive grid layout
- Hover animations
- Discount badges
- Icon-based design
- Bottom statistics banner
- "See All" navigation

**Usage:**
```tsx
import ServiceAdCards from './components/ads/ServiceAdCards';

<ServiceAdCards />
```

---

### 3. **NativeAdCard**
Native advertisement cards that blend seamlessly with content.

**Features:**
- Three variants: property, service, partner
- Sponsored badges
- Image backgrounds
- Rating displays
- Feature tags
- CTA buttons

**Usage:**
```tsx
import NativeAdCard from './components/ads/NativeAdCard';

// Property listing ad
<NativeAdCard variant="property" />

// Service promotion ad
<NativeAdCard variant="service" />

// Partner/sponsor ad
<NativeAdCard variant="partner" />
```

---

## 🎨 Customization

### Colors & Gradients
Edit the component files to customize:
- Background gradients
- Text colors
- Button styles
- Badge colors

### Content
Modify the sample data arrays in each component:
- `sampleAds` in PromotionalBanner.tsx
- `serviceAds` in ServiceAdCards.tsx
- Ad objects in NativeAdCard.tsx

### Animations
All components use CSS transitions and transforms. Adjust timing and effects in the style objects.

---

## 📱 Responsive Design

All components are fully responsive:
- **Desktop**: Full-width banners, multi-column grids
- **Tablet**: Adjusted layouts, smaller fonts
- **Mobile**: Single column, compact spacing

---

## 🚀 Best Practices

1. **Placement**:
   - Use `PromotionalBanner` at page tops for maximum visibility
   - Place `ServiceAdCards` in content middle for natural flow
   - Mix `NativeAdCard` with regular listings for seamless integration

2. **Performance**:
   - Lazy load images for better performance
   - Use auto-rotate sparingly (one per page)
   - Optimize image sizes

3. **User Experience**:
   - Always provide close buttons
   - Keep animations smooth (0.3s transitions)
   - Ensure ads don't block critical content
   - Make CTAs clear and prominent

---

## 🎯 Integration Examples

### Homepage
```tsx
<PromotionalBanner position="top" autoRotate={true} />
<ServiceAdCards />
```

### Listing Page
```tsx
<div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 24 }}>
  <div>
    {/* Regular listings */}
    <ListingCard />
    <NativeAdCard variant="property" />
    <ListingCard />
  </div>
  <div>
    <PromotionalBanner position="sidebar" />
  </div>
</div>
```

### Chat/Messages
```tsx
<NativeAdCard variant="partner" />
```

---

## 🔗 Live Demo

Visit `/ads-showcase` route to see all components in action with integration examples.

---

## 📝 Notes

- All ads are click-through enabled (opens in new tab)
- Sponsored badges are clearly visible
- Components follow accessibility guidelines
- Mobile-first responsive design
- No external dependencies (pure React + inline styles)

---

## 🎨 Design Inspiration

- **NoBroker**: Clean cards, prominent CTAs, service grids
- **CouponDunia**: Colorful gradients, discount badges, category cards
- **Modern Web**: Glassmorphism, smooth animations, elegant spacing
