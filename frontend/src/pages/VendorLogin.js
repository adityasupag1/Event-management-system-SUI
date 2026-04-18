import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const VendorLogin = () => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    if (!userId || !password) { setErr('All fields are required'); return; }
    try {
      const { data } = await API.post('/auth/vendor/login', { userId, password });
      login(data);
      navigate('/vendor/home');
    } catch (error) {
      setErr(error.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="page-container">
      <div className="card-container">
        <div className="top-nav">
          <button className="btn btn-primary" onClick={() => navigate('/chart')}>CHART</button>
          <button className="btn btn-primary" onClick={() => navigate('/')}>BACK</button>
        </div>
        <div className="ems-banner">Event Management System</div>
        {err && <div className="message error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-label">User Id</div>
            <input className="form-input" type="text" placeholder="Vendor email" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-label">Password</div>
            <input className="form-input" type="password" placeholder="Vendor password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="btn-row">
            <button type="button" className="btn btn-gray" onClick={() => { setUserId(''); setPassword(''); }}>Cancel</button>
            <button type="submit" className="btn btn-gray">Login</button>
          </div>
        </form>
        <p style={{textAlign: 'center', marginTop: 15}}>
          New Vendor? <button style={{background:'none', border:'none', color:'#4472C4', cursor:'pointer', textDecoration:'underline'}} onClick={() => navigate('/vendor/signup')}>Sign Up</button>
        </p>
      </div>
    </div>
  );
};

export default VendorLogin;
