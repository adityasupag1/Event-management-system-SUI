import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="admin-container">
        <div className="admin-top-bar">
          <button className="admin-btn" onClick={() => navigate('/admin/home')}>Home</button>
          <button className="admin-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="admin-welcome">Welcome Admin</div>
        <div className="admin-menu-row">
          <button className="admin-menu-btn" onClick={() => navigate('/admin/maintain-user')}>Maintain User</button>
          <button className="admin-menu-btn" onClick={() => navigate('/admin/maintain-vendor')}>Maintain Vendor</button>
        </div>
        <div style={{textAlign:'center', marginTop:25}}>
          <button className="admin-btn" onClick={() => navigate('/admin/maintenance')}>Maintenance Menu</button>
          <button className="admin-btn" style={{marginLeft:10}} onClick={() => navigate('/admin/membership')}>Manage Memberships</button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
