import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';

const Stars = ({ rating }) => {
  const full = Math.floor(rating);
  return (
    <div className="stars" style={{ fontSize: 12 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= full ? 'var(--accent)' : 'var(--paper-mid)' }}>★</span>
      ))}
    </div>
  );
};

const ProductCard = ({ product, style }) => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [hovered, setHovered] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!user) { window.location.href = '/login'; return; }
    setAdding(true);
    await addToCart(product.id);
    setAdding(false);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'white',
        border: '1px solid var(--paper-mid)',
        borderRadius: 4,
        overflow: 'hidden',
        transition: 'box-shadow 0.3s, transform 0.3s',
        boxShadow: hovered ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
        transform: hovered ? 'translateY(-4px)' : 'none',
        ...style,
      }}
    >
      <Link to={`/products/${product.id}`}>
        <div style={{ position: 'relative', overflow: 'hidden', aspectRatio: '4/3' }}>
          <img
            src={product.image_url || 'https://via.placeholder.com/400x300?text=Product'}
            alt={product.name}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              transition: 'transform 0.5s ease',
              transform: hovered ? 'scale(1.06)' : 'scale(1)',
            }}
          />
          {product.is_featured && (
            <span style={{
              position: 'absolute', top: 12, left: 12,
              background: 'var(--accent)', color: 'white',
              fontSize: 9, fontWeight: 600, letterSpacing: '0.1em',
              textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2,
            }}>Featured</span>
          )}
          {product.stock === 0 && (
            <div style={{
              position: 'absolute', inset: 0, background: 'rgba(250,250,248,0.8)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontSize: 12, letterSpacing: '0.1em', fontWeight: 600, textTransform: 'uppercase', color: 'var(--ink-muted)' }}>Out of Stock</span>
            </div>
          )}
        </div>
      </Link>

      <div style={{ padding: 16 }}>
        <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 4 }}>{product.category}</div>
        <Link to={`/products/${product.id}`}>
          <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 17, fontWeight: 400, marginBottom: 6, lineHeight: 1.3, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = 'var(--accent)'}
            onMouseLeave={e => e.target.style.color = 'var(--ink)'}
          >{product.name}</h3>
        </Link>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
          <Stars rating={product.rating || 0} />
          <span style={{ fontSize: 11, color: 'var(--ink-muted)' }}>({product.review_count || 0})</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="price" style={{ fontSize: 16 }}>${parseFloat(product.price).toFixed(2)}</span>
          <button
            onClick={handleAdd}
            disabled={adding || product.stock === 0}
            style={{
              padding: '7px 14px', background: adding ? 'var(--paper-mid)' : 'var(--ink)',
              color: 'white', border: 'none', borderRadius: 2,
              fontSize: 11, letterSpacing: '0.06em', fontWeight: 500, textTransform: 'uppercase',
              cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
              transition: 'background 0.2s',
            }}
          >
            {adding ? '…' : '+ Cart'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
