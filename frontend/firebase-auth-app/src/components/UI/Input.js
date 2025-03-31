import React from 'react';

const Input = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  name,
  error,
  fullWidth = true,
  required = false,
  className = '',
  disabled = false,
  min,
  max,
  pattern,
  label,
  style = {}
}) => {
  const inputStyles = {
    padding: '12px',
    borderRadius: '4px',
    border: error ? '1px solid #F44336' : '1px solid #ddd',
    fontSize: '16px', // Increased for better readability on mobile
    transition: 'border 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: disabled ? '#f5f5f5' : 'white',
    WebkitAppearance: 'none', // Remove default styling on iOS
    appearance: 'none',
    minHeight: '44px', // Minimum touch target size
    boxShadow: 'none', // Remove default shadow on iOS
    touchAction: 'manipulation', // Improves touch performance
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: error ? '#F44336' : '#333',
  };

  const errorStyles = {
    color: '#F44336',
    fontSize: '12px',
    marginTop: '6px',
    wordBreak: 'break-word',
  };

  const containerStyles = {
    marginBottom: '16px',
    width: fullWidth ? '100%' : 'auto',
    ...style
  };

  // Special styles for different input types
  if (type === 'tel') {
    // Ensure phone inputs are properly sized
    inputStyles.letterSpacing = '0.5px'; // Better readability for numbers
  }
  
  if (type === 'date' || type === 'time') {
    // Fix date/time inputs on iOS
    inputStyles.lineHeight = '1.2';
  }

  return (
    <div style={containerStyles} className={className}>
      {label && (
        <label htmlFor={name} style={labelStyles}>
          {label}{required && <span style={{color: '#F44336'}}> *</span>}
        </label>
      )}
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={inputStyles}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        pattern={pattern}
        autoComplete={type === 'password' ? 'current-password' : type === 'email' ? 'email' : 'on'}
        autoCapitalize={type === 'email' ? 'off' : 'sentences'}
        autoCorrect={type === 'email' || type === 'password' ? 'off' : 'on'}
      />
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

export default Input;