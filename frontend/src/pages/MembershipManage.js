import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const MembershipManage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [memberships, setMemberships] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [form, setForm] = useState({ vendorId: '', duration: '6 months' }); // default 6 months
  const [editing, setEditing] = useState(null);
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const fetchData = useCallback(async () => {
    try {
      const [mRes, vRes] = await Promise.all([
        API.get('/admin/memberships'),
        API.get('/admin/vendors')
      ]);
      setMemberships(mRes.data);
      setVendors(vRes.data);
      setForm((f) => {
        if (vRes.data.length > 0 && !f.vendorId) {
          return { ...f, vendorId: vRes.data[0]._id };
        }
        return f;
      });
    } catch (e) { console.error(e); }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    // All fields mandatory
    if (!form.vendorId || !form.duration) { setErr('All fields are mandatory'); return; }
    if (!['6 months', '1 year', '2 years'].includes(form.duration)) { setErr('Invalid duration'); return; }
    try {
      if (editing) {
        await API.put(`/admin/memberships/${editing}`, { duration: form.duration });
        setMsg('Membership updated');
        setEditing(null);
      } else {
        await API.post('/admin/memberships', form);
        setMsg('Membership added');
      }
      setForm({ vendorId: vendors[0]?._id || '', duration: '6 months' });
      fetchData();
    } catch (error) {
      setErr(error.response?.data?.message || 'Operation failed');
    }
  };

  const deleteMembership = async (id) => {
    if (!window.confirm('Delete this membership?')) return;
    try {
      await API.delete(`/admin/memberships/${id}`);
      fetchData();
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
        <h2 style={{textAlign:'center', marginBottom:20}}>{editing ? 'Update Membership for Vendor' : 'Add Membership for Vendor'}</h2>
        {err && <div className="message error">{err}</div>}
        {msg && <div className="message success">{msg}</div>}

        <form onSubmit={handleSubmit} style={{background:'white', padding:25, borderRadius:8, marginBottom:20}}>
          <div className="form-row" style={{marginBottom:15}}>
            <div className="form-label">Vendor</div>
            <select className="form-select" disabled={!!editing} value={form.vendorId} onChange={(e) => setForm({...form, vendorId: e.target.value})}>
              <option value="">-- Select Vendor --</option>
              {vendors.map(v => <option key={v._id} value={v._id}>{v.name} ({v.category})</option>)}
            </select>
          </div>

          <div style={{marginTop:20, padding:20, background:'#f5f5f5', borderRadius:8}}>
            <h4 style={{marginBottom:15}}>Select Duration <small style={{color:'#888'}}>(Default: 6 months)</small></h4>
            <div style={{display:'flex', gap:20, flexWrap:'wrap'}}>
              <label style={{cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                <input type="radio" name="duration" value="6 months" checked={form.duration === '6 months'} onChange={(e) => setForm({...form, duration: e.target.value})} />
                6 months
              </label>
              <label style={{cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                <input type="radio" name="duration" value="1 year" checked={form.duration === '1 year'} onChange={(e) => setForm({...form, duration: e.target.value})} />
                1 year
              </label>
              <label style={{cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
                <input type="radio" name="duration" value="2 years" checked={form.duration === '2 years'} onChange={(e) => setForm({...form, duration: e.target.value})} />
                2 years
              </label>
            </div>
          </div>

          <div style={{marginTop:20, display:'flex', gap:10}}>
            <button type="submit" className="btn btn-primary">{editing ? 'Update Membership' : 'Add Membership'}</button>
            {editing && <button type="button" className="btn btn-gray" onClick={() => { setEditing(null); setForm({ vendorId: vendors[0]?._id || '', duration: '6 months' }); }}>Cancel</button>}
          </div>
        </form>

        <h3 style={{marginBottom:15}}>Existing Memberships</h3>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Vendor','Duration','Start Date','End Date','Update','Delete'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {memberships.length === 0 ? <div className="empty-state">No memberships yet</div> :
          memberships.map(m => (
            <div key={m._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr 1fr 1fr', gap:10, marginBottom:8}}>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{m.vendorName || m.vendorId?.name}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center'}}>{m.duration}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:12}}>{new Date(m.startDate).toLocaleDateString()}</div>
              <div style={{background:'#B4C7E7', padding:10, borderRadius:4, textAlign:'center', fontSize:12}}>{new Date(m.endDate).toLocaleDateString()}</div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => { setEditing(m._id); setForm({ vendorId: m.vendorId?._id || m.vendorId, duration: m.duration }); }}>Update</button>
              </div>
              <div style={{textAlign:'center'}}>
                <button className="admin-btn" onClick={() => deleteMembership(m._id)}>Delete</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default MembershipManage;
