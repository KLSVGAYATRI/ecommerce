import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getDashboard, getAllOrders, updateOrderStatus, getUsers, createProduct, deleteProduct } from '../services/api';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AppContext';

const StatCard = ({ label, value, icon, color }) => (
  <div style={{ background: 'white', border: '1px solid var(--paper-mid)', borderRadius: 4, padding: 24, position: 'relative', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: 0, left: 0, width: 4, height: '100%', background: color }} />
    <div style={{ paddingLeft: 8 }}>
      <div style={{ fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink-muted)', marginBottom: 8 }}>{label}</div>
      <div style={{ fontFamily: 'var(--font-mono)', fontSize: 28, fontWeight: 600, marginBottom: 4 }}>{value}</div>
      <div style={{ fontSize: 24 }}>{icon}</div>
    </div>
  </div>
);

const AdminDashboard = () => {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });

  useEffect(() => {
    if (!isAdmin) return;
    Promise.all([getDashboard(), getAllOrders(), getUsers()])
      .then(([d, o, u]) => { setData(d.data); setOrders(o.data); setUsers(u.data); })
      .finally(() => setLoading(false));
  }, [isAdmin]);

  if (!isAdmin) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}>Access denied.</div>;
  if (loading) return <div style={{ marginTop: 64, textAlign: 'center', padding: 80 }}><div className="spinner" /></div>;

  const TABS = ['overview', 'orders', 'products', 'users'];

  const handleStatusUpdate = async (id, status) => {
    try {
      await updateOrderStatus(id, status);
      setOrders(o => o.map(ord => ord.id === id ? { ...ord, status } : ord));
      toast.success('Status updated');
    } catch { toast.error('Failed'); }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await createProduct({ ...newProduct, price: parseFloat(newProduct.price), stock: parseInt(newProduct.stock) });
      toast.success('Product added!');
      setShowAddProduct(false);
      setNewProduct({ name: '', description: '', price: '', category: '', stock: '', image_url: '' });
    } catch { toast.error('Failed to add product'); }
  };

  return (
    <div style={{ marginTop: 64, minHeight: '100vh', background: 'var(--paper-warm)' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '40px 0 0' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Control Panel</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 300, color: 'white', marginBottom: 24 }}>Admin Dashboard</h1>
          <div style={{ display: 'flex', gap: 0 }}>
            {TABS.map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '10px 24px', background: 'none', border: 'none', cursor: 'pointer',
                color: tab === t ? 'white' : '#666', borderBottom: tab === t ? '2px solid var(--accent)' : '2px solid transparent',
                fontSize: 12, letterSpacing: '0.08em', textTransform: 'capitalize', fontWeight: tab === t ? 600 : 400,
                transition: 'all 0.2s',
              }}>{t}</button>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>

        {/* OVERVIEW */}
        {tab === 'overview' && data && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
              <StatCard label="Total Revenue" value={`$${data.stats.revenue.toLocaleString()}`} icon="💰" color="var(--accent)" />
              <StatCard label="Total Orders" value={data.stats.orders.toLocaleString()} icon="📦" color="#3a8c5c" />
              <StatCard label="Products" value={data.stats.products.toLocaleString()} icon="🏷" color="#1a3a5c" />
              <StatCard label="Customers" value={data.stats.users.toLocaleString()} icon="👥" color="#8c3a3a" />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 20 }}>
              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Sales Trend</h3>
                <ResponsiveContainer width="100%" height={220}>
                  <AreaChart data={data.salesByMonth}>
                    <defs>
                      <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#c8a96e" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#c8a96e" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0ede6" />
                    <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip formatter={v => [`$${parseFloat(v).toFixed(2)}`, 'Sales']} />
                    <Area type="monotone" dataKey="sales" stroke="#c8a96e" strokeWidth={2} fill="url(#colorSales)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="card" style={{ padding: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Top Products</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {data.topProducts.map((p, i) => (
                    <div key={i}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                        <span style={{ color: 'var(--ink-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</span>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 11, flexShrink: 0 }}>{p.sold} sold</span>
                      </div>
                      <div style={{ height: 4, background: 'var(--paper-mid)', borderRadius: 2 }}>
                        <div style={{ height: '100%', background: 'var(--accent)', borderRadius: 2, width: `${(p.sold / data.topProducts[0].sold) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Recent Orders</h3>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr>
                      {['Order', 'Customer', 'Amount', 'Status', 'Date'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', borderBottom: '1px solid var(--paper-mid)' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {data.recentOrders.map(o => (
                      <tr key={o.id} style={{ borderBottom: '1px solid var(--paper-warm)' }}>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{o.id.toString().padStart(4,'0')}</td>
                        <td style={{ padding: '10px 12px' }}>{o.user_name}</td>
                        <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>${parseFloat(o.total_amount).toFixed(2)}</td>
                        <td style={{ padding: '10px 12px' }}><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                        <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === 'orders' && (
          <div className="card" style={{ padding: 24, animation: 'fadeUp 0.4s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>All Orders ({orders.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['#', 'Customer', 'Amount', 'Status', 'Update Status', 'Date'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', borderBottom: '2px solid var(--ink)', whiteSpace: 'nowrap' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(o => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--paper-warm)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 12 }}>#{o.id.toString().padStart(4,'0')}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div>{o.user_name}</div>
                        <div style={{ fontSize: 11, color: 'var(--ink-muted)' }}>{o.user_email}</div>
                      </td>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)' }}>${parseFloat(o.total_amount).toFixed(2)}</td>
                      <td style={{ padding: '10px 12px' }}><span className={`badge badge-${o.status}`}>{o.status}</span></td>
                      <td style={{ padding: '10px 12px' }}>
                        <select value={o.status} onChange={e => handleStatusUpdate(o.id, e.target.value)}
                          style={{ padding: '4px 8px', border: '1px solid var(--paper-mid)', borderRadius: 2, fontSize: 12, cursor: 'pointer' }}>
                          {['pending','processing','shipped','delivered','cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)', whiteSpace: 'nowrap' }}>{new Date(o.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {tab === 'products' && (
          <div style={{ animation: 'fadeUp 0.4s ease' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400 }}>Products</h2>
              <button onClick={() => setShowAddProduct(!showAddProduct)} className="btn btn-primary btn-sm" style={{ fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>+ Add Product</button>
            </div>

            {showAddProduct && (
              <div className="card" style={{ padding: 24, marginBottom: 24 }}>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 18, fontWeight: 400, marginBottom: 20 }}>Add New Product</h3>
                <form onSubmit={handleAddProduct} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  {[['name','Name'], ['category','Category'], ['price','Price'], ['stock','Stock']].map(([k, l]) => (
                    <div key={k}>
                      <label className="label">{l}</label>
                      <input className="input" required value={newProduct[k]} onChange={e => setNewProduct(p => ({...p, [k]: e.target.value}))} />
                    </div>
                  ))}
                  <div style={{ gridColumn: '1/-1' }}>
                    <label className="label">Image URL</label>
                    <input className="input" value={newProduct.image_url} onChange={e => setNewProduct(p => ({...p, image_url: e.target.value}))} />
                  </div>
                  <div style={{ gridColumn: '1/-1' }}>
                    <label className="label">Description</label>
                    <textarea className="input" rows={3} value={newProduct.description} onChange={e => setNewProduct(p => ({...p, description: e.target.value}))} style={{ resize: 'vertical' }} />
                  </div>
                  <button type="submit" className="btn btn-primary">Add Product</button>
                  <button type="button" onClick={() => setShowAddProduct(false)} className="btn btn-outline">Cancel</button>
                </form>
              </div>
            )}
            <div style={{ fontSize: 13, color: 'var(--ink-muted)', padding: '20px', background: 'var(--paper-warm)', borderRadius: 4, textAlign: 'center' }}>
              Products are managed via the Products page. Navigate to <Link to="/products" style={{ color: 'var(--accent)' }}>Products</Link> to view all.
            </div>
          </div>
        )}

        {/* USERS */}
        {tab === 'users' && (
          <div className="card" style={{ padding: 24, animation: 'fadeUp 0.4s ease' }}>
            <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: 22, fontWeight: 400, marginBottom: 24 }}>Users ({users.length})</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                <thead>
                  <tr>
                    {['ID', 'Name', 'Email', 'Role', 'Joined'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--ink-muted)', borderBottom: '2px solid var(--ink)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} style={{ borderBottom: '1px solid var(--paper-warm)' }}>
                      <td style={{ padding: '10px 12px', fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--ink-muted)' }}>{u.id}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--ink)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 600 }}>{u.name?.charAt(0)}</div>
                          {u.name}
                        </div>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{u.email}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', padding: '2px 8px', borderRadius: 2, background: u.role === 'admin' ? 'var(--accent)' : 'var(--paper-mid)', color: u.role === 'admin' ? 'white' : 'var(--ink-muted)' }}>
                          {u.role}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', color: 'var(--ink-muted)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
