import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin, register as apiRegister } from '../services/api';
import { useAuth } from '../context/AppContext';
import toast from 'react-hot-toast';

const AuthForm = ({ type }) => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fn = type === 'login' ? apiLogin : apiRegister;
      const res = await fn(form);
      login(res.data.token, res.data.user);
      toast.success(type === 'login' ? 'Welcome back!' : 'Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally { setLoading(false); }
  };

  return (
    <div style={{ marginTop: 64, minHeight: '90vh', display: 'flex', alignItems: 'stretch' }}>
      {/* Left decorative panel */}
      <div style={{ flex: 1, background: 'var(--ink)', position: 'relative', overflow: 'hidden', display: 'none' }} className="auth-panel">
        <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 60 }}>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: 48, fontWeight: 300, color: 'white', lineHeight: 1.2, marginBottom: 24 }}>
            Curated for the<br /><em>discerning</em> few.
          </div>
          <p style={{ color: '#888', fontSize: 14, lineHeight: 1.8, maxWidth: 360 }}>
            Join thousands of customers who trust LUXE for premium products delivered with care.
          </p>
        </div>
      </div>

      {/* Form panel */}
      <div style={{ width: '100%', maxWidth: 480, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 24px' }}>
        <div style={{ width: '100%', animation: 'fadeUp 0.5s ease' }}>
          <Link to="/" style={{ fontFamily: 'var(--font-serif)', fontSize: 28, fontWeight: 300, letterSpacing: '0.12em', display: 'block', marginBottom: 48 }}>LUXE</Link>

          <div style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: 8, fontWeight: 500 }}>
            {type === 'login' ? 'Welcome back' : 'New Account'}
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, fontWeight: 300, marginBottom: 36 }}>
            {type === 'login' ? 'Sign In' : 'Create Account'}
          </h1>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {type === 'register' && (
              <div>
                <label className="label">Full Name</label>
                <input className="input" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Your full name" />
              </div>
            )}
            <div>
              <label className="label">Email Address</label>
              <input className="input" type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@example.com" />
            </div>
            <div>
              <label className="label" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Password</span>
                {type === 'login' && <span style={{ color: 'var(--accent)', cursor: 'pointer', textTransform: 'none', letterSpacing: 0, fontSize: 12 }}>Forgot?</span>}
              </label>
              <input className="input" type="password" required value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" minLength={6} />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary btn-lg" style={{ marginTop: 8, letterSpacing: '0.06em', textTransform: 'uppercase', fontSize: 12 }}>
              {loading ? 'Please wait…' : (type === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 32, paddingTop: 32, borderTop: '1px solid var(--paper-mid)', fontSize: 13, color: 'var(--ink-muted)' }}>
            {type === 'login' ? (
              <span>Don't have an account? <Link to="/register" style={{ color: 'var(--ink)', fontWeight: 600 }}>Join LUXE</Link></span>
            ) : (
              <span>Already a member? <Link to="/login" style={{ color: 'var(--ink)', fontWeight: 600 }}>Sign In</Link></span>
            )}
          </div>
        </div>
      </div>

      <style>{`@media(min-width:768px){.auth-panel{display:block!important}}`}</style>
    </div>
  );
};

export const LoginPage = () => <AuthForm type="login" />;
export const RegisterPage = () => <AuthForm type="register" />;
