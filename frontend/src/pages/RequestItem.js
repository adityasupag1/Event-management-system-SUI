import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const RequestItem = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get('/orders/vendor/requests').then(r => setRequests(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1100}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
          <button className="nav-btn blue" onClick={() => navigate('/vendor/home')}>Home</button>
          <div style={{background:'#4472C4', color:'white', padding:'12px 25px', borderRadius:6}}>Request Item</div>
          <button className="nav-btn blue" onClick={handleLogout}>LogOut</button>
        </div>
        {requests.length === 0 ? <div className="empty-state">No requests yet</div> :
          <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:15}}>
            {requests.map((r, idx) => (
              <div key={r._id} style={{background:'#4472C4', color:'white', padding:20, borderRadius:8, textAlign:'center'}}>
                <h4 style={{marginBottom:10}}>Item {idx+1}</h4>
                <div style={{fontSize:13}}>{r.productName || 'Product'}</div>
                <div style={{fontSize:12, marginTop:8}}>From: {r.userName}</div>
                <div style={{fontSize:12, marginTop:5}}>Status: {r.status}</div>
              </div>
            ))}
          </div>
        }
      </div>
    </div>
  );
};

export default RequestItem;
