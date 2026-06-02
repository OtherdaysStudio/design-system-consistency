import React from 'react';

interface PricingCardProps {
  features?: string[];
}

const PricingCard: React.FC<PricingCardProps> = ({
  features = [
    'Advanced analytics dashboard',
    'Priority support',
    'Custom integrations'
  ]
}) => {
  return (
    <div
      style={{
        background: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        padding: '32px',
        maxWidth: '360px',
        position: 'relative',
        border: '1px solid rgba(0, 0, 0, 0.08)',
      }}
    >
      {/* Most Popular Pill */}
      <div
        style={{
          display: 'inline-block',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: '600',
          letterSpacing: '0.5px',
          padding: '6px 12px',
          borderRadius: '20px',
          marginBottom: '20px',
          textTransform: 'uppercase',
        }}
      >
        Most Popular
      </div>

      {/* Tier Name */}
      <h2
        style={{
          fontSize: '28px',
          fontWeight: '700',
          marginBottom: '8px',
          color: '#1a1a1a',
          lineHeight: '1.2',
        }}
      >
        Pro
      </h2>

      {/* Description */}
      <p
        style={{
          fontSize: '14px',
          color: '#666666',
          marginBottom: '24px',
          lineHeight: '1.5',
        }}
      >
        Everything you need to scale your business
      </p>

      {/* Price */}
      <div
        style={{
          marginBottom: '28px',
        }}
      >
        <span
          style={{
            fontSize: '48px',
            fontWeight: '700',
            color: '#1a1a1a',
            lineHeight: '1',
          }}
        >
          $29
        </span>
        <span
          style={{
            fontSize: '14px',
            color: '#999999',
            marginLeft: '8px',
            fontWeight: '500',
          }}
        >
          /mo
        </span>
      </div>

      {/* Features */}
      <ul
        style={{
          listStyle: 'none',
          padding: '0',
          margin: '0 0 28px 0',
        }}
      >
        {features.map((feature, index) => (
          <li
            key={index}
            style={{
              fontSize: '14px',
              color: '#333333',
              paddingLeft: '24px',
              paddingTop: '12px',
              paddingBottom: '12px',
              position: 'relative',
              lineHeight: '1.5',
            }}
          >
            <span
              style={{
                position: 'absolute',
                left: '0',
                top: '14px',
                width: '5px',
                height: '5px',
                background: '#667eea',
                borderRadius: '50%',
              }}
            />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        style={{
          width: '100%',
          padding: '12px 16px',
          fontSize: '14px',
          fontWeight: '600',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)',
        }}
        onMouseEnter={(e) => {
          (e.target as HTMLButtonElement).style.transform = 'translateY(-2px)';
          (e.target as HTMLButtonElement).style.boxShadow = '0 6px 24px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          (e.target as HTMLButtonElement).style.transform = 'translateY(0)';
          (e.target as HTMLButtonElement).style.boxShadow = '0 4px 16px rgba(102, 126, 234, 0.3)';
        }}
      >
        Get Started
      </button>
    </div>
  );
};

export default PricingCard;
