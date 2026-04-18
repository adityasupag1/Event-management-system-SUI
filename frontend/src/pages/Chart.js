import React from 'react';
import { useNavigate } from 'react-router-dom';

const Chart = () => {
  const navigate = useNavigate();

  const nodeStyle = {
    background: 'white',
    border: '1px solid #4472C4',
    padding: '8px 15px',
    textAlign: 'center',
    borderRadius: '4px',
    fontSize: '13px'
  };

  return (
    <div className="page-container" style={{padding: 20}}>
      <div style={{width: '100%', maxWidth: 1200, background: 'white', padding: 30, borderRadius: 8, overflowX: 'auto'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: 20}}>
          <h2>Application Flow Chart</h2>
          <button className="btn btn-primary" onClick={() => navigate(-1)}>BACK</button>
        </div>
        
        <div style={{textAlign: 'center'}}>
          <div style={{display: 'inline-block', background: '#92D050', padding: '10px 30px', borderRadius: '50%', marginBottom: 15}}>START</div>
          <div style={{marginBottom: 10, fontSize: 20}}>↓</div>
          <div style={{...nodeStyle, display: 'inline-block', marginBottom: 15}}>INDEX</div>
          <div style={{marginBottom: 10, fontSize: 20}}>↓</div>
          <div style={{...nodeStyle, display: 'inline-block', marginBottom: 20}}>LOGIN</div>
          
          <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20, marginTop: 20}}>
            {/* Vendor */}
            <div>
              <div style={{...nodeStyle, marginBottom: 10, fontWeight: 'bold'}}>VENDOR</div>
              <div style={{...nodeStyle, marginBottom: 10}}>Main Page</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: 10}}>
                <div style={{...nodeStyle, fontSize: 11}}>Your Item</div>
                <div style={{...nodeStyle, fontSize: 11}}>Add New Item</div>
                <div style={{...nodeStyle, fontSize: 11}}>Transaction</div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5}}>
                <div style={{...nodeStyle, fontSize: 10}}>Insert / Delete</div>
                <div style={{...nodeStyle, fontSize: 10}}>Product Status / Request Item / View Product</div>
                <div style={{...nodeStyle, fontSize: 10}}>User Request</div>
              </div>
            </div>
            
            {/* Admin */}
            <div>
              <div style={{...nodeStyle, marginBottom: 10, fontWeight: 'bold'}}>ADMIN</div>
              <div style={{...nodeStyle, marginBottom: 10}}>Maintenance Menu<br/><b>(Admin access only)</b></div>
              <div style={{...nodeStyle, marginBottom: 10, fontSize: 11}}>
                Add/Update Memberships<br/>
                Add/Update User, Vendor<br/>
                Users Management<br/>
                Vendor
              </div>
              <div style={{...nodeStyle, marginBottom: 10, fontSize: 11}}>Add Membership for Vendor</div>
              <div style={{...nodeStyle, fontSize: 11}}>Update Membership for Vendor</div>
            </div>
            
            {/* User */}
            <div>
              <div style={{...nodeStyle, marginBottom: 10, fontWeight: 'bold'}}>USER</div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 10}}>
                <div style={{...nodeStyle, fontSize: 11}}>Vendor</div>
                <div style={{...nodeStyle, fontSize: 11}}>Cart</div>
                <div style={{...nodeStyle, fontSize: 11}}>Guest List</div>
                <div style={{...nodeStyle, fontSize: 11}}>Order Status</div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5}}>
                <div style={{...nodeStyle, fontSize: 10}}>Payment</div>
                <div style={{...nodeStyle, fontSize: 10}}>Update / Delete</div>
                <div style={{...nodeStyle, fontSize: 10}}>Total Amount</div>
                <div style={{...nodeStyle, fontSize: 10}}>Check Status</div>
              </div>
              <div style={{...nodeStyle, marginTop: 5, fontSize: 10}}>Cancel</div>
            </div>
          </div>
        </div>
        
        <div style={{marginTop: 30, padding: 15, background: '#f5f5f5', borderRadius: 8, fontSize: 13}}>
          <h4>Rules:</h4>
          <ul style={{marginLeft: 20, marginTop: 10}}>
            <li>Maintenance module is mandatory before reports/transactions</li>
            <li>Admin can access maintenance, reports and transactions</li>
            <li>User cannot access maintenance. User has access to reports and transactions</li>
            <li>Passwords are hidden on the login pages</li>
            <li>Validations on forms. Session should work properly</li>
            <li>Add Membership: 6 months / 1 year / 2 years (default 6 months)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Chart;
