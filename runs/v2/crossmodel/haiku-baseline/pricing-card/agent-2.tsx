import React from 'react';

interface PricingCardProps {
  tier?: string;
  description?: string;
  price?: number;
  features?: string[];
  ctaLabel?: string;
  onCtaClick?: () => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  tier = 'Pro',
  description = 'Perfect for growing teams',
  price = 29,
  features = [
    'Up to 5 team members',
    'Advanced analytics & reporting',
    'Priority support'
  ],
  ctaLabel = 'Get started',
  onCtaClick = () => {}
}) => {
  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        maxWidth: '384px',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }}
    >
      {/* Most Popular Badge */}
      <div
        style={{
          position: 'absolute',
          top: '-12px',
          left: '50%',
          transform: 'translateX(-50%)',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          paddingLeft: '12px',
          paddingRight: '12px',
          paddingTop: '4px',
          paddingBottom: '4px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          whiteSpace: 'nowrap'
        }}
      >
        Most popular
      </div>

      {/* Tier Name */}
      <div style={{ paddingTop: '12px' }}>
        <h2
          style={{
            margin: '0',
            fontSize: '24px',
            fontWeight: '700',
            color: '#1f2937',
            lineHeight: '1.2'
          }}
        >
          {tier}
        </h2>
      </div>

      {/* Description */}
      <p
        style={{
          margin: '0',
          fontSize: '14px',
          color: '#6b7280',
          lineHeight: '1.5'
        }}
      >
        {description}
      </p>

      {/* Price */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
        <span
          style={{
            fontSize: '36px',
            fontWeight: '700',
            color: '#1f2937'
          }}
        >
          ${price}
        </span>
        <span
          style={{
            fontSize: '14px',
            color: '#6b7280',
            fontWeight: '500'
          }}
        >
          /mo
        </span>
      </div>

      {/* Features */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '12px'
            }}
          >
            <svg
              style={{
                width: '20px',
                height: '20px',
                color: '#10b981',
                flexShrink: 0,
                marginTop: '2px'
              }}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            <span
              style={{
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.5',
                margin: '0'
              }}
            >
              {feature}
            </span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <button
        onClick={onCtaClick}
        style={{
          width: '100%',
          padding: '12px 24px',
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          marginTop: '8px'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#2563eb';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#3b82f6';
        }}
      >
        {ctaLabel}
      </button>
    </div>
  );
};
