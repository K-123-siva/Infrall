import { Wrench, Truck, PaintBucket, Hammer, Zap, Shield, ArrowRight, Home, Sofa } from 'lucide-react';

interface ServiceAd {
  id: string;
  title: string;
  description: string;
  discount: string;
  icon: any;
  color: string;
  bgGradient: string;
  link: string;
}

const serviceAds: ServiceAd[] = [
  {
    id: '1',
    title: 'Buy Property',
    description: 'Verified properties for sale',
    discount: 'BROWSE NOW',
    icon: Home,
    color: '#8b5cf6',
    bgGradient: 'linear-gradient(135deg, #ede9fe, #ddd6fe)',
    link: '/buy-property'
  },
  {
    id: '2',
    title: 'Rent Property',
    description: 'Find your perfect rental',
    discount: 'EXPLORE',
    icon: Home,
    color: '#3b82f6',
    bgGradient: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
    link: '/property-rentals'
  },
  {
    id: '3',
    title: 'Furniture Rental',
    description: 'Quality furniture on rent',
    discount: 'FROM ₹499',
    icon: Sofa,
    color: '#f59e0b',
    bgGradient: 'linear-gradient(135deg, #fef3c7, #fde68a)',
    link: '/furniture'
  },
  {
    id: '4',
    title: 'Home Services',
    description: 'Professional services',
    discount: 'BOOK NOW',
    icon: Wrench,
    color: '#10b981',
    bgGradient: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
    link: '/services'
  },
  {
    id: '5',
    title: 'Building Materials',
    description: 'Construction materials',
    discount: 'SHOP NOW',
    icon: Hammer,
    color: '#ef4444',
    bgGradient: 'linear-gradient(135deg, #fee2e2, #fecaca)',
    link: '/materials'
  },
  {
    id: '6',
    title: 'Post Property',
    description: 'List your property free',
    discount: 'POST FREE',
    icon: PaintBucket,
    color: '#06b6d4',
    bgGradient: 'linear-gradient(135deg, #cffafe, #a5f3fc)',
    link: '/post-property-request'
  }
];

export default function ServiceAdCards() {
  return (
    <div style={{ margin: '32px 0' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: 20
      }}>
        <div>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 800, 
            color: '#1e293b',
            marginBottom: 4
          }}>
            Our Services & Features
          </h2>
          <p style={{ 
            fontSize: 14, 
            color: '#64748b'
          }}>
            Everything you need for your property needs
          </p>
        </div>
        <button
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#f97316',
            background: 'none',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'gap 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.gap = '10px'}
          onMouseLeave={(e) => e.currentTarget.style.gap = '6px'}
        >
          See All
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Service Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16
      }}>
        {serviceAds.map((service) => {
          const Icon = service.icon;
          return (
            <div
              key={service.id}
              onClick={() => window.location.href = service.link}
              style={{
                background: service.bgGradient,
                borderRadius: 16,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                border: '1px solid rgba(0,0,0,0.05)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Decorative Circle */}
              <div style={{
                position: 'absolute',
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.4)',
                filter: 'blur(20px)'
              }} />

              {/* Icon */}
              <div style={{
                width: 56,
                height: 56,
                borderRadius: 14,
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                position: 'relative',
                zIndex: 1
              }}>
                <Icon size={28} color={service.color} />
              </div>

              {/* Content */}
              <h3 style={{
                fontSize: 18,
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: 6,
                position: 'relative',
                zIndex: 1
              }}>
                {service.title}
              </h3>

              <p style={{
                fontSize: 13,
                color: '#64748b',
                marginBottom: 12,
                lineHeight: 1.5,
                position: 'relative',
                zIndex: 1
              }}>
                {service.description}
              </p>

              {/* Discount Badge */}
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                background: service.color,
                color: '#ffffff',
                padding: '6px 12px',
                borderRadius: 8,
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: '0.5px',
                position: 'relative',
                zIndex: 1
              }}>
                {service.discount}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Banner */}
      <div style={{
        marginTop: 24,
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        borderRadius: 16,
        padding: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        color: '#ffffff',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 200,
          height: 200,
          borderRadius: '50%',
          background: 'rgba(249,115,22,0.2)',
          filter: 'blur(40px)'
        }} />

        <div style={{ zIndex: 1 }}>
          <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>
            Most Trusted Platform
          </h3>
          <p style={{ fontSize: 14, opacity: 0.9 }}>
            100% Owner Properties | Zero Brokerage
          </p>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          fontSize: 14,
          fontWeight: 600,
          zIndex: 1
        }}>
          <span>4.8</span>
          <span style={{ color: '#fbbf24', fontSize: 18 }}>★</span>
        </div>
      </div>
    </div>
  );
}
