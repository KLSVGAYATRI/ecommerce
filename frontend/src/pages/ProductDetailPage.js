import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProduct } from '../services/api';
import { useAuth, useCart } from '../context/AppContext';

const Stars = ({ rating, size = 16 }) => (
  <div className="stars" style={{ fontSize: size }}>
    {[1,2,3,4,5].map(i => <span key={i} style={{ color: i <= Math.floor(rating) ? 'var(--accent)' : 'var(--paper-mid)' }}>★</span>)}
  </div>
);

const ProductDetailPage = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    setLoading(true);
    getProduct(id).then(r => setProduct(r.data)).finally(() => setLoading(false));
    window.scrollTo(0, 0);
  }, [id]);

  const handleAdd = async () => {
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    await addToCart(product.id, qty);
    setAdding(false);
  };

  if (loading) return (
    <div style={{ marginTop: 64, padding: '60px 0' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60 }}>
          <div className="skeleton" style={{ aspectRatio: '1', borderRadius: 4 }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[200, 40, 80, 120, 100].map((w, i) => <div key={i} className="skeleton" style={{ height: 20, width: `${w}px` }} />)}
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}>Product not found.</div>;

  return (
    <div style={{ marginTop: 64 }}>
      {/* Breadcrumb */}
      <div style={{ background: 'var(--paper-warm)', borderBottom: '1px solid var(--paper-mid)', padding: '12px 0' }}>
        <div className="container">
          <div style={{ fontSize: 12, color: 'var(--ink-muted)', display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link to="/" style={{ color: 'var(--ink-muted)' }}>Home</Link>
            <span>/</span>
            <Link to="/products" style={{ color: 'var(--ink-muted)' }}>Products</Link>
            <span>/</span>
            <Link to={`/products?category=${product.category}`} style={{ color: 'var(--ink-muted)' }}>{product.category}</Link>
            <span>/</span>
            <span style={{ color: 'var(--ink)' }}>{product.name}</span>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '60px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '60px', alignItems: 'start' }}>
          {/* Image */}
          <div>
            <div style={{ borderRadius: 4, overflow: 'hidden', border: '1px solid var(--paper-mid)', background: 'white' }}>
              <img src={product.image_url} alt={product.name} style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
            </div>
          </div>

          {/* Details */}
          <div style={{ animation: 'fadeUp 0.5s ease' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 500 }}>{product.category}</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', fontWeight: 300, lineHeight: 1.2, marginBottom: 16 }}>{product.name}</h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <Stars rating={product.rating || 0} />
              <span style={{ fontSize: 13, color: 'var(--ink-muted)' }}>{product.review_count || 0} reviews</span>
            </div>

            <div style={{ fontFamily: 'var(--font-mono)', fontSize: 32, fontWeight: 500, marginBottom: 24, color: 'var(--ink)' }}>
              ${parseFloat(product.price).toFixed(2)}
            </div>

            <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--ink-soft)', marginBottom: 32, maxWidth: 480 }}>{product.description}</p>

            {/* Stock */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: product.stock > 0 ? 'var(--green)' : 'var(--red)', display: 'inline-block' }} />
              <span style={{ fontSize: 13, color: product.stock > 0 ? 'var(--green)' : 'var(--red)', fontWeight: 500 }}>
                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
              </span>
            </div>

            {/* Quantity */}
            <div style={{ marginBottom: 24 }}>
              <div className="label" style={{ marginBottom: 8 }}>Quantity</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0, border: '1px solid var(--paper-mid)', borderRadius: 2, display: 'inline-flex' }}>
                <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink)' }}>−</button>
                <span style={{ width: 48, textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: 15 }}>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))} style={{ width: 40, height: 40, background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--ink)' }}>+</button>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
              <button onClick={handleAdd} disabled={adding || product.stock === 0} className="btn btn-primary btn-lg" style={{ flex: 1, minWidth: 160, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
                {adding ? 'Adding…' : 'Add to Cart'}
              </button>
              <Link to="/cart" className="btn btn-outline btn-lg" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>View Cart</Link>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap', paddingTop: 24, borderTop: '1px solid var(--paper-mid)' }}>
              {['🚚 Free shipping over $100', '🔄 30-day returns', '🔒 Secure payment'].map(item => (
                <span key={item} style={{ fontSize: 12, color: 'var(--ink-muted)' }}>{item}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ marginTop: 64 }}>
          <div style={{ display: 'flex', gap: 0, borderBottom: '1px solid var(--paper-mid)', marginBottom: 32 }}>
            {['description', 'specifications', 'reviews'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px', background: 'none', border: 'none',
                  borderBottom: activeTab === tab ? '2px solid var(--ink)' : '2px solid transparent',
                  cursor: 'pointer', fontSize: 12, letterSpacing: '0.08em', textTransform: 'uppercase',
                  fontWeight: activeTab === tab ? 600 : 400,
                  color: activeTab === tab ? 'var(--ink)' : 'var(--ink-muted)',
                  marginBottom: -1, transition: 'all 0.2s',
                }}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'description' && (
            <div style={{ maxWidth: 720, fontSize: 14, lineHeight: 1.9, color: 'var(--ink-soft)' }}>
              <p>{product.description}</p>
              <p style={{ marginTop: 16 }}>This premium product has been carefully crafted with attention to detail and quality. Suitable for everyday use and built to last.</p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div style={{ maxWidth: 480 }}>
              {[['Category', product.category], ['Stock', product.stock], ['Rating', `${product.rating} / 5`], ['SKU', `LX-${product.id.toString().padStart(4,'0')}`]].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', padding: '12px 0', borderBottom: '1px solid var(--paper-mid)' }}>
                  <span style={{ width: 160, fontSize: 12, fontWeight: 600, letterSpacing: '0.04em', color: 'var(--ink-muted)', textTransform: 'uppercase' }}>{k}</span>
                  <span style={{ fontSize: 14 }}>{v}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ textAlign: 'center', padding: '40px', color: 'var(--ink-muted)', fontSize: 14 }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>⭐</div>
                <p>No reviews yet. Be the first to review this product.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
