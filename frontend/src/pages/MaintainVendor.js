import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const MaintainVendor = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '', category: 'Catering' });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const fetchVendors = async () => {
    try {
      const { data } = await API.get('/admin/vendors');
      setVendors(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchVendors(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.name || !form.email || (!editing && !form.password) || !form.category) {
      setErr('All fields required'); return;
    }
    try {
      if (editing) {
        await API.put(`/admin/vendors/${editing}`, form);
        setMsg('Vendor updated');
        setEditing(null);
      } else {
        await API.post('/admin/vendors', form);
        setMsg('Vendor added');
      }
      setForm({ name: '', email: '', password: '', category: 'Catering' });
      fetchVendors();
    } catch (error) {
      setErr(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteVendor = async (id) => {
    if (!window.confirm('Delete this vendor?')) return;
    try {
      await API.delete(`/admin/vendors/${id}`);
      fetchVendors();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const toggleStatus = async (v) => {
    const newStatus = v.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await API.put(`/admin/vendors/${v._id}`, { status: newStatus });
      fetchVendors();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="admin-container" style={{maxWidth: 1300}}>
        <div className="admin-top-bar">
          <button className="admin-btn" onClick={() => navigate('/admin/home')}>Home</button>
          <button className="admin-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <h2 style={{textAlign:'center', marginBottom:20}}>Maintain Vendors</h2>
        {err && <div className="message error">{err}</div>}
        {msg && <div className="message success">{msg}</div>}

        <form onSubmit={handleSubmit} style={{background:'white', padding:20, borderRadius:8, marginBottom:20}}>
          <h3 style={{marginBottom:15}}>{editing ? 'Update Vendor' : 'Add New Vendor'}</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr auto', gap:10}}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <input type="password" placeholder={editing ? "New password (blank to keep)" : "Password"} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}>
              <option>Catering</option>
              <option>Florist</option>
              <option>Decoration</option>
              <option>Lighting</option>
            </select>
            <button type="submit" className="admin-btn">{editing ? 'Update' : 'Add'}</button>
          </div>
          {editing && <button type="button" className="admin-btn" style={{marginTop:10}} onClick={() => { setEditing(null); setForm({ name:'', email:'', password:'', category:'Catering' }); }}>Cancel</button>}
        </form>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1.5fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Name','Email','Category','Status','Update','Delete'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {vendors.length === 0 ? <div className="empty-state">No vendors</div> :
          vendors.map(v => (
            <div key={v._id} style={{display:'grid', gridTemplateColumns:'1fr 1.5fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{v.name}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{v.email}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{v.category}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>
                <label style={{cursor:'pointer'}}>
                  <input type="checkbox" checked={v.status === 'Active'} onChange={() => toggleStatus(v)} /> {v.status}
                </label>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => { setEditing(v._id); setForm({ name: v.name, email: v.email, password: '', category: v.category }); }}>Update</button>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => deleteVendor(v._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MaintainVendor;
