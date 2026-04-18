import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const YourItem = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ productName: '', productPrice: '', productImage: '' });
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');

  const fetchProducts = async () => {
    try {
      const { data } = await API.get('/products/vendor');
      setProducts(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setForm({ ...form, productImage: reader.result });
    reader.readAsDataURL(file);
  };

  const addProduct = async (e) => {
    e.preventDefault();
    setErr(''); setMsg('');
    if (!form.productName || !form.productPrice) { setErr('Name and price are mandatory'); return; }
    if (Number(form.productPrice) <= 0) { setErr('Price must be positive'); return; }
    try {
      await API.post('/products', form);
      setForm({ productName: '', productPrice: '', productImage: '' });
      setMsg('Product added successfully');
      fetchProducts();
    } catch (error) {
      setErr(error.response?.data?.message || 'Failed to add');
    }
  };

  const deleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await API.delete(`/products/${id}`);
      fetchProducts();
    } catch (e) { setErr(e.response?.data?.message || 'Failed to delete'); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div className="vendor-welcome-header">
          <div>Welcome '{user?.name}'</div>
          <div className="nav-tabs">
            <button className="nav-btn" onClick={() => navigate('/vendor/product-status')}>Product Status</button>
            <button className="nav-btn" onClick={() => navigate('/vendor/request-item')}>Request Item</button>
            <button className="nav-btn" onClick={() => navigate('/vendor/view-product')}>View Product</button>
            <button className="nav-btn" onClick={handleLogout}>Log Out</button>
          </div>
        </div>
        {err && <div className="message error">{err}</div>}
        {msg && <div className="message success">{msg}</div>}
        <div className="split-layout">
          <div className="add-product-card">
            <form onSubmit={addProduct}>
              <input className="add-product-input" type="text" placeholder="Product Name"
                value={form.productName} onChange={(e) => setForm({...form, productName: e.target.value})} />
              <input className="add-product-input" type="number" placeholder="Product Price"
                value={form.productPrice} onChange={(e) => setForm({...form, productPrice: e.target.value})} />
              <input className="add-product-input" type="file" accept="image/*" onChange={handleImage} />
              <button type="submit" className="nav-btn" style={{width: '100%', background: 'white'}}>Add The Product</button>
            </form>
          </div>
          <div className="your-items-panel">
            <div className="items-list-row">
              <div className="items-list-cell">Product Image</div>
              <div className="items-list-cell">Product Name</div>
              <div className="items-list-cell">Product Price</div>
              <div className="items-list-cell">Action</div>
            </div>
            {products.length === 0 ? <div className="empty-state" style={{color: '#888'}}>No products yet. Add one above.</div> :
              products.map(p => (
                <div className="items-list-row" key={p._id}>
                  <div className="items-list-cell image-cell">
                    {p.productImage ? <img src={p.productImage} alt="" style={{width:50,height:50,borderRadius:4,objectFit:'cover'}}/> : 'Image'}
                  </div>
                  <div className="items-list-cell">{p.productName}</div>
                  <div className="items-list-cell">Rs. {p.productPrice}/-</div>
                  <div className="items-list-cell">
                    <div className="action-buttons">
                      <button onClick={() => deleteProduct(p._id)}>Delete</button>
                      <button onClick={() => {
                        const newName = prompt('New name', p.productName);
                        const newPrice = prompt('New price', p.productPrice);
                        if (newName && newPrice) {
                          API.put(`/products/${p._id}`, { productName: newName, productPrice: newPrice })
                            .then(() => fetchProducts())
                            .catch(err => alert(err.response?.data?.message));
                        }
                      }}>Update</button>
                    </div>
                  </div>
                </div>
              ))
            }
          </div>
        </div>
        <div style={{textAlign:'center', marginTop: 20}}>
          <button className="btn btn-primary" onClick={() => navigate('/vendor/home')}>Back to Home</button>
        </div>
      </div>
    </div>
  );
};

export default YourItem;
