import { useState, useEffect } from 'react';
import { X, ExternalLink, Sparkles, Tag, TrendingUp } from 'lucide-react';

interface Ad {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  discount: string;
  image: string;
  backgroundColor: string;
  textColor: string;
  buttonText: string;
  link: string;
  badge?: string;
}

const sampleAds: Ad[] = [
  {
    id: '1',
    title: 'Buy Your Dream Property',
    subtitle: '100% Owner Properties',
    description: 'Direct deals with property owners',
    discount: 'INFRAALL VERIFIED',
    image: '🏠',
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    textColor: '#ffffff',
    buttonText: 'Browse Properties',
    link: '/buy-property',
    badge: 'Most Trusted'
  },
  {
    id: '2',
    title: 'Rent Your Perfect Home',
    subtitle: 'Thousands of Options',
    description: 'Find rental properties across India',
    discount: 'VERIFIED LISTINGS',
    image: '🔑',
    backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    textColor: '#ffffff',
    buttonText: 'View Rentals',
    link: '/property-rentals',
    badge: 'Popular'
  },
  {
    id: '3',
    title: 'Furniture on Rent',
    subtitle: 'Quality Furniture',
    description: 'Flexible rental plans for your home',
    discount: 'FROM ₹499/MONTH',
    image: '🛋️',
    backgroundColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    textColor: '#ffffff',
    buttonText: 'Browse Furniture',
    link: '/furniture',
    badge: 'Flexible Plans'
  },
  {
    id: '4',
    title: 'Professional Home Services',
    subtitle: 'Trusted Experts',
    description: 'Cleaning, painting, repairs & more',
    discount: 'BOOK INSTANTLY',
    image: '🔧',
    backgroundColor: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    textColor: '#ffffff',
    buttonText: 'Book Service',
    link: '/services',
    badge: 'Expert Service'
  },
  {
    id: '5',
    title: 'Building Materials',
    subtitle: 'Quality Materials',
    description: 'Cement, steel, bricks at best prices',
    discount: 'WHOLESALE RATES',
    image: '🏗️',
    backgroundColor: 'linear-gradient(135deg, #f97316 0%, #ea580c 100%)',
    textColor: '#ffffff',
    buttonText: 'Shop Now',
    link: '/materials',
    badge: 'Best Prices'
  },
  {
    id: '6',
    title: 'List Your Property FREE',
    subtitle: 'For Property Owners',
    description: 'Reach thousands of buyers & tenants',
    discount: 'FREE POSTING',
    image: '📝',
    backgroundColor: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    textColor: '#ffffff',
    buttonText: 'Post Now',
    link: '/post-property-request',
    badge: 'For Owners'
  }
];

interface PromotionalBannerProps {
  position?: 'top' | 'middle' | 'bottom' | 'sidebar';
  autoRotate?: boolean;
  rotateInterval?: number;
}

export default function PromotionalBanner({ 
  position = 'middle', 
  autoRotate = true,
  rotateInterval = 5000 
}: PromotionalBannerProps) {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const currentAd = sampleAds[currentAdIndex];

  useEffect(() => {
    if (!autoRotate || isHovered) return;

    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % sampleAds.length);
    }, rotateInterval);

    return () => clearInterval(interval);
  }, [autoRotate, rotateInterval, isHovered]);

  if (!isVisible) return null;

  const getPositionStyles = () => {
    switch (position) {
      case 'top':
        return { marginBottom: 24 };
      case 'bottom':
        return { marginTop: 24 };
      case 'sidebar':
        return { marginBottom: 16 };
      default:
        return { margin: '24px 0' };
    }
  };

  return (
    <div 
      style={{
        ...getPositionStyles(),
        position: 'relative',
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Close Button */}
      <button
        onClick={() => setIsVisible(false)}
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 10,
          background: 'rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)',
          border: 'none',
          borderRadius: '50%',
          width: 32,
          height: 32,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.5)';
          e.currentTarget.style.transform = 'scale(1.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(0,0,0,0.3)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <X size={16} color="#fff" />
      </button>

      {/* Ad Content */}
      <div
        style={{
          background: currentAd.backgroundColor,
          padding: position === 'sidebar' ? 20 : 32,
          display: 'flex',
          alignItems: 'center',
          gap: 24,
          minHeight: position === 'sidebar' ? 180 : 200,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Decorative Elements */}
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(40px)'
        }} />
        <div style={{
          position: 'absolute',
          bottom: -30,
          left: -30,
          width: 150,
          height: 150,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.1)',
          filter: 'blur(30px)'
        }} />

        {/* Left Content */}
        <div style={{ flex: 1, zIndex: 1 }}>
          {/* Badge */}
          {currentAd.badge && (
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'rgba(255,255,255,0.25)',
              backdropFilter: 'blur(10px)',
              padding: '6px 14px',
              borderRadius: 20,
              marginBottom: 12,
              fontSize: 12,
              fontWeight: 700,
              color: currentAd.textColor,
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <Sparkles size={14} />
              {currentAd.badge}
            </div>
          )}

          {/* Title */}
          <h3 style={{
            fontSize: position === 'sidebar' ? 20 : 26,
            fontWeight: 800,
            color: currentAd.textColor,
            marginBottom: 6,
            lineHeight: 1.2
          }}>
            {currentAd.title}
          </h3>

          {/* Subtitle */}
          <p style={{
            fontSize: position === 'sidebar' ? 13 : 15,
            color: currentAd.textColor,
            opacity: 0.9,
            marginBottom: 8,
            fontWeight: 500
          }}>
            {currentAd.subtitle}
          </p>

          {/* Description */}
          <p style={{
            fontSize: position === 'sidebar' ? 12 : 14,
            color: currentAd.textColor,
            opacity: 0.85,
            marginBottom: 16,
            lineHeight: 1.5
          }}>
            {currentAd.description}
          </p>

          {/* Discount Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(255,255,255,0.95)',
            padding: '10px 18px',
            borderRadius: 12,
            marginBottom: 16,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
          }}>
            <Tag size={18} color="#f97316" />
            <span style={{
              fontSize: position === 'sidebar' ? 14 : 16,
              fontWeight: 800,
              background: 'linear-gradient(135deg, #f97316, #ea580c)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              {currentAd.discount}
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={() => window.location.href = currentAd.link}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              background: 'rgba(255,255,255,0.95)',
              color: '#1e293b',
              padding: position === 'sidebar' ? '12px 20px' : '14px 28px',
              borderRadius: 12,
              border: 'none',
              fontSize: position === 'sidebar' ? 14 : 15,
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
            }}
          >
            {currentAd.buttonText}
            <ExternalLink size={16} />
          </button>
        </div>

        {/* Right Icon/Image */}
        {position !== 'sidebar' && (
          <div style={{
            fontSize: 80,
            opacity: 0.9,
            zIndex: 1,
            animation: 'float 3s ease-in-out infinite'
          }}>
            {currentAd.image}
          </div>
        )}
      </div>

      {/* Progress Indicators */}
      {autoRotate && (
        <div style={{
          display: 'flex',
          gap: 8,
          justifyContent: 'center',
          padding: '12px 0',
          background: 'rgba(0,0,0,0.05)'
        }}>
          {sampleAds.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentAdIndex(index)}
              style={{
                width: currentAdIndex === index ? 24 : 8,
                height: 8,
                borderRadius: 4,
                border: 'none',
                background: currentAdIndex === index 
                  ? 'linear-gradient(135deg, #f97316, #ea580c)' 
                  : 'rgba(0,0,0,0.2)',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            />
          ))}
        </div>
      )}

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
}
