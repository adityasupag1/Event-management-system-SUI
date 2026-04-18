import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const ProductStatus = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [requests, setRequests] = useState([]);

  const fetchRequests = async () => {
    try {
      const { data } = await API.get('/orders/vendor/requests');
      setRequests(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const deleteRequest = async (id) => {
    if (!window.confirm('Delete this request?')) return;
    try {
      await API.delete(`/orders/vendor/request/${id}`);
      fetchRequests();
    } catch (e) { alert(e.response?.data?.message); }
  };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{background:'#4472C4', color:'white', textAlign:'center', padding:12, borderRadius:6, marginBottom:20, maxWidth:250, margin:'0 auto 20px'}}>
          Product Status
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
          <button className="nav-btn blue" onClick={() => navigate('/vendor/home')}>Home</button>
          <button className="nav-btn blue" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Name','E-Mail','Address','Status','Update','Delete'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {requests.length === 0 ? <div className="empty-state">No product requests yet</div> :
          requests.map(r => (
            <div key={r._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.userName}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.userEmail}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:12}}>{r.userAddress}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{r.status}</div>
              <div style={{textAlign:'center'}}>
                <button className="nav-btn" onClick={() => navigate(`/vendor/update-status/${r._id}`)}>Update</button>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="nav-btn" onClick={() => deleteRequest(r._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ProductStatus;
