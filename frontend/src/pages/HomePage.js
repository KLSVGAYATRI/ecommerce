import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getFeatured, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const HERO_ITEMS = [
  { title: 'Timeless Elegance', sub: 'New Collection 2025', img: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1400', cta: 'Explore Now' },
  { title: 'Crafted to Last', sub: 'Premium Materials', img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1400', cta: 'Shop Collection' },
  { title: 'Modern Living', sub: 'Curated for You', img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=1400', cta: 'Discover More' },
];

const CATEGORY_COLORS = { Electronics: '#1a3a5c', Accessories: '#5c3a1a', Footwear: '#1a5c3a', Bags: '#5c1a3a', Home: '#3a1a5c', Sports: '#1a5c5c' };

const HomePage = () => {
  const [featured, setFeatured] = useState([]);
  const [categories, setCategories] = useState([]);
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getFeatured().then(r => setFeatured(r.data)).catch(() => {});
    getCategories().then(r => setCategories(r.data)).catch(() => {});

    const interval = setInterval(() => setHeroIdx(i => (i + 1) % HERO_ITEMS.length), 5000);
    return () => clearInterval(interval);
  }, []);

  const hero = HERO_ITEMS[heroIdx];

  return (
    <div>
      {/* Hero */}
      <section style={{ position: 'relative', height: '92vh', minHeight: 600, overflow: 'hidden', marginTop: 64 }}>
        {HERO_ITEMS.map((item, i) => (
          <div key={i} style={{
            position: 'absolute', inset: 0,
            opacity: i === heroIdx ? 1 : 0,
            transition: 'opacity 1s ease',
          }}>
            <img src={item.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.72) 40%, rgba(10,10,10,0.2) 100%)' }} />
          </div>
        ))}

        <div className="container" style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', zIndex: 2 }}>
          <div key={heroIdx} style={{ animation: 'fadeUp 0.8s ease' }}>
            <div style={{ fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16, fontWeight: 500 }}>{hero.sub}</div>
            <h1 style={{
              fontFamily: 'var(--font-serif)', fontSize: 'clamp(3rem, 7vw, 6rem)',
              fontWeight: 300, color: 'white', lineHeight: 1.1, marginBottom: 32, maxWidth: 600,
            }}>{hero.title}</h1>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-accent btn-lg" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>{hero.cta}</Link>
              <Link to="/products" className="btn btn-outline btn-lg" style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white', letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>View All</Link>
            </div>
          </div>

          {/* Hero dots */}
          <div style={{ position: 'absolute', bottom: 40, left: 24, display: 'flex', gap: 8 }}>
            {HERO_ITEMS.map((_, i) => (
              <button key={i} onClick={() => setHeroIdx(i)} style={{
                width: i === heroIdx ? 32 : 8, height: 8, borderRadius: 4,
                background: i === heroIdx ? 'var(--accent)' : 'rgba(255,255,255,0.4)',
                border: 'none', cursor: 'pointer', transition: 'all 0.3s',
              }} />
            ))}
          </div>
        </div>

        {/* Search overlay */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3, padding: '0 0 0 0' }}>
          <div style={{ background: 'rgba(250,250,248,0.95)', backdropFilter: 'blur(12px)', padding: '20px 0' }}>
            <div className="container">
              <form onSubmit={e => { e.preventDefault(); navigate(`/products?search=${search}`); }} style={{ display: 'flex', gap: 12, maxWidth: 680 }}>
                <input className="input" value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search for products, brands…"
                  style={{ flex: 1, height: 48, fontSize: 14 }}
                />
                <button type="submit" className="btn btn-primary" style={{ height: 48, minWidth: 120, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>Search</button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section style={{ background: 'var(--ink)', padding: '20px 0' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 6vw, 80px)', flexWrap: 'wrap' }}>
            {[['10K+', 'Products'], ['50K+', 'Customers'], ['99%', 'Satisfaction'], ['Free', 'Returns']].map(([num, label]) => (
              <div key={label} style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 500, color: 'var(--accent)' }}>{num}</div>
                <div style={{ fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#777', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section">
          <div className="container">
            <div style={{ marginBottom: 40 }}>
              <div className="section-subtitle">Browse by</div>
              <h2 className="section-title">Categories</h2>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16 }}>
              {categories.map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} style={{
                  background: CATEGORY_COLORS[cat] || 'var(--ink-soft)',
                  color: 'white', padding: '32px 24px', borderRadius: 4,
                  display: 'flex', flexDirection: 'column', gap: 8,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = 'var(--shadow-lg)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  <span style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 300 }}>{cat}</span>
                  <span style={{ fontSize: 10, letterSpacing: '0.1em', opacity: 0.7, textTransform: 'uppercase' }}>Shop →</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="section" style={{ background: 'var(--paper-warm)' }}>
          <div className="container">
            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 40, flexWrap: 'wrap', gap: 16 }}>
              <div>
                <div className="section-subtitle">Handpicked for you</div>
                <h2 className="section-title">Featured Products</h2>
              </div>
              <Link to="/products" className="btn btn-outline btn-sm" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11 }}>View All →</Link>
            </div>
            <div className="product-grid">
              {featured.map((p, i) => (
                <div key={p.id} style={{ animation: `fadeUp 0.5s ease ${i * 0.07}s backwards` }}>
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Value props */}
      <section className="section">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 32 }}>
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders over $100. Express options available.' },
              { icon: '🔄', title: 'Easy Returns', desc: '30-day hassle-free return policy.' },
              { icon: '🔒', title: 'Secure Payment', desc: 'Your payment data is always protected.' },
              { icon: '💎', title: 'Premium Quality', desc: 'Carefully curated products you can trust.' },
            ].map(item => (
              <div key={item.title} style={{ textAlign: 'center', padding: '32px 24px' }}>
                <div style={{ fontSize: 36, marginBottom: 16 }}>{item.icon}</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 20, fontWeight: 400, marginBottom: 8 }}>{item.title}</h3>
                <p style={{ fontSize: 13, color: 'var(--ink-muted)', lineHeight: 1.6 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ background: 'var(--ink)', padding: '80px 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 16 }}>Limited Time</div>
          <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 4rem)', fontWeight: 300, color: 'white', marginBottom: 16 }}>Up to 40% Off Select Items</h2>
          <p style={{ color: '#888', fontSize: 14, marginBottom: 32 }}>Shop the season's best deals before they're gone.</p>
          <Link to="/products" className="btn btn-accent btn-lg" style={{ letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>Shop the Sale</Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
