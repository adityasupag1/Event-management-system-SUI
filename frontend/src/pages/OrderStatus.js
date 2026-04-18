import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const OrderStatus = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get('/orders/user').then(r => setOrders(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{fontSize:13, marginBottom:10}}>User Order status</div>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20}}>
          <button className="nav-btn blue" onClick={() => navigate('/user/home')}>Home</button>
          <div style={{background:'#4472C4', color:'white', padding:'10px 25px', borderRadius:6}}>User Order Status</div>
          <button className="nav-btn blue" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Name','E-mail','Address','Status'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {orders.length === 0 ? <div className="empty-state">No orders placed yet</div> :
          orders.map(o => (
            <div key={o._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{o.name}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{o.email}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:12}}>{o.address}, {o.city}, {o.state} - {o.pinCode}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{o.status}</div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default OrderStatus;
