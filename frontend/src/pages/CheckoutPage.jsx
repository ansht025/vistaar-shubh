import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './CheckoutPage.css';

export default function CheckoutPage() {
  const { cart, clearCart, user } = useStore();
  const navigate = useNavigate();
  const [step, setStep] = useState('address'); // address | payment | success
  const [address, setAddress] = useState({ line1: '', city: '', state: '', pincode: '', phone: '' });
  const [orderId, setOrderId] = useState('');

  const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  const handlePlaceOrder = () => {
    setOrderId(`VIS-${Date.now().toString().slice(-6)}`);
    setStep('success');
    setTimeout(() => clearCart(), 1000);
  };

  if (!user) return <Navigate to="/login" replace />;

  if (step === 'success') {
    return (
      <div className="checkout-page container">
        <div className="success-card glass">
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for your order. We'll start production right away.</p>
          <p className="order-id">Order #{orderId}</p>
          <div className="success-actions">
            <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>View Dashboard</button>
            <button className="btn btn-ghost" onClick={() => navigate('/')}>Design More</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page container">
      <h1>📦 Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-form">
          {step === 'address' && (
            <div className="checkout-section card">
              <h3>Shipping Address</h3>
              <div className="input-group">
                <label>Address Line</label>
                <input className="input" placeholder="Street, Building" value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })} />
              </div>
              <div className="input-row-2">
                <div className="input-group">
                  <label>City</label>
                  <input className="input" placeholder="Mumbai" value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>State</label>
                  <input className="input" placeholder="Maharashtra" value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })} />
                </div>
              </div>
              <div className="input-row-2">
                <div className="input-group">
                  <label>PIN Code</label>
                  <input className="input" placeholder="400001" value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Phone</label>
                  <input className="input" placeholder="+91 98765 43210" value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })} />
                </div>
              </div>
              <button className="btn btn-primary" onClick={() => setStep('payment')}>Continue to Payment →</button>
            </div>
          )}
          {step === 'payment' && (
            <div className="checkout-section card">
              <h3>💳 Payment Method</h3>
              <div className="payment-options">
                {['UPI', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map((m) => (
                  <label key={m} className="payment-option">
                    <input type="radio" name="payment" defaultChecked={m === 'UPI'} /> {m}
                  </label>
                ))}
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                * This is a demo checkout. No real payment will be processed.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button className="btn btn-ghost" onClick={() => setStep('address')}>← Back</button>
                <button className="btn btn-primary" onClick={handlePlaceOrder}>Place Order — ₹{total.toLocaleString()}</button>
              </div>
            </div>
          )}
        </div>
        <div className="checkout-summary glass">
          <h3>Order Summary</h3>
          {cart.map((item) => (
            <div key={item.cartId} className="summary-item">
              <span>{item.design?.name || 'Design'} × {item.quantity}</span>
              <span>₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
        </div>
      </div>
    </div>
  );
}
