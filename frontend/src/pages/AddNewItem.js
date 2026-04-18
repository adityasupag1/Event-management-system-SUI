import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AddNewItem = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card">
        <div className="vendor-welcome-header">
          <div>Welcome '{user?.name}'</div>
          <div className="nav-tabs">
            <button className="nav-btn" onClick={() => navigate('/vendor/product-status')}>Product Status</button>
            <button className="nav-btn" onClick={() => navigate('/vendor/request-item')}>Request Item</button>
            <button className="nav-btn" onClick={() => navigate('/vendor/view-product')}>View Product</button>
            <button className="nav-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
        <div style={{textAlign: 'center', padding: 40}}>
          <h2 style={{marginBottom: 20}}>Add / Manage Your Items</h2>
          <p style={{marginBottom: 30, color: '#555'}}>Select an option below to continue</p>
          <div style={{display: 'flex', justifyContent: 'center', gap: 20, flexWrap: 'wrap'}}>
            <button className="menu-btn" onClick={() => navigate('/vendor/your-item')}>Add / Manage Products</button>
            <button className="menu-btn" onClick={() => navigate('/vendor/product-status')}>Product Status</button>
            <button className="menu-btn" onClick={() => navigate('/vendor/request-item')}>Request Items</button>
            <button className="menu-btn" onClick={() => navigate('/vendor/view-product')}>View Products</button>
          </div>
          <div style={{marginTop: 30}}>
            <button className="btn btn-primary" onClick={() => navigate('/vendor/home')}>Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewItem;
