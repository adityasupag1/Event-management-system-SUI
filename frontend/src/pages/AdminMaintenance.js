import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminMaintenance = () => {
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
        <div style={{marginTop: 30}}>
          <div className="maintenance-row">
            <div className="maint-label">Membership</div>
            <div className="maint-buttons">
              <button className="maint-btn" onClick={() => navigate('/admin/membership')}>Add</button>
              <button className="maint-btn" onClick={() => navigate('/admin/membership')}>Update</button>
            </div>
          </div>
          <div className="maintenance-row">
            <div className="maint-label">User Management</div>
            <div className="maint-buttons">
              <button className="maint-btn" onClick={() => navigate('/admin/maintain-user')}>Add</button>
              <button className="maint-btn" onClick={() => navigate('/admin/maintain-user')}>Update</button>
            </div>
          </div>
          <div className="maintenance-row">
            <div className="maint-label">Vendor Management</div>
            <div className="maint-buttons">
              <button className="maint-btn" onClick={() => navigate('/admin/maintain-vendor')}>Add</button>
              <button className="maint-btn" onClick={() => navigate('/admin/maintain-vendor')}>Update</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMaintenance;
