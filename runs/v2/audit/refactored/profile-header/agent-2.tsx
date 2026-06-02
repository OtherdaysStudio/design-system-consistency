import React, { useState } from 'react';

/**
 * ProfileHeader
 * A horizontal user profile header row:
 *  - Circular avatar on the left
 *  - Name (title) + role secondary text + neutral "Pro" badge in the middle
 *  - Primary "Follow" button on the right
 * All vertically centered. Styled entirely with inline style objects.
 */

export interface ProfileHeaderProps {
  name?: string;
  role?: string;
  avatarUrl?: string;
  onFollow?: () => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name = 'Jordan Avery',
  role = 'Product Designer',
  avatarUrl,
  onFollow,
}) => {
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [following, setFollowing] = useState(false);

  const initials = name
    .split(' ')
    .map((part) => part.charAt(0))
    .slice(0, 2)
    .join('')
    .toUpperCase();

  const handleFollow = () => {
    setFollowing((prev) => !prev);
    onFollow?.();
  };

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    width: '100%',
    maxWidth: 480,
    boxSizing: 'border-box',
    padding: '14px 18px',
    background: '#ffffff',
    border: '1px solid #ECECEF',
    borderRadius: 16,
    boxShadow:
      '0 1px 2px rgba(16, 24, 40, 0.04), 0 8px 24px rgba(16, 24, 40, 0.06)',
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    WebkitFontSmoothing: 'antialiased',
  };

  const avatarStyle: React.CSSProperties = {
    flexShrink: 0,
    width: 52,
    height: 52,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: avatarUrl
      ? `#EEF0F4 center / cover no-repeat url(${avatarUrl})`
      : 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)',
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 600,
    letterSpacing: 0.2,
    boxShadow: 'inset 0 0 0 1px rgba(16, 24, 40, 0.06)',
    userSelect: 'none',
  };

  const infoStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    minWidth: 0,
    flex: 1,
    gap: 3,
  };

  const nameRowStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minWidth: 0,
  };

  const nameStyle: React.CSSProperties = {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 1.2,
    color: '#101828',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  };

  const badgeStyle: React.CSSProperties = {
    flexShrink: 0,
    display: 'inline-flex',
    alignItems: 'center',
    height: 18,
    padding: '0 7px',
    borderRadius: 6,
    background: '#F2F4F7',
    border: '1px solid #E4E7EC',
    color: '#475467',
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: 0.3,
    lineHeight: 1,
    textTransform: 'uppercase',
  };

  const roleStyle: React.CSSProperties = {
    fontSize: 13,
    fontWeight: 400,
    lineHeight: 1.2,
    color: '#667085',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    margin: 0,
  };

  const followingButton = following;

  const buttonBase: React.CSSProperties = {
    flexShrink: 0,
    appearance: 'none',
    border: '1px solid transparent',
    outline: 'none',
    cursor: 'pointer',
    height: 38,
    padding: '0 18px',
    borderRadius: 10,
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1,
    letterSpacing: 0.1,
    fontFamily: 'inherit',
    transition:
      'background-color 140ms ease, box-shadow 140ms ease, transform 80ms ease, color 140ms ease, border-color 140ms ease',
    transform: pressed ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)',
  };

  const primaryButtonStyle: React.CSSProperties = {
    ...buttonBase,
    background: hovered ? '#4338CA' : '#4F46E5',
    color: '#ffffff',
    boxShadow: hovered
      ? '0 4px 12px rgba(79, 70, 229, 0.35)'
      : '0 1px 2px rgba(79, 70, 229, 0.25)',
  };

  const followingButtonStyle: React.CSSProperties = {
    ...buttonBase,
    background: hovered ? '#F9FAFB' : '#ffffff',
    color: '#344054',
    borderColor: '#D0D5DD',
    boxShadow: '0 1px 2px rgba(16, 24, 40, 0.05)',
  };

  return (
    <div style={containerStyle}>
      <div style={avatarStyle} aria-hidden={avatarUrl ? undefined : true}>
        {!avatarUrl && initials}
      </div>

      <div style={infoStyle}>
        <div style={nameRowStyle}>
          <span style={nameStyle} title={name}>
            {name}
          </span>
          <span style={badgeStyle}>Pro</span>
        </div>
        <span style={roleStyle} title={role}>
          {role}
        </span>
      </div>

      <button
        type="button"
        style={followingButton ? followingButtonStyle : primaryButtonStyle}
        onClick={handleFollow}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => {
          setHovered(false);
          setPressed(false);
        }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        aria-pressed={followingButton}
      >
        {followingButton ? 'Following' : 'Follow'}
      </button>
    </div>
  );
};

export default ProfileHeader;
