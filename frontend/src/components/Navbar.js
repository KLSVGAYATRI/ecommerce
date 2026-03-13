import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth, useCart } from '../context/AppContext';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const { count } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: scrolled ? 'rgba(250,250,248,0.96)' : 'rgba(250,250,248,0.8)',
        backdropFilter: 'blur(12px)',
        borderBottom: scrolled ? '1px solid var(--paper-mid)' : '1px solid transparent',
        transition: 'all 0.3s ease',
        height: 64,
      }}>
        <div className="container" style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span style={{ fontFamily: 'var(--font-serif)', fontSize: 26, fontWeight: 300, letterSpacing: '0.12em', color: 'var(--ink)' }}>LUXE</span>
            <span style={{ fontSize: 8, letterSpacing: '0.3em', color: 'var(--accent)', fontWeight: 500, textTransform: 'uppercase' }}>Collection</span>
          </Link>

          {/* Center nav */}
          <div style={{ display: 'flex', gap: 32, alignItems: 'center' }} className="nav-links">
            {['Products', 'Categories'].map(item => (
              <Link key={item} to={`/${item.toLowerCase()}`} style={{
                fontSize: 12, letterSpacing: '0.08em', fontWeight: 500, textTransform: 'uppercase',
                color: 'var(--ink-muted)', transition: 'color 0.2s',
                borderBottom: location.pathname.includes(item.toLowerCase()) ? '1px solid var(--accent)' : '1px solid transparent',
                paddingBottom: 2,
              }}
              onMouseEnter={e => e.target.style.color = 'var(--ink)'}
              onMouseLeave={e => e.target.style.color = 'var(--ink-muted)'}
              >{item}</Link>
            ))}
            {isAdmin && (
              <Link to="/admin" style={{ fontSize: 12, letterSpacing: '0.08em', fontWeight: 500, textTransform: 'uppercase', color: 'var(--accent)' }}>Admin</Link>
            )}
          </div>

          {/* Right icons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button onClick={() => setSearchOpen(!searchOpen)} className="btn-ghost" style={{ padding: '6px', borderRadius: '50%', border: 'none', background: 'none', fontSize: 18 }}>🔍</button>

            {user ? (
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8 }}>
                <Link to="/orders" style={{ fontSize: 12, letterSpacing: '0.06em', color: 'var(--ink-muted)', fontWeight: 500 }} className="hide-mobile">Orders</Link>
                <Link to="/profile" style={{ width: 32, height: 32, borderRadius: '50%', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 600 }}>
                  {user.name?.charAt(0).toUpperCase()}
                </Link>
                <button onClick={logout} className="hide-mobile" style={{ fontSize: 11, letterSpacing: '0.06em', color: 'var(--ink-muted)', background: 'none', border: 'none', cursor: 'pointer', textTransform: 'uppercase' }}>Out</button>
              </div>
            ) : (
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <Link to="/login" style={{ fontSize: 12, letterSpacing: '0.06em', fontWeight: 500, color: 'var(--ink-muted)', textTransform: 'uppercase' }} className="hide-mobile">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm hide-mobile" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Join</Link>
              </div>
            )}

            <Link to="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <span style={{ fontSize: 20 }}>🛍</span>
              {count > 0 && (
                <span style={{
                  position: 'absolute', top: -6, right: -8,
                  width: 18, height: 18, borderRadius: '50%',
                  background: 'var(--accent)', color: 'white',
                  fontSize: 10, fontWeight: 700,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{count}</span>
              )}
            </Link>

            <button onClick={() => setMenuOpen(!menuOpen)} className="show-mobile" style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>☰</button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div style={{ background: 'white', borderTop: '1px solid var(--paper-mid)', padding: '12px 24px' }}>
            <form onSubmit={handleSearch} style={{ maxWidth: 600, margin: '0 auto', display: 'flex', gap: 8 }}>
              <input className="input" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search products…" autoFocus style={{ flex: 1 }} />
              <button type="submit" className="btn btn-primary btn-sm">Search</button>
            </form>
          </div>
        )}
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{ position: 'fixed', top: 64, left: 0, right: 0, bottom: 0, background: 'white', zIndex: 999, padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Link to="/products" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>Products</Link>
          <Link to="/categories" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>Categories</Link>
          {user ? (
            <>
              <Link to="/orders" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>My Orders</Link>
              <Link to="/profile" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>Profile</Link>
              {isAdmin && <Link to="/admin" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300, color: 'var(--accent)' }}>Admin</Link>}
              <button onClick={logout} style={{ fontSize: 16, background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', color: 'var(--red)' }}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>Sign In</Link>
              <Link to="/register" style={{ fontSize: 24, fontFamily: 'var(--font-serif)', fontWeight: 300 }}>Register</Link>
            </>
          )}
        </div>
      )}

      <style>{`
        @media(max-width:768px){ .nav-links{display:none!important} .hide-mobile{display:none!important} }
        @media(min-width:769px){ .show-mobile{display:none!important} }
      `}</style>
    </>
  );
};

export default Navbar;
