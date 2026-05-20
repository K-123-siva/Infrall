import { useState, useEffect } from 'react';
import { Star, MapPin, Bed, Bath, Maximize, TrendingUp, Sofa, Wrench, Package } from 'lucide-react';
import api from '../../api';

interface Item {
  id: number;
  title: string;
  city?: string;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  photos: string[];
  images?: string[];
  category: string;
}

export default function FeaturedItemsShowcase() {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      console.log('🔍 Fetching featured items from all categories...');
      
      // Fetch random items from each category by adding a random sort
      const [propertiesSell, propertiesRent, furniture, services, materials] = await Promise.all([
        api.get('/listings', { params: { limit: 1, category: 'property_sell', sort: 'random' } }).catch(e => ({ data: [] })),
        api.get('/listings', { params: { limit: 1, category: 'property_rent', sort: 'random' } }).catch(e => ({ data: [] })),
        api.get('/listings', { params: { limit: 1, category: 'furniture', sort: 'random' } }).catch(e => ({ data: [] })),
        api.get('/listings', { params: { limit: 1, category: 'services', sort: 'random' } }).catch(e => ({ data: [] })),
        api.get('/listings', { params: { limit: 1, category: 'materials', sort: 'random' } }).catch(e => ({ data: [] }))
      ]);

      console.log('📦 API Responses:', {
        propertiesSell: propertiesSell.data,
        propertiesRent: propertiesRent.data,
        furniture: furniture.data,
        services: services.data,
        materials: materials.data
      });

      const allItems: Item[] = [];

      // Helper function to extract listings
      const extractListings = (response: any, count: number, categoryName: string) => {
        let items = [];
        if (response.data?.listings) {
          items = response.data.listings.slice(0, count);
        } else if (Array.isArray(response.data)) {
          items = response.data.slice(0, count);
        }
        console.log(`✅ ${categoryName}: ${items.length} items found`);
        return items;
      };

      // Add items from each category
      allItems.push(...extractListings(propertiesSell, 1, 'Property Sell'));
      allItems.push(...extractListings(propertiesRent, 1, 'Property Rent'));
      allItems.push(...extractListings(furniture, 1, 'Furniture'));
      allItems.push(...extractListings(services, 1, 'Services'));
      allItems.push(...extractListings(materials, 1, 'Materials'));

      console.log(`📊 Total items collected: ${allItems.length}`);

      // Map images field to photos if needed
      const mappedItems = allItems.map(item => ({
        ...item,
        photos: item.photos || item.images || []
      }));

      // Shuffle the items array for additional randomness
      const shuffledItems = mappedItems.sort(() => Math.random() - 0.5);

      console.log('🎲 Featured items loaded (randomized):', shuffledItems);
      setItems(shuffledItems);
    } catch (error) {
      console.error('❌ Failed to fetch featured items:', error);
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

  const getCategoryInfo = (category: string) => {
    const types: any = {
      'property_sell': { label: 'FOR SALE', color: '#8b5cf6', icon: '🏠', bg: 'linear-gradient(135deg, #ede9fe, #ddd6fe)' },
      'property_rent': { label: 'FOR RENT', color: '#3b82f6', icon: '🔑', bg: 'linear-gradient(135deg, #dbeafe, #bfdbfe)' },
      'furniture': { label: 'FURNITURE', color: '#f59e0b', icon: '🛋️', bg: 'linear-gradient(135deg, #fef3c7, #fde68a)' },
      'services': { label: 'SERVICE', color: '#10b981', icon: '🔧', bg: 'linear-gradient(135deg, #d1fae5, #a7f3d0)' },
      'materials': { label: 'MATERIAL', color: '#ef4444', icon: '🏗️', bg: 'linear-gradient(135deg, #fee2e2, #fecaca)' }
    };
    return types[category] || types['property_sell'];
  };

  if (loading) {
    return (
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: 24
      }}>
        {[...Array(6)].map((_, i) => (
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

  if (items.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '60px 20px',
        background: '#f8fafc',
        borderRadius: 16,
        border: '2px dashed #cbd5e1'
      }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📦</div>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: '#475569', marginBottom: 8 }}>
          No Featured Items Available
        </h3>
        <p style={{ fontSize: 14, color: '#64748b', margin: 0 }}>
          Check back soon for amazing deals from all categories!
        </p>
      </div>
    );
  }

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: 24
    }}>
      {items.map((item) => {
        const categoryInfo = getCategoryInfo(item.category);
        
        return (
          <div
            key={`${item.category}-${item.id}`}
            onClick={() => window.location.href = `/listing/${item.id}`}
            style={{
              background: categoryInfo.bg,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
              border: `2px solid ${categoryInfo.color}`,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = `0 16px 32px ${categoryInfo.color}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
            }}
          >
            {/* Category Badge */}
            <div style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: categoryInfo.color,
              color: '#ffffff',
              padding: '8px 16px',
              borderRadius: 10,
              fontSize: 11,
              fontWeight: 800,
              zIndex: 2,
              boxShadow: `0 4px 12px ${categoryInfo.color}80`,
              display: 'flex',
              alignItems: 'center',
              gap: 6
            }}>
              <TrendingUp size={14} />
              {categoryInfo.label}
            </div>

            {/* Featured Star */}
            <div style={{
              position: 'absolute',
              top: 12,
              right: 12,
              background: 'rgba(255,255,255,0.95)',
              color: '#f97316',
              padding: '6px 10px',
              borderRadius: 8,
              fontSize: 11,
              fontWeight: 700,
              zIndex: 2,
              display: 'flex',
              alignItems: 'center',
              gap: 4
            }}>
              <Star size={12} fill="#f97316" />
              BEST
            </div>

            {/* Image */}
            <div style={{
              height: 200,
              background: item.photos && item.photos.length > 0
                ? `url(${item.photos[0]}) center/cover`
                : `linear-gradient(135deg, ${categoryInfo.color}20, ${categoryInfo.color}40)`,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {(!item.photos || item.photos.length === 0) && (
                <div style={{
                  fontSize: 64,
                  opacity: 0.5
                }}>
                  {categoryInfo.icon}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: 20, background: '#ffffff' }}>
              {/* Title */}
              <h3 style={{
                fontSize: 17,
                fontWeight: 700,
                color: '#1e293b',
                marginBottom: 8,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                minHeight: 44
              }}>
                {item.title}
              </h3>

              {/* Location (for properties) */}
              {item.city && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  color: '#64748b',
                  fontSize: 13,
                  marginBottom: 12
                }}>
                  <MapPin size={14} />
                  {item.city}
                </div>
              )}

              {/* Features (for properties) */}
              {(item.bedrooms || item.bathrooms || item.area) && (
                <div style={{
                  display: 'flex',
                  gap: 12,
                  marginBottom: 12,
                  paddingBottom: 12,
                  borderBottom: '1px solid #e2e8f0',
                  flexWrap: 'wrap'
                }}>
                  {item.bedrooms && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: '#475569',
                      fontWeight: 600
                    }}>
                      <Bed size={14} color={categoryInfo.color} />
                      {item.bedrooms} BHK
                    </div>
                  )}
                  {item.bathrooms && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: '#475569',
                      fontWeight: 600
                    }}>
                      <Bath size={14} color={categoryInfo.color} />
                      {item.bathrooms}
                    </div>
                  )}
                  {item.area && (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 4,
                      fontSize: 12,
                      color: '#475569',
                      fontWeight: 600
                    }}>
                      <Maximize size={14} color={categoryInfo.color} />
                      {item.area} sq.ft
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
                    fontSize: 10,
                    color: '#64748b',
                    marginBottom: 2,
                    fontWeight: 600
                  }}>
                    Price
                  </div>
                  <div style={{
                    fontSize: 20,
                    fontWeight: 800,
                    color: categoryInfo.color
                  }}>
                    {formatPrice(item.price)}
                  </div>
                </div>

                <button style={{
                  background: categoryInfo.color,
                  color: '#ffffff',
                  padding: '10px 20px',
                  borderRadius: 10,
                  border: 'none',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                  boxShadow: `0 4px 12px ${categoryInfo.color}40`
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  View
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
