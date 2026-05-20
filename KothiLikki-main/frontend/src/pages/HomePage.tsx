import HeroSection from '../components/home/HeroSection';
import FeaturedSection from '../components/home/FeaturedSection';
import TopBuilders from '../components/home/TopBuilders';
import TestimonialsSection from '../components/home/TestimonialsSection';
import ArticlesSection from '../components/home/ArticlesSection';
import PromotionalBanner from '../components/ads/PromotionalBanner';
import ServiceAdCards from '../components/ads/ServiceAdCards';
import FeaturedItemsShowcase from '../components/ads/FeaturedItemsShowcase';

export default function HomePage() {
  return (
    <div className="bg-white">
      <HeroSection />

      {/* Top Promotional Banner */}
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <PromotionalBanner position="top" autoRotate={true} rotateInterval={5000} />
      </div>

      <FeaturedSection title="Upcoming New Launches" subtitle="Newly launched residential projects" category="property_sell" viewAllPath="/listings?category=property_sell" alwaysShow />
      
      {/* Featured Items from All Categories */}
      <div style={{ maxWidth: 1200, margin: '32px auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ fontSize: 28, fontWeight: 800, color: '#1e293b', marginBottom: 6 }}>
            ⭐ Best of INFRAALL
          </h2>
          <p style={{ fontSize: 14, color: '#64748b' }}>
            Top picks from Properties, Furniture, Services & Materials
          </p>
        </div>
        <FeaturedItemsShowcase />
      </div>
      
      {/* Service Ads Section */}
      <div style={{ maxWidth: 1200, margin: '48px auto 0', padding: '0 24px' }}>
        <ServiceAdCards />
      </div>

      <FeaturedSection title="Recently Launched Projects" subtitle="Fresh listings just added" category="property_sell" viewAllPath="/listings?category=property_sell" bgGray alwaysShow />

      <FeaturedSection title="Top Selling Recommended Projects" subtitle="Projects in high demand" category="property_sell" viewAllPath="/listings?category=property_sell" alwaysShow />

      <TopBuilders />
      <TestimonialsSection />
      <ArticlesSection />
    </div>
  );
}

