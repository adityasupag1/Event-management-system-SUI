import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const UserSignUp = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const validate = () => {
    if (!form.name || !form.email || !form.password) return 'All fields are mandatory';
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
      const { data } = await API.post('/auth/user/signup', form);
      login(data);
      navigate('/user/home');
    } catch (error) {
      setErr(error.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="page-container">
      <div className="card-container card-wide">
        <div className="top-nav">
          <button className="btn btn-primary" onClick={() => navigate('/chart')}>Chart</button>
          <button className="btn btn-primary" onClick={() => navigate('/user/login')}>Back</button>
        </div>
        <div className="ems-banner">Event Management System</div>
        {err && <div className="message error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-label">Name</div>
            <input className="form-input" type="text" placeholder="Your name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-label">Email</div>
            <input className="form-input" type="email" placeholder="Your email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
          </div>
          <div className="form-row">
            <div className="form-label">Password</div>
            <input className="form-input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} />
          </div>
          <div className="btn-row">
            <button type="submit" className="btn btn-primary">Sign Up</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSignUp;
