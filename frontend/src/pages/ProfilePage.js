import React, { useState } from 'react';
import { useAuth } from '../context/AppContext';
import { updateProfile } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { user, setUser, logout } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '', address: user?.address || '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfile(form);
      setUser(res.data);
      toast.success('Profile updated!');
    } catch { toast.error('Failed to update'); } finally { setSaving(false); }
  };

  if (!user) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}>Please <Link to="/login">sign in</Link>.</div>;

  return (
    <div style={{ marginTop: 64, minHeight: '80vh' }}>
      <div style={{ background: 'var(--ink)', padding: '40px 0 32px' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 300, fontFamily: 'var(--font-serif)' }}>
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 4, textTransform: 'uppercase' }}>{user.role}</div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(1.6rem, 4vw, 2.5rem)', fontWeight: 300, color: 'white' }}>{user.name}</h1>
            <div style={{ color: '#888', fontSize: 13 }}>{user.email}</div>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '40px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 32 }}>
          <div className="card" style={{ padding: 28 }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Edit Profile</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label className="label">Full Name</label>
                <input className="input" value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div>
                <label className="label">Phone</label>
                <input className="input" value={form.phone} onChange={e => setForm(f => ({...f, phone: e.target.value}))} placeholder="+1 (555) 000-0000" />
              </div>
              <div>
                <label className="label">Address</label>
                <textarea className="input" rows={3} value={form.address} onChange={e => setForm(f => ({...f, address: e.target.value}))} placeholder="Your delivery address" style={{ resize: 'vertical' }} />
              </div>
              <button type="submit" disabled={saving} className="btn btn-primary" style={{ marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
                {saving ? 'Saving…' : 'Save Changes'}
              </button>
            </form>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 20 }}>Account Info</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[['Email', user.email], ['Role', user.role], ['Member since', new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })]].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--paper-mid)', fontSize: 13 }}>
                    <span style={{ color: 'var(--ink-muted)', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{k}</span>
                    <span style={{ fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card" style={{ padding: 28 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 20 }}>Quick Links</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <Link to="/orders" className="btn btn-outline" style={{ justifyContent: 'flex-start', fontSize: 13 }}>📦 My Orders</Link>
                <Link to="/cart" className="btn btn-outline" style={{ justifyContent: 'flex-start', fontSize: 13 }}>🛒 Shopping Cart</Link>
                <Link to="/products" className="btn btn-outline" style={{ justifyContent: 'flex-start', fontSize: 13 }}>🏷 Browse Products</Link>
                <button onClick={logout} className="btn btn-danger btn-sm" style={{ marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 11 }}>Sign Out</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
