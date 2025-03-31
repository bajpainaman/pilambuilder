import React, { useState } from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false,
  type = 'button',
  className = '',
  style = {}
}) => {
  const [isActive, setIsActive] = useState(false);
  
  // Variant colors
  const colors = {
    primary: {
      base: '#2196F3',
      hover: '#1976D2',
      active: '#0D47A1',
    },
    secondary: {
      base: '#9E9E9E',
      hover: '#757575',
      active: '#616161',
    },
    success: {
      base: '#4CAF50',
      hover: '#388E3C',
      active: '#2E7D32',
    },
    danger: {
      base: '#F44336',
      hover: '#D32F2F',
      active: '#B71C1C',
    },
    outline: {
      base: 'transparent',
      hover: 'rgba(33, 150, 243, 0.1)',
      active: 'rgba(33, 150, 243, 0.2)',
    }
  };

  const colorSet = colors[variant] || colors.primary;

  const baseStyles = {
    padding: '12px 16px', // Increased padding for better touch targets
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'all 0.2s ease',
    border: variant === 'outline' ? '1px solid #2196F3' : 'none',
    fontSize: '16px', // Increased font size for better readability on mobile
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
    minHeight: '44px', // Minimum touch target size
    minWidth: '44px',
    backgroundColor: isActive ? colorSet.active : colorSet.base,
    color: variant === 'outline' ? '#2196F3' : 'white',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent', // Remove tap highlight on mobile
  };
  
  // Combine styles
  const combinedStyles = {
    ...baseStyles,
    ...style
  };
  
  // Event handlers for mobile touch events
  const handleTouchStart = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };
  
  const handleTouchEnd = () => {
    if (!disabled) {
      setIsActive(false);
    }
  };
  
  // Mouse events for desktop
  const handleMouseDown = () => {
    if (!disabled) {
      setIsActive(true);
    }
  };
  
  const handleMouseUp = () => {
    if (!disabled) {
      setIsActive(false);
    }
  };
  
  const handleMouseLeave = () => {
    if (!disabled && isActive) {
      setIsActive(false);
    }
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      style={combinedStyles}
      className={className}
      disabled={disabled}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </button>
  );
};

export default Button;