import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const VendorProducts = () => {
  const navigate = useNavigate();
  const { vendorId } = useParams();
  const { logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [vendorName, setVendorName] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    API.get(`/products/vendor/${vendorId}`).then(r => {
      setProducts(r.data);
      if (r.data.length > 0) setVendorName(r.data[0].vendorName);
    }).catch(console.error);
  }, [vendorId]);

  const addToCart = async (productId) => {
    try {
      await API.post('/cart/add', { productId });
      setMsg('Added to cart!');
      setTimeout(() => setMsg(''), 2000);
    } catch (e) { alert(e.response?.data?.message); }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1200}}>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:20, alignItems:'center'}}>
          <button className="nav-btn" onClick={() => navigate('/user/home')}>Home</button>
          <div style={{background:'#4472C4', color:'white', padding:'10px 25px', borderRadius:6}}>{vendorName || 'Vendor Name'}</div>
          <button className="nav-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <div style={{background:'#4472C4', color:'white', display:'inline-block', padding:'8px 20px', borderRadius:6, marginBottom:15}}>Products</div>
        {msg && <div className="message success">{msg}</div>}
        <div className="product-grid">
          {products.length === 0 ? <div className="empty-state" style={{gridColumn:'1/-1'}}>No products available</div> :
            products.map((p, i) => (
              <div key={p._id} className="product-card">
                <h4>Product {i+1}</h4>
                <div style={{fontSize:13, marginBottom:5}}>{p.productName}</div>
                <div className="price">Rs. {p.productPrice}/-</div>
                {p.productImage && <img src={p.productImage} alt="" style={{width:'100%', height:80, objectFit:'cover', borderRadius:4, marginBottom:8}}/>}
                <button className="vendor-card-btn" onClick={() => addToCart(p._id)}>Add to Cart</button>
              </div>
            ))
          }
        </div>
        <div style={{textAlign:'center', marginTop:20}}>
          <button className="btn btn-primary" onClick={() => navigate('/user/cart')}>View Cart</button>
        </div>
      </div>
    </div>
  );
};

export default VendorProducts;
