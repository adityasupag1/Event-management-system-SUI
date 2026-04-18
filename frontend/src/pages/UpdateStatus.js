import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const UpdateStatus = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { logout } = useAuth();
  const [status, setStatus] = useState('Received');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');

  const handleUpdate = async () => {
    setErr(''); setMsg('');
    try {
      await API.put(`/orders/vendor/request/${id}`, { status });
      setMsg('Status updated successfully');
      setTimeout(() => navigate('/vendor/product-status'), 1000);
    } catch (e) {
      setErr(e.response?.data?.message || 'Update failed');
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 900}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:30}}>
          <button className="nav-btn blue" onClick={() => navigate('/vendor/product-status')}>Home</button>
          <button className="nav-btn blue" onClick={handleLogout}>LogOut</button>
        </div>
        {err && <div className="message error">{err}</div>}
        {msg && <div className="message success">{msg}</div>}
        <div style={{display:'flex', alignItems:'center', gap:30, justifyContent:'center', flexWrap:'wrap'}}>
          <div className="radio-group">
            <h4>Update</h4>
            <div className="radio-option">
              <input type="radio" id="received" name="status" value="Received" checked={status==='Received'} onChange={(e) => setStatus(e.target.value)} />
              <label htmlFor="received">Recieved</label>
            </div>
            <div className="radio-option">
              <input type="radio" id="ready" name="status" value="Ready for Shipping" checked={status==='Ready for Shipping'} onChange={(e) => setStatus(e.target.value)} />
              <label htmlFor="ready">Ready for Shipping</label>
            </div>
            <div className="radio-option">
              <input type="radio" id="out" name="status" value="Out For Delivery" checked={status==='Out For Delivery'} onChange={(e) => setStatus(e.target.value)} />
              <label htmlFor="out">Out For Delivery</label>
            </div>
          </div>
          <div style={{fontSize:13, color:'#555'}}>← State will Change</div>
        </div>
        <div style={{textAlign:'center', marginTop:30}}>
          <button className="btn btn-primary" onClick={handleUpdate}>Update</button>
        </div>
      </div>
    </div>
  );
};

export default UpdateStatus;
