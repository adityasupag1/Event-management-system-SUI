import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const MaintainUser = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const fetchUsers = async () => {
    try {
      const { data } = await API.get('/admin/users');
      setUsers(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.name || !form.email || (!editing && !form.password)) { setErr('All fields required'); return; }
    try {
      if (editing) {
        await API.put(`/admin/users/${editing}`, form);
        setMsg('User updated');
        setEditing(null);
      } else {
        await API.post('/admin/users', form);
        setMsg('User added');
      }
      setForm({ name: '', email: '', password: '' });
      fetchUsers();
    } catch (error) {
      setErr(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    try {
      await API.delete(`/admin/users/${id}`);
      fetchUsers();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const toggleStatus = async (user) => {
    const newStatus = user.status === 'Active' ? 'Inactive' : 'Active';
    try {
      await API.put(`/admin/users/${user._id}`, { status: newStatus });
      fetchUsers();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="admin-container" style={{maxWidth: 1200}}>
        <div className="admin-top-bar">
          <button className="admin-btn" onClick={() => navigate('/admin/home')}>Home</button>
          <button className="admin-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <h2 style={{textAlign:'center', marginBottom:20}}>Maintain Users</h2>
        {err && <div className="message error">{err}</div>}
        {msg && <div className="message success">{msg}</div>}

        <form onSubmit={handleSubmit} style={{background:'white', padding:20, borderRadius:8, marginBottom:20}}>
          <h3 style={{marginBottom:15}}>{editing ? 'Update User' : 'Add New User'}</h3>
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr auto', gap:10}}>
            <input type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <input type="password" placeholder={editing ? "New password (blank to keep)" : "Password"} value={form.password} onChange={(e) => setForm({...form, password: e.target.value})} style={{padding:10, borderRadius:4, border:'1px solid #ccc'}}/>
            <button type="submit" className="admin-btn">{editing ? 'Update' : 'Add'}</button>
          </div>
          {editing && (
            <button type="button" className="admin-btn" style={{marginTop:10}} onClick={() => { setEditing(null); setForm({ name:'', email:'', password:'' }); }}>Cancel</button>
          )}
        </form>

        <div style={{display:'grid', gridTemplateColumns:'1fr 1.5fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Name','Email','Status','Update','Delete'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {users.length === 0 ? <div className="empty-state">No users</div> :
          users.map(u => (
            <div key={u._id} style={{display:'grid', gridTemplateColumns:'1fr 1.5fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{u.name}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{u.email}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>
                <label style={{cursor:'pointer'}}>
                  <input type="checkbox" checked={u.status === 'Active'} onChange={() => toggleStatus(u)} /> {u.status}
                </label>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => { setEditing(u._id); setForm({ name: u.name, email: u.email, password: '' }); }}>Update</button>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => deleteUser(u._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MaintainUser;
