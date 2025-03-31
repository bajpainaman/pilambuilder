import React from 'react';

const Button = ({ 
  children, 
  onClick, 
  variant = 'primary', 
  fullWidth = false, 
  disabled = false,
  type = 'button',
  className = ''
}) => {
  const baseStyles = {
    padding: '10px 16px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    border: 'none',
    fontSize: '14px',
    display: 'inline-block',
    textAlign: 'center',
    width: fullWidth ? '100%' : 'auto',
    opacity: disabled ? 0.7 : 1,
    pointerEvents: disabled ? 'none' : 'auto',
  };

  const variants = {
    primary: {
      backgroundColor: '#2196F3',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: '#1976D2',
      }
    },
    secondary: {
      backgroundColor: '#9E9E9E',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: '#757575',
      }
    },
    success: {
      backgroundColor: '#4CAF50',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: '#388E3C',
      }
    },
    danger: {
      backgroundColor: '#F44336',
      color: 'white',
      border: 'none',
      '&:hover': {
        backgroundColor: '#D32F2F',
      }
    },
    outline: {
      backgroundColor: 'transparent',
      color: '#2196F3',
      border: '1px solid #2196F3',
      '&:hover': {
        backgroundColor: 'rgba(33, 150, 243, 0.1)',
      }
    }
  };

  const variantStyle = variants[variant] || variants.primary;
  
  // Combine styles
  const combinedStyles = {
    ...baseStyles,
    ...variantStyle
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      style={combinedStyles}
      className={className}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;