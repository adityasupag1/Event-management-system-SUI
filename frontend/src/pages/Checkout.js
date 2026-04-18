import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState({ items: [] });
  const [form, setForm] = useState({
    name: '', number: '', email: '', paymentMethod: 'Cash',
    address: '', state: '', city: '', pinCode: ''
  });
  const [err, setErr] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(() => {
    API.get('/cart').then(r => setCart(r.data)).catch(console.error);
  }, []);

  const validate = () => {
    const { name, number, email, address, state, city, pinCode } = form;
    if (!name || !number || !email || !address || !state || !city || !pinCode) return 'All fields are required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Invalid email';
    if (!/^\d{10}$/.test(number)) return 'Invalid phone number (10 digits)';
    if (!/^\d{6}$/.test(pinCode)) return 'Invalid pin code (6 digits)';
    return '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    const v = validate();
    if (v) { setErr(v); return; }
    try {
      const { data } = await API.post('/orders', form);
      setOrder(data);
      setShowPopup(true);
    } catch (error) {
      setErr(error.response?.data?.message || 'Order failed');
    }
  };

  const total = cart.items.reduce((s, it) => s + it.price * it.quantity, 0);
  const itemNames = cart.items.map(it => it.productName).join(', ');

  return (
    <div className="page-container">
      <div className="status-card" style={{maxWidth: 900}}>
        <div style={{background:'#4472C4', color:'white', textAlign:'center', padding:12, borderRadius:6, maxWidth:200, margin:'0 auto 15px'}}>Item</div>
        <div style={{background:'#4472C4', color:'white', textAlign:'center', padding:10, borderRadius:6, maxWidth:180, margin:'0 auto 25px', fontSize:13}}>
          {itemNames || 'No items'} {total > 0 && `(₹${total})`}
        </div>
        {err && <div className="message error">{err}</div>}
        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            <div className="checkout-field">
              <input className="blue-input" type="text" placeholder="Name" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} />
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="tel" placeholder="Number (10 digits)" value={form.number} onChange={(e) => setForm({...form, number: e.target.value})} />
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} />
            </div>
            <div className="checkout-field">
              <select className="blue-input" value={form.paymentMethod} onChange={(e) => setForm({...form, paymentMethod: e.target.value})}>
                <option value="Cash">Cash</option>
                <option value="UPI">UPI</option>
              </select>
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({...form, address: e.target.value})} />
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="text" placeholder="State" value={form.state} onChange={(e) => setForm({...form, state: e.target.value})} />
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="text" placeholder="City" value={form.city} onChange={(e) => setForm({...form, city: e.target.value})} />
            </div>
            <div className="checkout-field">
              <input className="blue-input" type="text" placeholder="Pin Code (6 digits)" value={form.pinCode} onChange={(e) => setForm({...form, pinCode: e.target.value})} />
            </div>
          </div>
          <div className="center-btn">
            <button type="submit" className="btn btn-primary" style={{padding:'12px 40px', borderRadius:20}}>Order Now</button>
          </div>
        </form>
      </div>

      {showPopup && order && (
        <div className="popup-overlay">
          <div className="popup">
            <h2>THANK YOU</h2>
            <div style={{background:'#4472C4', color:'white', padding:10, borderRadius:6, margin:'15px auto', maxWidth:200}}>Total Amount: ₹{order.totalAmount}</div>
            <div className="checkout-grid" style={{marginTop:20}}>
              <div className="checkout-field"><div className="blue-input">{order.name}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.number}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.email}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.paymentMethod}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.address}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.state}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.city}</div></div>
              <div className="checkout-field"><div className="blue-input">{order.pinCode}</div></div>
            </div>
            <div style={{marginTop:25}}>
              <button className="btn btn-primary" style={{borderRadius:20}} onClick={() => navigate('/user/home')}>Continue Shopping</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;
