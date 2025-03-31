import React from 'react';

const Card = ({ 
  children, 
  title,
  subtitle,
  elevation = 1,
  padding = '16px',
  margin = '0 0 16px 0',
  className = '',
  onClick
}) => {
  const shadows = {
    0: 'none',
    1: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)',
    2: '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)',
    3: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
    4: '0 14px 28px rgba(0,0,0,0.25), 0 10px 10px rgba(0,0,0,0.22)',
    5: '0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22)'
  };

  const cardStyles = {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: padding,
    margin: margin,
    boxShadow: shadows[elevation] || shadows[1],
    transition: 'box-shadow 0.3s ease',
    cursor: onClick ? 'pointer' : 'default',
  };

  const titleStyles = {
    margin: '0 0 8px 0',
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
  };

  const subtitleStyles = {
    margin: '0 0 16px 0',
    fontSize: '14px',
    color: '#757575',
  };

  return (
    <div style={cardStyles} className={className} onClick={onClick}>
      {title && <h3 style={titleStyles}>{title}</h3>}
      {subtitle && <p style={subtitleStyles}>{subtitle}</p>}
      {children}
    </div>
  );
};

export default Card;