import { useState, useEffect } from 'react';
import { Star, MapPin, Home, Bed, Bath, Maximize } from 'lucide-react';
import api from '../../api';

interface Property {
  id: number;
  title: string;
  city: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  photos: string[];
  listingType: string;
}

export default function FeaturedPropertyAd() {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperty();
  }, []);

  const fetchFeaturedProperty = async () => {
    try {
      // Fetch a random property from listings
      const { data } = await api.get('/listings', {
        params: {
          limit: 1,
          category: 'property_sell'
        }
      });
      
      if (data && data.listings && data.listings.length > 0) {
        setProperty(data.listings[0]);
      } else if (data && Array.isArray(data) && data.length > 0) {
        setProperty(data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch featured property:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        background: '#ffffff',
        borderRadius: 16,
        padding: 40,
        textAlign: 'center',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid #f97316',
          borderTopColor: 'transparent',
          borderRadius: '50%',
          margin: '0 auto',
          animation: 'spin 1s linear infinite'
        }} />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!property) {
    return null;
  }

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  return (
    <div
      onClick={() => window.location.href = `/listing/${property.id}`}
      style={{
        background: '#ffffff',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
    >
      {/* Featured Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        left: 12,
        background: 'linear-gradient(135deg, #f97316, #ea580c)',
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        zIndex: 2,
        boxShadow: '0 2px 8px rgba(249,115,22,0.4)'
      }}>
        ⭐ FEATURED
      </div>

      {/* Property Type Badge */}
      <div style={{
        position: 'absolute',
        top: 12,
        right: 12,
        background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(10px)',
        color: '#ffffff',
        padding: '6px 12px',
        borderRadius: 8,
        fontSize: 11,
        fontWeight: 700,
        zIndex: 2
      }}>
        {property.listingType === 'property_sell' ? 'FOR SALE' : 'FOR RENT'}
      </div>

      {/* Image */}
      <div style={{
        height: 220,
        background: property.photos && property.photos.length > 0
          ? `url(${property.photos[0]}) center/cover`
          : 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
        position: 'relative'
      }}>
        {(!property.photos || property.photos.length === 0) && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            fontSize: 48,
            opacity: 0.3
          }}>
            🏠
          </div>
        )}
      </div>

      {/* Content */}
      <div style={{ padding: 20 }}>
        {/* Title */}
        <h3 style={{
          fontSize: 18,
          fontWeight: 700,
          color: '#1e293b',
          marginBottom: 8,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {property.title}
        </h3>

        {/* Location */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          color: '#64748b',
          fontSize: 13,
          marginBottom: 12
        }}>
          <MapPin size={14} />
          {property.city}
        </div>

        {/* Features */}
        {(property.bedrooms || property.bathrooms || property.area) && (
          <div style={{
            display: 'flex',
            gap: 16,
            marginBottom: 16,
            paddingBottom: 16,
            borderBottom: '1px solid #e2e8f0'
          }}>
            {property.bedrooms && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#475569'
              }}>
                <Bed size={16} color="#64748b" />
                {property.bedrooms} BHK
              </div>
            )}
            {property.bathrooms && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#475569'
              }}>
                <Bath size={16} color="#64748b" />
                {property.bathrooms} Bath
              </div>
            )}
            {property.area && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: 13,
                color: '#475569'
              }}>
                <Maximize size={16} color="#64748b" />
                {property.area} sq.ft
              </div>
            )}
          </div>
        )}

        {/* Price & CTA */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <div style={{
              fontSize: 11,
              color: '#64748b',
              marginBottom: 2
            }}>
              Price
            </div>
            <div style={{
              fontSize: 22,
              fontWeight: 800,
              color: '#059669'
            }}>
              {formatPrice(property.price)}
            </div>
          </div>

          <button style={{
            background: 'linear-gradient(135deg, #f97316, #ea580c)',
            color: '#ffffff',
            padding: '10px 20px',
            borderRadius: 10,
            border: 'none',
            fontSize: 14,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'transform 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
