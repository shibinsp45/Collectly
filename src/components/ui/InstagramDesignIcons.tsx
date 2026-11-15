import React from 'react';

interface IconProps {
  size?: number;
  className?: string;
  filled?: boolean;
  color?: string;
  strokeWidth?: number;
}

/**
 * 1. Instagram Official Home Icon
 */
export const InstaHomeIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M12.001 2.201a1.75 1.75 0 0 0-1.168.448L3.25 8.95A1.75 1.75 0 0 0 2.5 10.3v9.45c0 .966.784 1.75 1.75 1.75h4.5a1.75 1.75 0 0 0 1.75-1.75v-5a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 .75.75v5c0 .966.784 1.75 1.75 1.75h4.5c.966 0 1.75-.784 1.75-1.75V10.3a1.75 1.75 0 0 0-.75-1.35l-7.583-6.3a1.75 1.75 0 0 0-1.166-.449z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M3 10.5L12 3l9 7.5v9a2 2 0 0 1-2 2h-4.5a1.5 1.5 0 0 1-1.5-1.5v-4.5a1 1 0 0 0-1-1h-2a1 1 0 0 0-1 1v4.5a1.5 1.5 0 0 1-1.5 1.5H5a2 2 0 0 1-2-2v-9z" />
    </svg>
  );
};

/**
 * 2. Instagram Official Search / Explore Icon
 */
export const InstaSearchIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={filled ? strokeWidth + 0.6 : strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="11" cy="11" r="7.5" />
      <path d="M21 21l-4.65-4.65" />
    </svg>
  );
};

/**
 * 3. Instagram Official Reels / Clapperboard Icon
 */
export const InstaReelsIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2.5" y="3.5" width="19" height="17" rx="4" fill={filled ? color : "none"} />
      <path d="M2.5 8.5h19" stroke={filled ? "#000" : color} strokeWidth={strokeWidth} />
      <path d="M7 3.5l2 5" stroke={filled ? "#000" : color} strokeWidth={strokeWidth} />
      <path d="M14 3.5l2 5" stroke={filled ? "#000" : color} strokeWidth={strokeWidth} />
      <polygon points="10 12 15 15 10 18" fill={filled ? "#000" : color} stroke="none" />
    </svg>
  );
};

/**
 * 4. Instagram Official Bookmark / Saves Ribbon Icon
 */
export const InstaBookmarkIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill={color} className={className}>
        <path d="M5 3.75A2.75 2.75 0 0 1 7.75 1h8.5A2.75 2.75 0 0 1 19 3.75v17.5a.75.75 0 0 1-1.2.6L12 17.5l-5.8 4.35a.75.75 0 0 1-1.2-.6V3.75z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M5 3.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v18l-7-5.25L5 21.5V3.5z" />
    </svg>
  );
};

/**
 * 5. Instagram Official Grid / Collections Icon
 */
export const InstaGridIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="7" height="7" rx="1.5" fill={filled ? color : "none"} />
      <rect x="14" y="3" width="7" height="7" rx="1.5" fill={filled ? color : "none"} />
      <rect x="3" y="14" width="7" height="7" rx="1.5" fill={filled ? color : "none"} />
      <rect x="14" y="14" width="7" height="7" rx="1.5" fill={filled ? color : "none"} />
    </svg>
  );
};

/**
 * 6. Instagram Official Settings / Gear Icon
 */
export const InstaGearIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="12" cy="12" r="3" fill={filled ? color : "none"} />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
};

/**
 * 7. Instagram Official Heart / Activity Icon
 */
export const InstaHeartIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  if (filled) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="#ED4956" className={className}>
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
};

/**
 * 8. Instagram Official Share / Direct Message Airplane Icon
 */
export const InstaShareIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 2L11 13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" fill={filled ? color : "none"} />
    </svg>
  );
};

/**
 * 9. Instagram Official Plus / Create Post Icon
 */
export const InstaPlusIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" fill={filled ? color : "none"} />
      <path d="M12 8v8" stroke={filled ? "#fff" : color} />
      <path d="M8 12h8" stroke={filled ? "#fff" : color} />
    </svg>
  );
};

/**
 * 10. Instagram Official TV / Screen Icon
 */
export const InstaTvIcon: React.FC<IconProps> = ({ 
  size = 24, 
  className = '', 
  filled = false,
  color = 'currentColor',
  strokeWidth = 2
}) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect x="2" y="7" width="20" height="15" rx="3" fill={filled ? color : "none"} />
      <polyline points="17 2 12 7 7 2" />
    </svg>
  );
};
