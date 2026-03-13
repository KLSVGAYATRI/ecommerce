import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart, useAuth } from '../context/AppContext';
import { createOrder } from '../services/api';
import toast from 'react-hot-toast';

const METHODS = [
  { value: 'credit_card', label: 'Credit Card', icon: '💳' },
  { value: 'debit_card', label: 'Debit Card', icon: '🏦' },
  { value: 'upi', label: 'UPI', icon: '📱' },
  { value: 'cash_on_delivery', label: 'Cash on Delivery', icon: '💵' },
];

const CheckoutPage = () => {
  const { cart, total, clearCartItems } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: user?.name || '', email: user?.email || '', address: '', city: '', zip: '', country: 'India', payment_method: 'credit_card' });

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const shipping = total >= 100 ? 0 : 9.99;
  const grandTotal = total + shipping;

  const handleSubmit = async () => {
    if (!form.address || !form.city || !form.zip) { toast.error('Please fill all address fields'); return; }
    setLoading(true);
    try {
      const items = cart.map(item => ({ product_id: item.product_id, quantity: item.quantity, price: item.price }));
      const order = await createOrder({
        items,
        shipping_address: `${form.address}, ${form.city} ${form.zip}, ${form.country}`,
        payment_method: form.payment_method,
      });
      await clearCartItems();
      toast.success('Order placed successfully!');
      navigate(`/orders/${order.data.id}`, { state: { success: true } });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Order failed');
    } finally { setLoading(false); }
  };

  if (cart.length === 0) { navigate('/cart'); return null; }

  return (
    <div style={{ marginTop: 64, minHeight: '80vh' }}>
      <div style={{ background: 'var(--ink)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Almost there</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'white' }}>Checkout</h1>

          {/* Steps */}
          <div style={{ display: 'flex', gap: 24, marginTop: 20 }}>
            {[1, 2].map(s => (
              <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: s < step ? 'pointer' : 'default' }} onClick={() => s < step && setStep(s)}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: step >= s ? 'var(--accent)' : 'rgba(255,255,255,0.2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600 }}>{s}</div>
                <span style={{ fontSize: 12, color: step >= s ? 'white' : '#666', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{s === 1 ? 'Shipping' : 'Payment'}</span>
                {s < 2 && <span style={{ color: '#444' }}>—</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(360px, 100%)', gap: 40, alignItems: 'start' }}>
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            {step === 1 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: 24 }}>Shipping Details</h2>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                  <div>
                    <label className="label">Full Name</label>
                    <input className="input" value={form.name} onChange={e => set('name', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input className="input" type="email" value={form.email} onChange={e => set('email', e.target.value)} />
                  </div>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label className="label">Address</label>
                  <input className="input" value={form.address} onChange={e => set('address', e.target.value)} placeholder="Street address, apartment, suite…" />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16, marginBottom: 32 }}>
                  <div>
                    <label className="label">City</label>
                    <input className="input" value={form.city} onChange={e => set('city', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">ZIP / Postal</label>
                    <input className="input" value={form.zip} onChange={e => set('zip', e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Country</label>
                    <select className="input" value={form.country} onChange={e => set('country', e.target.value)}>
                      {['India', 'United States', 'United Kingdom', 'Australia', 'Canada'].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <button onClick={() => setStep(2)} className="btn btn-primary btn-lg" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>Continue to Payment →</button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: 24 }}>Payment Method</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 32 }}>
                  {METHODS.map(m => (
                    <label key={m.value} style={{
                      border: `2px solid ${form.payment_method === m.value ? 'var(--ink)' : 'var(--paper-mid)'}`,
                      borderRadius: 4, padding: '16px 20px', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 12, transition: 'border-color 0.2s',
                      background: form.payment_method === m.value ? 'var(--paper-warm)' : 'white',
                    }}>
                      <input type="radio" name="payment" value={m.value} checked={form.payment_method === m.value} onChange={() => set('payment_method', m.value)} style={{ display: 'none' }} />
                      <span style={{ fontSize: 24 }}>{m.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: form.payment_method === m.value ? 600 : 400 }}>{m.label}</span>
                    </label>
                  ))}
                </div>

                {['credit_card', 'debit_card'].includes(form.payment_method) && (
                  <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-mid)', borderRadius: 4, padding: 24, marginBottom: 24 }}>
                    <div style={{ marginBottom: 16 }}>
                      <label className="label">Card Number</label>
                      <input className="input" placeholder="1234 5678 9012 3456" maxLength={19} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                      <div>
                        <label className="label">Expiry</label>
                        <input className="input" placeholder="MM / YY" maxLength={7} />
                      </div>
                      <div>
                        <label className="label">CVV</label>
                        <input className="input" placeholder="•••" maxLength={4} type="password" />
                      </div>
                    </div>
                  </div>
                )}

                {form.payment_method === 'upi' && (
                  <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-mid)', borderRadius: 4, padding: 24, marginBottom: 24 }}>
                    <label className="label">UPI ID</label>
                    <input className="input" placeholder="yourname@upi" />
                  </div>
                )}

                <div style={{ display: 'flex', gap: 12 }}>
                  <button onClick={() => setStep(1)} className="btn btn-outline btn-lg" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>← Back</button>
                  <button onClick={handleSubmit} disabled={loading} className="btn btn-primary btn-lg" style={{ flex: 1, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
                    {loading ? 'Placing Order…' : `Place Order — $${grandTotal.toFixed(2)}`}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          <div style={{ background: 'var(--paper-warm)', border: '1px solid var(--paper-mid)', borderRadius: 4, padding: 24, position: 'sticky', top: 88 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 16 }}>Your Order</h3>
            {cart.map(item => (
              <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 8, gap: 12 }}>
                <span style={{ color: 'var(--ink-muted)', flex: 1 }}>{item.name} × {item.quantity}</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: 'var(--ink-muted)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>${total.toFixed(2)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 12 }}>
              <span style={{ color: 'var(--ink-muted)' }}>Shipping</span>
              <span style={{ color: shipping === 0 ? 'var(--green)' : 'var(--ink)', fontFamily: 'var(--font-mono)' }}>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>${grandTotal.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
