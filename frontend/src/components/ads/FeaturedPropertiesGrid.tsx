import { useState, useEffect } from 'react';
import { Star, MapPin, Bed, Bath, Maximize, TrendingUp } from 'lucide-react';
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

interface FeaturedPropertiesGridProps {
  count?: number; // How many properties to show
}

export default function FeaturedPropertiesGrid({ count = 3 }: FeaturedPropertiesGridProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProperties();
  }, [count]);

  const fetchFeaturedProperties = async () => {
    try {
      const { data } = await api.get('/listings', {
        params: {
          limit: count,
          category: 'property_sell'
        }
      });
      
      if (data && data.listings && Array.isArray(data.listings)) {
        setProperties(data.listings);
      } else if (data && Array.isArray(data)) {
        setProperties(data);
      }
    } catch (error) {
      console.error('Failed to fetch featured properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} Lac`;
    }
    return `₹${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
        gap: 24
      }}>
        {[...Array(count)].map((_, i) => (
          <div key={i} style={{
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
          </div>
        ))}
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (properties.length === 0) {
    return null;
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
      gap: 24
    }}>
      {properties.map((property) => (
        <div
          key={property.id}
          onClick={() => window.location.href = `/listing/${property.id}`}
          style={{
            background: '#ffffff',
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            border: '2px solid #f97316',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            position: 'relative'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = '0 16px 32px rgba(249,115,22,0.25)';
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
            padding: '8px 16px',
            borderRadius: 10,
            fontSize: 12,
            fontWeight: 800,
            zIndex: 2,
            boxShadow: '0 4px 12px rgba(249,115,22,0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <TrendingUp size={14} />
            FEATURED
          </div>

          {/* Property Type Badge */}
          <div style={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: 'rgba(0,0,0,0.75)',
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
            
            {/* Gradient Overlay */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)'
            }} />
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
              overflow: 'hidden',
              minHeight: 48
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
              marginBottom: 16
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
                    color: '#475569',
                    fontWeight: 600
                  }}>
                    <Bed size={16} color="#f97316" />
                    {property.bedrooms} BHK
                  </div>
                )}
                {property.bathrooms && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    color: '#475569',
                    fontWeight: 600
                  }}>
                    <Bath size={16} color="#f97316" />
                    {property.bathrooms}
                  </div>
                )}
                {property.area && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    color: '#475569',
                    fontWeight: 600
                  }}>
                    <Maximize size={16} color="#f97316" />
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
                  marginBottom: 2,
                  fontWeight: 600
                }}>
                  Price
                </div>
                <div style={{
                  fontSize: 24,
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #059669, #10b981)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}>
                  {formatPrice(property.price)}
                </div>
              </div>

              <button style={{
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                color: '#ffffff',
                padding: '12px 24px',
                borderRadius: 10,
                border: 'none',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'transform 0.2s ease',
                boxShadow: '0 4px 12px rgba(249,115,22,0.3)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
