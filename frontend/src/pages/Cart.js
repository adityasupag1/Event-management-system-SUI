import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';

const Cart = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [cart, setCart] = useState({ items: [] });

  const fetchCart = async () => {
    try {
      const { data } = await API.get('/cart');
      setCart(data);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchCart(); }, []);

  const updateQty = async (productId, qty) => {
    if (qty < 1) return;
    try {
      await API.put('/cart/update', { productId, quantity: qty });
      fetchCart();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const removeItem = async (productId) => {
    try {
      await API.delete(`/cart/item/${productId}`);
      fetchCart();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const deleteAll = async () => {
    if (!window.confirm('Clear the entire cart?')) return;
    try {
      await API.delete('/cart/clear');
      fetchCart();
    } catch (e) { alert(e.response?.data?.message); }
  };

  const grandTotal = cart.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const handleLogout = () => { logout(); navigate('/'); };

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 1300}}>
        <div className="top-bar">
          <button className="nav-btn" onClick={() => navigate('/user/home')}>Home</button>
          <button className="nav-btn" onClick={() => navigate('/user/home')}>View Product</button>
          <button className="nav-btn" onClick={() => navigate('/user/guest-list')}>Request Item</button>
          <button className="nav-btn" onClick={() => navigate('/user/order-status')}>Product Status</button>
          <button className="nav-btn" onClick={handleLogout}>LogOut</button>
        </div>
        <div className="cart-header">Shopping Cart</div>
        <div className="cart-row">
          {['Image','Name','Price','Quantity','Total Price','Action'].map(h => (
            <div key={h} className="cart-cell header">{h}</div>
          ))}
        </div>
        {cart.items.length === 0 ? <div className="empty-state">Your cart is empty</div> :
          cart.items.map(it => (
            <div className="cart-row" key={it.productId}>
              <div className="cart-cell">{it.productImage ? <img src={it.productImage} alt="" style={{width:50,height:50,borderRadius:4,objectFit:'cover'}}/> : 'Image'}</div>
              <div className="cart-cell">{it.productName}</div>
              <div className="cart-cell">{it.price}/-</div>
              <div className="cart-cell">
                <input type="number" min="1" className="qty-input" value={it.quantity} onChange={(e) => updateQty(it.productId, parseInt(e.target.value) || 1)} />
              </div>
              <div className="cart-cell">{it.price * it.quantity}/-</div>
              <div className="cart-cell">
                <button className="nav-btn" onClick={() => removeItem(it.productId)}>Remove</button>
              </div>
            </div>
          ))
        }
        {cart.items.length > 0 && (
          <>
            <div className="grand-total">
              <span>Grand Total</span>
              <span>{grandTotal}/-</span>
              <button className="nav-btn" onClick={deleteAll}>Delete All</button>
            </div>
            <div style={{textAlign:'center', marginTop:20}}>
              <button className="nav-btn" style={{padding:'12px 40px'}} onClick={() => navigate('/user/checkout')}>Proceed to CheckOut</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;
