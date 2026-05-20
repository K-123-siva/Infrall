import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import PromotionalBanner from '../components/ads/PromotionalBanner';
import ServiceAdCards from '../components/ads/ServiceAdCards';
import NativeAdCard from '../components/ads/NativeAdCard';

export default function AdShowcasePage() {
  const navigate = useNavigate();

  return (
    <div style={{ 
      background: 'linear-gradient(135deg, #fff7ed 0%, #fef3c7 50%, #fff7ed 100%)', 
      minHeight: '100vh', 
      padding: '40px 24px' 
    }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Back Button */}
        <button 
          onClick={() => navigate('/')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 8, 
            color: '#92400e', 
            background: 'none', 
            border: 'none', 
            fontSize: 14, 
            fontWeight: 500, 
            cursor: 'pointer', 
            marginBottom: 24 
          }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </button>

        {/* Page Header */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          marginBottom: 32,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ 
            fontSize: 32, 
            fontWeight: 800, 
            color: '#1e293b', 
            marginBottom: 8 
          }}>
            Advertisement Showcase
          </h1>
          <p style={{ 
            fontSize: 16, 
            color: '#64748b' 
          }}>
            Elegant and modern ad components for your platform
          </p>
        </div>

        {/* Top Promotional Banner */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: 16 
          }}>
            1. Promotional Banner (Auto-Rotating)
          </h2>
          <PromotionalBanner position="top" autoRotate={true} rotateInterval={4000} />
        </div>

        {/* Service Ad Cards */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: 16 
          }}>
            2. Service Advertisement Cards
          </h2>
          <ServiceAdCards />
        </div>

        {/* Native Ads Grid */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: 16 
          }}>
            3. Native Ad Cards (Blends with Content)
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 24
          }}>
            <NativeAdCard variant="property" />
            <NativeAdCard variant="service" />
            <NativeAdCard variant="partner" />
          </div>
        </div>

        {/* Sidebar Banner Example */}
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ 
            fontSize: 20, 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: 16 
          }}>
            4. Sidebar Banner (Compact Version)
          </h2>
          <div style={{ maxWidth: 400 }}>
            <PromotionalBanner position="sidebar" autoRotate={true} />
          </div>
        </div>

        {/* Integration Guide */}
        <div style={{
          background: '#ffffff',
          borderRadius: 20,
          padding: 32,
          boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ 
            fontSize: 24, 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: 16 
          }}>
            How to Use These Ads
          </h2>
          
          <div style={{ 
            background: '#f8fafc', 
            borderRadius: 12, 
            padding: 20,
            marginBottom: 16
          }}>
            <h3 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: 12 
            }}>
              1. Promotional Banner
            </h3>
            <pre style={{
              background: '#1e293b',
              color: '#10b981',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              overflow: 'auto',
              fontFamily: 'monospace'
            }}>
{`import PromotionalBanner from './components/ads/PromotionalBanner';

// In your component:
<PromotionalBanner 
  position="top"        // top, middle, bottom, sidebar
  autoRotate={true}     // Enable auto-rotation
  rotateInterval={5000} // Rotate every 5 seconds
/>`}
            </pre>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            borderRadius: 12, 
            padding: 20,
            marginBottom: 16
          }}>
            <h3 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: 12 
            }}>
              2. Service Ad Cards
            </h3>
            <pre style={{
              background: '#1e293b',
              color: '#10b981',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              overflow: 'auto',
              fontFamily: 'monospace'
            }}>
{`import ServiceAdCards from './components/ads/ServiceAdCards';

// In your component:
<ServiceAdCards />`}
            </pre>
          </div>

          <div style={{ 
            background: '#f8fafc', 
            borderRadius: 12, 
            padding: 20
          }}>
            <h3 style={{ 
              fontSize: 16, 
              fontWeight: 600, 
              color: '#1e293b', 
              marginBottom: 12 
            }}>
              3. Native Ad Card
            </h3>
            <pre style={{
              background: '#1e293b',
              color: '#10b981',
              padding: 16,
              borderRadius: 8,
              fontSize: 13,
              overflow: 'auto',
              fontFamily: 'monospace'
            }}>
{`import NativeAdCard from './components/ads/NativeAdCard';

// In your component:
<NativeAdCard variant="property" />  // Property listing ad
<NativeAdCard variant="service" />   // Service promotion ad
<NativeAdCard variant="partner" />   // Partner/sponsor ad`}
            </pre>
          </div>

          <div style={{
            marginTop: 24,
            padding: 16,
            background: '#dbeafe',
            borderRadius: 12,
            border: '1px solid #93c5fd'
          }}>
            <h4 style={{ 
              fontSize: 14, 
              fontWeight: 700, 
              color: '#1e40af', 
              marginBottom: 8 
            }}>
              💡 Pro Tips:
            </h4>
            <ul style={{ 
              fontSize: 14, 
              color: '#1e40af', 
              lineHeight: 1.8,
              paddingLeft: 20
            }}>
              <li>Use <strong>PromotionalBanner</strong> at the top of pages for maximum visibility</li>
              <li>Place <strong>ServiceAdCards</strong> in the middle of content for natural flow</li>
              <li>Mix <strong>NativeAdCard</strong> with regular content for seamless integration</li>
              <li>Customize colors, gradients, and content in each component file</li>
              <li>All ads are fully responsive and mobile-friendly</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
