import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const VendorList = () => {
  const navigate = useNavigate();
  const { category } = useParams();
  const { logout } = useAuth();
  const [vendors, setVendors] = useState([]);

  useEffect(() => {
    API.get(`/products/category/${category}`).then(r => setVendors(r.data)).catch(console.error);
  }, [category]);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
          <button className="nav-btn" onClick={() => navigate('/user/home')}>Home</button>
          <div style={{background:'#4472C4', color:'white', padding:'10px 25px', borderRadius:6}}>Vendor - {category}</div>
          <button className="nav-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="vendor-grid">
          {vendors.length === 0 ? <div className="empty-state" style={{gridColumn:'1/-1'}}>No vendors in this category yet</div> :
            vendors.map((v, i) => (
              <div key={v._id} className="vendor-card">
                <h3>Vendor {i+1}</h3>
                <div style={{fontSize:13, marginBottom:6}}>{v.name}</div>
                <div style={{fontSize:12, marginBottom:6}}>Contact Details</div>
                <div style={{fontSize:11}}>{v.email}</div>
                <button className="vendor-card-btn" onClick={() => navigate(`/user/vendor-products/${v._id}`)}>Shop Item</button>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default VendorList;
