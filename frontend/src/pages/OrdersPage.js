import React, { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import { getUserOrders, getOrder } from '../services/api';

const STATUS_STEPS = ['pending', 'processing', 'shipped', 'delivered'];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserOrders().then(r => setOrders(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}><div className="spinner" /></div>;

  return (
    <div style={{ marginTop: 64, minHeight: '80vh' }}>
      <div style={{ background: 'var(--ink)', padding: '40px 0 32px' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>History</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'white' }}>My Orders</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📦</div>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 300, marginBottom: 12 }}>No orders yet</h2>
            <Link to="/products" className="btn btn-primary">Start Shopping</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {orders.map(order => (
              <div key={order.id} className="card" style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: '0.08em', color: 'var(--ink-muted)', textTransform: 'uppercase', marginBottom: 4 }}>Order #{order.id.toString().padStart(4,'0')}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{new Date(order.created_at).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span className={`badge badge-${order.status}`}>{order.status}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18, fontWeight: 600 }}>${parseFloat(order.total_amount).toFixed(2)}</span>
                    <Link to={`/orders/${order.id}`} className="btn btn-outline btn-sm" style={{ fontSize: 11, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Details</Link>
                  </div>
                </div>

                {/* Progress bar */}
                {order.status !== 'cancelled' && (
                  <div style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      {STATUS_STEPS.map(step => (
                        <div key={step} style={{ flex: 1, textAlign: 'center' }}>
                          <div style={{
                            width: 10, height: 10, borderRadius: '50%', margin: '0 auto 4px',
                            background: STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(order.status) ? 'var(--accent)' : 'var(--paper-mid)',
                            transition: 'background 0.3s',
                          }} />
                          <span style={{ fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.06em', color: STATUS_STEPS.indexOf(step) <= STATUS_STEPS.indexOf(order.status) ? 'var(--accent)' : 'var(--ink-muted)', fontWeight: STATUS_STEPS.indexOf(step) === STATUS_STEPS.indexOf(order.status) ? 700 : 400 }}>{step}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ height: 2, background: 'var(--paper-mid)', borderRadius: 1, position: 'relative' }}>
                      <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 1, width: `${(STATUS_STEPS.indexOf(order.status) / (STATUS_STEPS.length - 1)) * 100}%`, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )}

                {/* Items preview */}
                {order.items && order.items[0] && (
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {order.items.slice(0, 4).map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--paper-warm)', padding: '6px 12px', borderRadius: 2 }}>
                        {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: 28, height: 28, objectFit: 'cover', borderRadius: 2 }} />}
                        <span style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item.name} × {item.quantity}</span>
                      </div>
                    ))}
                    {order.items.length > 4 && <span style={{ fontSize: 12, color: 'var(--ink-muted)', padding: '6px 12px' }}>+{order.items.length - 4} more</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const OrderDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(id).then(r => setOrder(r.data)).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}><div className="spinner" /></div>;
  if (!order) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}>Order not found.</div>;

  return (
    <div style={{ marginTop: 64, minHeight: '80vh' }}>
      <div style={{ background: 'var(--ink)', padding: '40px 0 32px' }}>
        <div className="container">
          {location.state?.success && (
            <div style={{ background: 'rgba(58,140,92,0.2)', border: '1px solid var(--green)', borderRadius: 4, padding: '12px 20px', marginBottom: 20, color: '#a8f0c6', fontSize: 14, display: 'flex', gap: 12, alignItems: 'center' }}>
              <span>✅</span> Your order has been placed successfully! Thank you for shopping with LUXE.
            </div>
          )}
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Order #{order.id.toString().padStart(4,'0')}</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'white' }}>Order Details</h1>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr min(300px, 100%)', gap: 40, alignItems: 'start' }}>
          <div>
            <div className="card" style={{ padding: 24, marginBottom: 20 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Items Ordered</h3>
              {order.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 16, padding: '12px 0', borderBottom: i < order.items.length - 1 ? '1px solid var(--paper-mid)' : 'none' }}>
                  {item.image_url && <img src={item.image_url} alt={item.name} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 2 }} />}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--font-serif)', fontSize: 16, fontWeight: 400, marginBottom: 4 }}>{item.name}</div>
                    <div style={{ fontSize: 13, color: 'var(--ink-muted)' }}>Qty: {item.quantity} × ${parseFloat(item.price).toFixed(2)}</div>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontWeight: 500 }}>${(item.quantity * item.price).toFixed(2)}</div>
                </div>
              ))}
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 16 }}>Shipping Address</h3>
              <p style={{ fontSize: 14, color: 'var(--ink-muted)', lineHeight: 1.8 }}>{order.shipping_address}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Summary</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--ink-muted)', fontSize: 13 }}>Status</span>
              <span className={`badge badge-${order.status}`}>{order.status}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
              <span style={{ color: 'var(--ink-muted)' }}>Placed</span>
              <span>{new Date(order.created_at).toLocaleDateString()}</span>
            </div>
            <div className="divider" />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
              <span>Total</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: 18 }}>${parseFloat(order.total_amount).toFixed(2)}</span>
            </div>
            <div style={{ marginTop: 20 }}>
              <Link to="/orders" className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>← All Orders</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrdersPage;
