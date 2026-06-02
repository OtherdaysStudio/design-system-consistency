import React, { useState } from 'react';

interface SettingsRowProps {
  label?: string;
  helper?: string;
  isEnabled?: boolean;
  onChange?: (enabled: boolean) => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label = 'Push notifications',
  helper = 'Get notified about activity',
  isEnabled = true,
  onChange,
}) => {
  const [enabled, setEnabled] = useState(isEnabled);

  const handleToggle = () => {
    const newState = !enabled;
    setEnabled(newState);
    onChange?.(newState);
  };

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e5e7eb',
        gap: '16px',
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontSize: '15px',
            fontWeight: '500',
            color: '#1f2937',
            marginBottom: '4px',
            lineHeight: '1.4',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#6b7280',
            lineHeight: '1.4',
          }}
        >
          {helper}
        </div>
      </div>

      <button
        onClick={handleToggle}
        style={{
          position: 'relative',
          width: '44px',
          height: '24px',
          backgroundColor: enabled ? '#3b82f6' : '#d1d5db',
          border: 'none',
          borderRadius: '12px',
          cursor: 'pointer',
          padding: 0,
          transition: 'background-color 0.2s ease-in-out',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          paddingRight: enabled ? '4px' : '22px',
          paddingLeft: enabled ? '22px' : '4px',
        }}
        aria-label={`${label} toggle`}
        aria-pressed={enabled}
      >
        <div
          style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            transition: 'left 0.2s ease-in-out',
            left: enabled ? '22px' : '2px',
            top: '2px',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          }}
        />
      </button>
    </div>
  );
};

export default SettingsRow;
