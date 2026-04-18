import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const UserHome = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [showCategories, setShowCategories] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };

  const selectCategory = (cat) => {
    setShowCategories(false);
    navigate(`/user/vendor-list/${cat}`);
  };

  return (
    <div className="page-container">
      <div className="user-home">
        <div className="user-home-banner">WELCOME USER</div>
        <div className="user-menu-row" style={{position:'relative'}}>
          <div style={{position:'relative'}}>
            <button className="user-menu-btn" onClick={() => setShowCategories(!showCategories)}>Vendor</button>
            {showCategories && (
              <ul className="category-dropdown-list" style={{position:'absolute', top:'110%', left:0, zIndex:10, cursor:'pointer'}}>
                <li onClick={() => selectCategory('Catering')}>Catering</li>
                <li onClick={() => selectCategory('Florist')}>Florist</li>
                <li onClick={() => selectCategory('Decoration')}>Decoration</li>
                <li onClick={() => selectCategory('Lighting')}>Lighting</li>
              </ul>
            )}
          </div>
          <button className="user-menu-btn" onClick={() => navigate('/user/cart')}>Cart</button>
          <button className="user-menu-btn" onClick={() => navigate('/user/guest-list')}>Guest List</button>
          <button className="user-menu-btn" onClick={() => navigate('/user/order-status')}>Order Status</button>
        </div>
        <div className="user-logout">
          <button className="user-menu-btn" onClick={handleLogout}>LogOut</button>
        </div>
      </div>
    </div>
  );
};

export default UserHome;
