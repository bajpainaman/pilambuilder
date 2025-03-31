import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  elevation = 1,
  padding = '16px',
  margin = '0 0 16px 0',
  className = '',
  onClick,
  style = {}
}) => {
  const shadows = {
    0: 'none',
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  };

  // Adjust padding for mobile
  const responsivePadding = typeof window !== 'undefined' && window.innerWidth <= 480 ? 
    '12px' : padding;

  const cardStyles = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: responsivePadding,
    margin: margin,
    boxShadow: shadows[elevation] || shadows[1],
    transition: 'box-shadow 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
    width: '100%',
    boxSizing: 'border-box',
    overflow: 'hidden',
    WebkitTapHighlightColor: onClick ? 'rgba(0,0,0,0.1)' : 'transparent', // Feedback for tappable elements
    ...style
  };

  const titleStyles = {
    margin: '0 0 8px 0',
    fontSize: 'clamp(16px, 4vw, 18px)',
    fontWeight: 'bold',
    color: '#333',
    wordBreak: 'break-word',
  };

  const subtitleStyles = {
    margin: '0 0 16px 0',
    fontSize: 'clamp(12px, 3vw, 14px)',
    color: '#757575',
    wordBreak: 'break-word',
  };

  return (
    <div 
      style={cardStyles} 
      className={className} 
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {title && <h3 style={titleStyles}>{title}</h3>}
      {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
      {children}
    </div>
  );
};

export default Card;