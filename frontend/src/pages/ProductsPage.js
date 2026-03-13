import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getProducts, getCategories } from '../services/api';
import ProductCard from '../components/ProductCard';

const ProductsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const category = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const sort = searchParams.get('sort') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const LIMIT = 12;

  useEffect(() => {
    getCategories().then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts({ category, search, sort, page, limit: LIMIT })
      .then(r => { setProducts(r.data.products); setTotal(r.data.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const setParam = (key, val) => {
    const params = Object.fromEntries(searchParams);
    if (val) params[key] = val; else delete params[key];
    if (key !== 'page') delete params.page;
    setSearchParams(params);
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div style={{ marginTop: 64, minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ background: 'var(--ink)', padding: '48px 0 32px' }}>
        <div className="container">
          <div style={{ fontSize: 11, letterSpacing: '0.2em', color: 'var(--accent)', marginBottom: 8, textTransform: 'uppercase' }}>Discover</div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 300, color: 'white' }}>
            {category || search ? (category || `"${search}"`) : 'All Products'}
          </h1>
          {!loading && <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>{total} items found</p>}
        </div>
      </div>

      <div className="container" style={{ padding: '32px 24px' }}>
        <div style={{ display: 'flex', gap: 32, alignItems: 'flex-start' }}>
          {/* Sidebar filters */}
          <aside style={{ width: 220, flexShrink: 0, position: 'sticky', top: 88 }}>
            <div style={{ marginBottom: 32 }}>
              <div className="label" style={{ marginBottom: 12 }}>Category</div>
              {['', ...categories].map(cat => (
                <button key={cat || 'all'} onClick={() => setParam('category', cat)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', marginBottom: 2,
                    background: category === cat ? 'var(--ink)' : 'transparent',
                    color: category === cat ? 'white' : 'var(--ink-muted)',
                    border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 13,
                    transition: 'all 0.15s',
                  }}>
                  {cat || 'All Categories'}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: 32 }}>
              <div className="label" style={{ marginBottom: 12 }}>Sort By</div>
              {[['', 'Newest'], ['price_asc', 'Price: Low to High'], ['price_desc', 'Price: High to Low'], ['rating', 'Top Rated']].map(([val, label]) => (
                <button key={val} onClick={() => setParam('sort', val)}
                  style={{
                    display: 'block', width: '100%', textAlign: 'left',
                    padding: '8px 12px', marginBottom: 2,
                    background: sort === val ? 'var(--ink)' : 'transparent',
                    color: sort === val ? 'white' : 'var(--ink-muted)',
                    border: 'none', borderRadius: 2, cursor: 'pointer', fontSize: 13,
                    transition: 'all 0.15s',
                  }}>
                  {label}
                </button>
              ))}
            </div>

            {(category || search || sort) && (
              <button onClick={() => setSearchParams({})} className="btn btn-outline btn-sm" style={{ width: '100%', fontSize: 11, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Clear Filters
              </button>
            )}
          </aside>

          {/* Products grid */}
          <div style={{ flex: 1 }}>
            {loading ? (
              <div className="product-grid">
                {Array(LIMIT).fill(0).map((_, i) => (
                  <div key={i} className="skeleton" style={{ height: 320, borderRadius: 4 }} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '80px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: 24, fontWeight: 400, marginBottom: 8 }}>No products found</h3>
                <p style={{ color: 'var(--ink-muted)' }}>Try adjusting your filters or search terms.</p>
              </div>
            ) : (
              <>
                <div className="product-grid">
                  {products.map((p, i) => (
                    <div key={p.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.04}s backwards` }}>
                      <ProductCard product={p} />
                    </div>
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 48 }}>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => setParam('page', p)}
                        style={{
                          width: 36, height: 36,
                          background: page === p ? 'var(--ink)' : 'white',
                          color: page === p ? 'white' : 'var(--ink)',
                          border: '1px solid var(--paper-mid)', borderRadius: 2,
                          cursor: 'pointer', fontSize: 13, fontWeight: page === p ? 600 : 400,
                          transition: 'all 0.15s',
                        }}>{p}</button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
