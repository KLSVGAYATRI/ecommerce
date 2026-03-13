import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';

const CartPage = () => {
  const { cart, updateItem, removeItem, total, loading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) return (
    <div style={{ marginTop: 64, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontSize: 64 }}>🛍</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300 }}>Sign in to view your cart</h2>
      <Link to="/login" className="btn btn-primary">Sign In</Link>
    </div>
  );

  if (loading) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}><div className="spinner" /></div>;

  if (cart.length === 0) return (
    <div style={{ marginTop: 64, minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20 }}>
      <div style={{ fontSize: 64 }}>🛒</div>
      <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 32, fontWeight: 300 }}>Your cart is empty</h2>
      <p style={{ color: 'var(--ink-muted)', fontSize: 14 }}>Add some products to get started.</p>
      <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
    </div>
  );

  return (
    <div style={{ marginTop: 64, minHeight: '80vh' }}>
      <div style={{ background: 'var(--ink)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Review</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'white' }}>Shopping Cart</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(360px, 100%)', gap: 40, alignItems: 'start' }}>
          {/* Cart items */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, paddingBottom: 12, borderBottom: '2px solid var(--ink)' }}>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Product</span>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' }}>Total</span>
            </div>

            {cart.map(item => (
              <div key={item.product_id} style={{ display: 'flex', gap: 20, padding: '20px 0', borderBottom: '1px solid var(--paper-mid)', alignItems: 'center' }}>
                <Link to={`/products/${item.product_id}`}>
                  <img src={item.image_url} alt={item.name} style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 2, border: '1px solid var(--paper-mid)' }} />
                </Link>

                <div style={{ flex: 1 }}>
                  <Link to={`/products/${item.product_id}`}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 4 }}>{item.name}</h3>
                  </Link>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--ink-muted)', marginBottom: 12 }}>${parseFloat(item.price).toFixed(2)} each</div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--paper-mid)', borderRadius: 2 }}>
                      <button onClick={() => updateItem(item.product_id, item.quantity - 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>−</button>
                      <span style={{ width: 36, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 13 }}>{item.quantity}</span>
                      <button onClick={() => updateItem(item.product_id, item.quantity + 1)} style={{ width: 32, height: 32, background: 'none', border: 'none', cursor: 'pointer', fontSize: 16 }}>+</button>
                    </div>
                    <button onClick={() => removeItem(item.product_id)} style={{ fontSize: 12, color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.04em' }}>Remove</button>
                  </div>
                </div>

                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 16, fontWeight: 500, textAlign: 'right' }}>
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{ marginTop: 24 }}>
              <Link to="/products" style={{ fontSize: 12, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--ink-muted)', display: 'flex', alignItems: 'center', gap: 6 }}>
                ← Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order summary */}
          <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-mid)', borderRadius: 4, padding: 28, position: 'sticky', top: 88 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Order Summary</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 24 }}>
              {cart.map(item => (
                <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
                  <span style={{ color: 'var(--ink-muted)' }}>{item.name} × {item.quantity}</span>
                  <span style={{ fontFamily: 'var(--font-mono)' }}>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--ink-muted)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
              <span style={{ color: 'var(--ink-muted)' }}>Shipping</span>
              <span style={{ color: 'var(--green)', fontSize: 12, fontWeight: 500 }}>{total >= 100 ? 'Free' : '$9.99'}</span>
            </div>

            <div className="divider" />

            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24 }}>
              <span style={{ fontWeight: 600, fontSize: 15 }}>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 600 }}>
                ${(total + (total >= 100 ? 0 : 9.99)).toFixed(2)}
              </span>
            </div>

            <button onClick={() => navigate('/checkout')} className="btn btn-primary" style={{ width: '100%', height: 48, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
              Proceed to Checkout
            </button>

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'center', gap: 12 }}>
              {['💳', '💰', '🏦', '📱'].map((icon, i) => (
                <span key={i} style={{ fontSize: 20, opacity: 0.5 }}>{icon}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
