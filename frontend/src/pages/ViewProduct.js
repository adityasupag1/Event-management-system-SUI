import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const ViewProduct = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    API.get('/products/vendor').then(r => setProducts(r.data)).catch(console.error);
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
          <button className="nav-btn blue" onClick={() => navigate('/vendor/home')}>Home</button>
          <h2>View Product</h2>
          <button className="nav-btn blue" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:10}}>
          {['Product Image','Product Name','Product Price','Action'].map(h => (
            <div key={h} style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{h}</div>
          ))}
        </div>
        {products.length === 0 ? <div className="empty-state">No products added yet</div> :
          products.map(p => (
            <div key={p._id} style={{display:'grid', gridTemplateColumns:'1fr 1fr 1fr 1fr', gap:10, marginBottom:8, alignItems:'center'}}>
              <div style={{background:'#4472C4', padding:10, borderRadius:4, textAlign:'center', minHeight:60, display:'flex', alignItems:'center', justifyContent:'center'}}>
                {p.productImage ? <img src={p.productImage} alt="" style={{width:50,height:50,borderRadius:4,objectFit:'cover'}}/> : 'Image'}
              </div>
              <div style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>{p.productName}</div>
              <div style={{background:'#4472C4', color:'white', padding:10, borderRadius:4, textAlign:'center'}}>Rs. {p.productPrice}/-</div>
              <div style={{display:'flex', gap:5, flexDirection:'column'}}>
                <button className="nav-btn" onClick={() => {
                  if (!window.confirm('Delete?')) return;
                  API.delete(`/products/${p._id}`).then(() => setProducts(products.filter(x => x._id !== p._id)));
                }}>Delete</button>
                <button className="nav-btn" onClick={() => {
                  const newName = prompt('New name', p.productName);
                  const newPrice = prompt('New price', p.productPrice);
                  if (newName && newPrice) {
                    API.put(`/products/${p._id}`, { productName: newName, productPrice: newPrice })
                      .then(() => API.get('/products/vendor').then(r => setProducts(r.data)));
                  }
                }}>Update</button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ViewProduct;
