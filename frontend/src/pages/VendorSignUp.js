import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const VendorSignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', category: 'Catering' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.category) return 'All fields are mandatory';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Invalid email format';
    if (form.password.length < 4) return 'Password too short (min 4)';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const v = validate();
    if (v) { setErr(v); return; }
    try {
      const { data } = await API.post('/auth/vendor/signup', form);
      login(data);
      navigate('/vendor/home');
    } catch (error) {
      const d = error.response?.data;
      const serverMsg =
        typeof d === 'object' && d != null ? (d.message || d.error) : typeof d === 'string' ? d : null;
      setErr(serverMsg || error.message || 'Signup failed');
    }
  };

  return (
    <div className="page-container">
      <div className="card-container card-wide">
        <div className="top-nav">
          <button className="btn btn-primary" onClick={() => navigate('/chart')}>CHART</button>
          <button className="btn btn-primary" onClick={() => navigate('/vendor/login')}>BACK</button>
        </div>
        <div className="ems-banner">Event Management System</div>
        {err && <div className="message error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-label">Name</div>
            <input className="form-input" type="text" placeholder="Vendor name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-label">Email</div>
            <input className="form-input" type="email" placeholder="Vendor email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-label">Password</div>
            <input className="form-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-label">Category</div>
            <select className="form-select" value={form.category} onChange={(e) => setForm({...form, category: e.target.value})}>
              <option value="Catering">Catering</option>
              <option value="Florist">Florist</option>
              <option value="Decoration">Decoration</option>
              <option value="Lighting">Lighting</option>
            </select>
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VendorSignUp;
