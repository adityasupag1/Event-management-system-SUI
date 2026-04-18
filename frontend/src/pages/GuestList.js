import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const GuestList = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [orders, setOrders] = useState([]);

  const fetch = async () => {
    try {
      const { data } = await API.get('/orders/user');
      setOrders(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetch(); }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm('Cancel this order?')) return;
    try {
      await API.put(`/orders/cancel/${id}`);
      fetch();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
          <button className="nav-btn" onClick={() => navigate('/user/home')}>Home</button>
          <h2>Guest List / My Orders</h2>
          <button className="nav-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Order ID','Items','Total','Status','Action'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {orders.length === 0 ? <div className="empty-state">No orders yet</div> :
          orders.map(o => (
            <div key={o._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:11}}>{o._id.slice(-8)}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:12}}>{o.items.map(i => i.productName).join(', ')}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>Rs. {o.totalAmount}/-</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{o.status}</div>
              <div style={{display:'flex', gap:5, flexDirection:'column'}}>
                <button className="nav-btn" onClick={() => alert(JSON.stringify(o, null, 2))}>View / Update</button>
                {o.status !== 'Cancelled' && o.status !== 'Delivered' && (
                  <button className="nav-btn" onClick={() => cancelOrder(o._id)}>Cancel</button>
                )}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default GuestList;
