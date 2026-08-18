import { ArrowRight } from 'lucide-react';

interface ServiceAdCardProps {
  title: string;
  description: string;
  discount?: string;
  image: string;
  link: string;
  backgroundColor?: string;
  badgeColor?: string;
}

export default function ServiceAdCard({
  title,
  description,
  discount,
  image,
  link,
  backgroundColor = '#ffffff',
  badgeColor = '#10b981'
}: ServiceAdCardProps) {
  return (
    <a
      href={link}
      style={{
        display: 'block',
        background: backgroundColor,
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        border: '1px solid #e2e8f0',
        textDecoration: 'none',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)';
      }}
    >
      {/* Image Section */}
      <div
        style={{
          height: 160,
          background: `url(${image}) center/cover`,
          position: 'relative'
        }}
      >
        {discount && (
          <div
            style={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: badgeColor,
              color: '#ffffff',
              padding: '6px 12px',
              borderRadius: 8,
              fontSize: 13,
              fontWeight: 700,
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {discount}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div style={{ padding: 20 }}>
        <h4
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: '#1e293b',
            marginBottom: 8
          }}
        >
          {title}
        </h4>
        <p
          style={{
            fontSize: 14,
            color: '#64748b',
            marginBottom: 16,
            lineHeight: 1.5
          }}
        >
          {description}
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            color: '#f97316',
            fontSize: 14,
            fontWeight: 600
          }}
        >
          Learn More
          <ArrowRight size={16} />
        </div>
      </div>
    </a>
  );
}
