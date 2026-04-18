import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="page-container">
      <div className="index-container">
        <h1 className="index-title">Event Management System</h1>
        <div className="index-buttons">
          <button className="index-btn" onClick={() => navigate('/admin/login')}>Admin Login</button>
          <button className="index-btn" onClick={() => navigate('/vendor/login')}>Vendor Login</button>
          <button className="index-btn" onClick={() => navigate('/user/login')}>User Login</button>
          <button className="index-btn" onClick={() => navigate('/chart')}>View Flow Chart</button>
        </div>
      </div>
    </div>
  );
};

export default Index;
