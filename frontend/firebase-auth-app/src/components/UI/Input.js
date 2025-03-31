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
  label
}) => {
  const inputStyles = {
    padding: '10px 12px',
    borderRadius: '4px',
    border: error ? '1px solid #F44336' : '1px solid #ddd',
    fontSize: '14px',
    transition: 'border 0.3s ease',
    width: fullWidth ? '100%' : 'auto',
    boxSizing: 'border-box',
    outline: 'none',
    backgroundColor: disabled ? '#f5f5f5' : 'white',
  };

  const labelStyles = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '14px',
    fontWeight: 'bold',
    color: error ? '#F44336' : '#333',
  };

  const errorStyles = {
    color: '#F44336',
    fontSize: '12px',
    marginTop: '4px',
  };

  const containerStyles = {
    marginBottom: '16px',
    width: fullWidth ? '100%' : 'auto',
  };

  return (
    <div style={containerStyles} className={className}>
      {label && <label style={labelStyles}>{label}{required && <span style={{color: '#F44336'}}> *</span>}</label>}
      <input
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
      />
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

export default Input;