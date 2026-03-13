import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer style={{ background: 'var(--ink)', color: 'white', padding: '60px 0 32px' }}>
    <div className="container">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 48, marginBottom: 48 }}>
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', marginBottom: 8 }}>LUXE</div>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.7, maxWidth: 220 }}>
            Curated collections of premium products delivered to your door.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>Shop</div>
          {['Products', 'Categories', 'Featured', 'New Arrivals'].map(item => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to="/products" style={{ fontSize: 13, color: '#888', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#888'}
              >{item}</Link>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>Account</div>
          {[['My Orders', '/orders'], ['Profile', '/profile'], ['Wishlist', '/wishlist'], ['Cart', '/cart']].map(([item, path]) => (
            <div key={item} style={{ marginBottom: 8 }}>
              <Link to={path} style={{ fontSize: 13, color: '#888', transition: 'color 0.2s' }}
                onMouseEnter={e => e.target.style.color = 'white'}
                onMouseLeave={e => e.target.style.color = '#888'}
              >{item}</Link>
            </div>
          ))}
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontWeight: 600 }}>Contact</div>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.8 }}>
            support@luxe.com<br />
            +1 (800) 555-0100<br />
            Mon–Fri, 9am–6pm EST
          </p>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #222', paddingTop: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontSize: 12, color: '#555' }}>© 2025 LUXE Collection. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 24 }}>
          {['Privacy', 'Terms', 'Cookies'].map(item => (
            <span key={item} style={{ fontSize: 12, color: '#555', cursor: 'pointer' }}>{item}</span>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
