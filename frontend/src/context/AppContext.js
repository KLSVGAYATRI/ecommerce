import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, getCart as fetchCart, addToCart as apiAddToCart, updateCartItem, removeFromCart as apiRemove, clearCart as apiClear } from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);
const CartContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getMe().then(res => setUser(res.data)).catch(() => localStorage.removeItem('token')).finally(() => setLoading(false));
    } else setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, setUser, loading, login, logout, isAdmin: user?.role === 'admin' }}>{children}</AuthContext.Provider>;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const loadCart = useCallback(async () => {
    if (!user) { setCart([]); return; }
    try {
      setLoading(true);
      const res = await fetchCart();
      setCart(res.data);
    } catch {} finally { setLoading(false); }
  }, [user]);

  useEffect(() => { loadCart(); }, [loadCart]);

  const addToCart = async (product_id, quantity = 1) => {
    try {
      await apiAddToCart({ product_id, quantity });
      await loadCart();
      toast.success('Added to cart');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add');
    }
  };

  const updateItem = async (productId, quantity) => {
    try {
      await updateCartItem(productId, { quantity });
      await loadCart();
    } catch {}
  };

  const removeItem = async (productId) => {
    try {
      await apiRemove(productId);
      await loadCart();
      toast.success('Removed from cart');
    } catch {}
  };

  const clearCartItems = async () => {
    try {
      await apiClear();
      setCart([]);
    } catch {}
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateItem, removeItem, clearCartItems, total, count, loadCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export const useCart = () => useContext(CartContext);
