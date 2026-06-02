import React, { useState } from 'react';

interface SettingsRowProps {
  label?: string;
  helper?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

const SettingsRow: React.FC<SettingsRowProps> = ({
  label = 'Push notifications',
  helper = 'Get notified about activity',
  checked = true,
  onChange,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handleToggle = () => {
    const newState = !isChecked;
    setIsChecked(newState);
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
        gap: '16px',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: '14px',
            fontWeight: '500',
            color: '#1a1a1a',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: '13px',
            color: '#666666',
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
          width: '48px',
          height: '28px',
          padding: '0',
          border: 'none',
          borderRadius: '14px',
          backgroundColor: isChecked ? '#10b981' : '#e5e7eb',
          cursor: 'pointer',
          transition: 'background-color 200ms ease',
          flexShrink: 0,
        }}
        aria-label={`Toggle ${label}`}
      >
        <div
          style={{
            position: 'absolute',
            top: '2px',
            left: isChecked ? '24px' : '2px',
            width: '24px',
            height: '24px',
            backgroundColor: '#ffffff',
            borderRadius: '50%',
            transition: 'left 200ms ease',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
          }}
        />
      </button>
    </div>
  );
};

export default SettingsRow;
