import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Layout = ({ 
  children, 
  title, 
  showBackButton = false,
  showLogout = true,
  maxWidth = '960px',
  padding = '20px'
}) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const containerStyles = {
    maxWidth: maxWidth,
    margin: '0 auto',
    padding: padding,
    width: '100%',
  };

  const headerStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    borderBottom: '1px solid #eee',
    paddingBottom: '10px',
    flexWrap: 'wrap',
    gap: '10px',
  };

  const titleStyles = {
    fontSize: 'clamp(18px, 5vw, 24px)',
    fontWeight: 'bold',
    margin: '0',
    wordBreak: 'break-word',
  };

  const buttonContainerStyles = {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  };

  const backButtonStyles = {
    padding: '10px 16px',
    backgroundColor: '#eee',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    minHeight: '44px',
    minWidth: '44px', // Minimum touch target size
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const logoutButtonStyles = {
    padding: '10px 16px',
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    minHeight: '44px',
    minWidth: '44px', // Minimum touch target size
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div style={containerStyles}>
      <header style={headerStyles}>
        <h1 style={titleStyles}>{title}</h1>
        
        <div style={buttonContainerStyles}>
          {showBackButton && (
            <button style={backButtonStyles} onClick={handleBack}>
              Back
            </button>
          )}
          
          {showLogout && currentUser && (
            <button style={logoutButtonStyles} onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>
      
      <main>{children}</main>
      
      <footer style={{ marginTop: '40px', textAlign: 'center', color: '#757575', fontSize: '14px' }}>
        <p>Pi Lambda Phi © {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
};

export default Layout;