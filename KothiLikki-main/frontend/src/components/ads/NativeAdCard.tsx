import { ExternalLink, Star, TrendingUp, Award } from 'lucide-react';

interface NativeAdProps {
  variant?: 'property' | 'service' | 'partner';
}

export default function NativeAdCard({ variant = 'property' }: NativeAdProps) {
  
  const propertyAd = {
    badge: 'Featured',
    title: 'Premium Properties for Sale',
    location: 'Across India',
    price: 'Zero Brokerage',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400',
    features: ['Verified', '100% Owner', 'Best Prices'],
    rating: 4.8,
    reviews: 1245,
    link: '/buy-property'
  };

  const serviceAd = {
    badge: 'Popular Service',
    title: 'Home Services',
    subtitle: 'Professional services for your home',
    discount: 'Book Trusted Professionals',
    image: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=400',
    features: ['Verified Professionals', 'Best Rates', 'Quick Service'],
    link: '/services'
  };

  const partnerAd = {
    badge: 'Featured',
    logo: '🏠',
    title: 'Furniture Rental',
    subtitle: 'Rent quality furniture for your home',
    offer: 'Flexible rental plans starting ₹499/month',
    benefits: ['Quality Furniture', 'Flexible Plans', 'Easy Returns'],
    cta: 'Browse Furniture',
    link: '/furniture'
  };

  if (variant === 'service') {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        transition: 'all 0.3s ease',
        cursor: 'pointer'
      }}
      onClick={() => window.location.href = serviceAd.link}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}>
        {/* Badge */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          background: 'rgba(249,115,22,0.95)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 4
        }}>
          <TrendingUp size={12} />
          {serviceAd.badge}
        </div>

        {/* Image */}
        <div style={{
          height: 200,
          background: `url(${serviceAd.image}) center/cover`,
          position: 'relative'
        }}>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
            padding: '40px 16px 16px'
          }}>
            <div style={{
              background: '#fbbf24',
              color: '#1e293b',
              padding: '8px 14px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              display: 'inline-block'
            }}>
              {serviceAd.discount}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 20 }}>
          <h3 style={{
            fontSize: 20,
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 6
          }}>
            {serviceAd.title}
          </h3>

          <p style={{
            fontSize: 14,
            color: '#64748b',
            marginBottom: 16,
            lineHeight: 1.5
          }}>
            {serviceAd.subtitle}
          </p>

          {/* Features */}
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 8,
            marginBottom: 16
          }}>
            {serviceAd.features.map((feature, index) => (
              <div key={index} style={{
                background: '#f1f5f9',
                color: '#475569',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 12,
                fontWeight: 600
              }}>
                {feature}
              </div>
            ))}
          </div>

          {/* CTA */}
          <button style={{
            width: '100%',
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#ffffff',
            padding: '12px',
            borderRadius: 10,
            border: 'none',
            fontSize: 15,
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            Book Now
            <ExternalLink size={16} />
          </button>
        </div>
      </div>
    );
  }

  if (variant === 'partner') {
    return (
      <div style={{
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        borderRadius: 16,
        padding: 24,
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'transform 0.3s ease'
      }}
      onClick={() => window.location.href = partnerAd.link}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
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

        {/* Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          padding: '6px 12px',
          borderRadius: 20,
          fontSize: 11,
          fontWeight: 700,
          marginBottom: 16,
          border: '1px solid rgba(255,255,255,0.3)'
        }}>
          <Award size={12} />
          {partnerAd.badge}
        </div>

        {/* Logo & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 12 }}>
          <div style={{
            fontSize: 48,
            background: '#ffffff',
            borderRadius: 12,
            width: 64,
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {partnerAd.logo}
          </div>
          <div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
              {partnerAd.title}
            </h3>
            <p style={{ fontSize: 13, opacity: 0.9 }}>
              {partnerAd.subtitle}
            </p>
          </div>
        </div>

        {/* Offer */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          color: '#1e293b',
          padding: '12px 16px',
          borderRadius: 10,
          marginBottom: 16,
          fontWeight: 700,
          fontSize: 15
        }}>
          {partnerAd.offer}
        </div>

        {/* Benefits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 12,
          marginBottom: 20
        }}>
          {partnerAd.benefits.map((benefit, index) => (
            <div key={index} style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
              padding: '10px',
              borderRadius: 8,
              fontSize: 12,
              fontWeight: 600,
              textAlign: 'center',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              {benefit}
            </div>
          ))}
        </div>

        {/* CTA */}
        <button style={{
          width: '100%',
          background: '#ffffff',
          color: '#1e40af',
          padding: '14px',
          borderRadius: 10,
          border: 'none',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          transition: 'transform 0.2s ease'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          {partnerAd.cta}
          <ExternalLink size={16} />
        </button>
      </div>
    );
  }

  // Default: Property Ad
  return (
    <div style={{
      background: '#ffffff',
      borderRadius: 16,
      overflow: 'hidden',
      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      border: '1px solid #e2e8f0',
      transition: 'all 0.3s ease',
      cursor: 'pointer',
      position: 'relative'
    }}
    onClick={() => window.location.href = propertyAd.link}
    onMouseEnter={(e) => {
      e.currentTarget.style.transform = 'translateY(-4px)';
      e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.transform = 'translateY(0)';
      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
    }}>
      {/* Sponsored Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'rgba(249,115,22,0.95)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        padding: '4px 10px',
        borderRadius: 6,
        fontSize: 11,
        fontWeight: 700,
        zIndex: 2
      }}>
        {propertyAd.badge}
      </div>

      {/* Image */}
      <div style={{
        height: 200,
        background: `url(${propertyAd.image}) center/cover`
      }} />

      {/* Content */}
      <div style={{ padding: 16 }}>
        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: 4
        }}>
          {propertyAd.title}
        </h3>

        <p style={{
          fontSize: 13,
          color: '#64748b',
          marginBottom: 12
        }}>
          {propertyAd.location}
        </p>

        {/* Features */}
        <div style={{
          display: 'flex',
          gap: 8,
          marginBottom: 12,
          flexWrap: 'wrap'
        }}>
          {propertyAd.features.map((feature, index) => (
            <span key={index} style={{
              background: '#f1f5f9',
              color: '#475569',
              padding: '4px 10px',
              borderRadius: 6,
              fontSize: 12,
              fontWeight: 600
            }}>
              {feature}
            </span>
          ))}
        </div>

        {/* Price & Rating */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{
            fontSize: 20,
            fontWeight: 800,
            color: '#059669'
          }}>
            {propertyAd.price}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 4,
            fontSize: 13,
            fontWeight: 600,
            color: '#64748b'
          }}>
            <Star size={14} fill="#fbbf24" color="#fbbf24" />
            {propertyAd.rating} ({propertyAd.reviews})
          </div>
        </div>
      </div>
    </div>
  );
}
