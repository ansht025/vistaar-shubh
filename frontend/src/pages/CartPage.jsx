import { useNavigate } from 'react-router-dom';
import useStore from '../store/useStore';
import './CartPage.css';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, user } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + (item.unitPrice * item.quantity), 0);

  return (
    <div className="cart-page container">
      <h1>🛒 Your Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart card">
          <p>Your cart is empty</p>
          <button className="btn btn-primary" onClick={() => navigate('/')}>Start Designing</button>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.cartId} className="cart-item card">
                <div className="cart-item-preview">
                  {item.design?.preview_url ? (
                    <img src={item.design.preview_url} alt={item.design.name} />
                  ) : (
                    <div className="preview-placeholder">🎨</div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h3>{item.design?.name || 'Custom Design'}</h3>
                  <span className="badge badge-info">{item.size}</span>
                  <div className="quantity-control">
                    <button onClick={() => updateCartQuantity(item.cartId, Math.max(50, item.quantity - 50))}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateCartQuantity(item.cartId, item.quantity + 50)}>+</button>
                  </div>
                </div>
                <div className="cart-item-price">
                  <span className="item-total">₹{(item.unitPrice * item.quantity).toLocaleString()}</span>
                  <span className="item-unit">₹{item.unitPrice}/bottle</span>
                  <button className="btn btn-ghost btn-sm" onClick={() => removeFromCart(item.cartId)}>🗑️ Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="cart-summary glass">
            <h3>Order Summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>₹{total.toLocaleString()}</span></div>
            <div className="summary-row"><span>Shipping</span><span className="text-success">Free</span></div>
            <div className="summary-row total"><span>Total</span><span>₹{total.toLocaleString()}</span></div>
            <button className="btn btn-primary btn-lg" style={{ width: '100%' }}
              onClick={() => user ? navigate('/checkout') : navigate('/login')}>
              {user ? 'Proceed to Checkout' : 'Login to Checkout'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
