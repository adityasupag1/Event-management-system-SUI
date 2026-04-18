import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const VendorTransaction = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    API.get('/orders/vendor/requests').then(r => setRequests(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div className="vendor-welcome-header">
          <div>Welcome '{user?.name}' - Transaction / User Request</div>
          <div className="nav-tabs">
            <button className="nav-btn" onClick={() => navigate('/vendor/home')}>Home</button>
            <button className="nav-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Customer Name','Email','Product','Status','Action'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {requests.length === 0 ? <div className="empty-state">No user requests yet</div> :
          requests.map(r => (
            <div key={r._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.userName}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.userEmail}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.productName}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.status}</div>
              <div style={{textAlign:'center'}}>
                <button className="nav-btn" onClick={() => navigate(`/vendor/update-status/${r._id}`)}>Update</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default VendorTransaction;
