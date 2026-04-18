import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const VendorHome = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="page-container">
      <div className="menu-container">
        <div style={{display: 'flex', justifyContent: 'flex-end', marginBottom: 10}}>
          <button className="btn btn-primary" onClick={() => navigate('/chart')}>CHART</button>
        </div>
        <div className="welcome-banner">
          Welcome<br/>
          <strong>{user?.name || 'Vendor'}</strong>
        </div>
        <div className="menu-buttons">
          <button className="menu-btn" onClick={() => navigate('/vendor/your-item')}>Your Item</button>
          <button className="menu-btn" onClick={() => navigate('/vendor/add-item')}>Add New Item</button>
          <button className="menu-btn" onClick={() => navigate('/vendor/transaction')}>Transaction</button>
          <button className="menu-btn" onClick={handleLogout}>LogOut</button>
        </div>
      </div>
    </div>
  );
};

export default VendorHome;
