import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('AdminDashboard useEffect - user:', user);
    console.log('AdminDashboard useEffect - user role:', user?.role);
    console.log('AdminDashboard useEffect - authLoading:', authLoading);
    
    // Wait for auth to finish loading
    if (authLoading) {
      console.log('Auth still loading, waiting...');
      return;
    }
    
    // Temporarily remove strict checks for debugging
    if (!user) {
      console.log('No user found, redirecting to login');
      navigate('/login');
      return;
    }

    console.log('User found, fetching dashboard stats');
    fetchDashboardStats();
  }, [user, authLoading, navigate]);

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data. Please try again.');
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const data = await response.json();
      console.log('Users data:', data);
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
    }
  };

  const fetchProducts = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/product');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch products: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('Products data:', data);
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      setError(`Failed to load products: ${error.message}`);
    }
  };

  const fetchOrders = async () => {
    try {
      setError(null);
      const response = await fetch('http://localhost:5000/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      
      const data = await response.json();
      console.log('Orders data:', data);
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to load orders. Please try again.');
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError(null);
    
    if (tab === 'users') fetchUsers();
    if (tab === 'products') fetchProducts();
    if (tab === 'orders') fetchOrders();
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (response.ok) {
        fetchOrders(); // Refresh orders
      } else {
        throw new Error('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Failed to update order status. Please try again.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  if (loading) {
    return <div className="admin-loading">Loading Admin Dashboard...</div>;
  }

  if (error) {
    return (
      <div className="admin-dashboard">
        <div className="admin-error">
          <h3>⚠️ {error}</h3>
          <p>Please make sure you have admin privileges or contact support.</p>
          <button onClick={() => navigate('/')} className="view-btn">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>✨ Admin Dashboard</h1>
        <p>Welcome back, {user?.first_name || user?.email}!</p>
        <button onClick={handleLogout} className="view-btn" style={{ marginTop: '10px' }}>
          Logout
        </button>
      </div>

      <div className="admin-tabs">
        <button 
          className={activeTab === 'dashboard' ? 'active' : ''} 
          onClick={() => handleTabChange('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={activeTab === 'users' ? 'active' : ''} 
          onClick={() => handleTabChange('users')}
        >
          👥 Users
        </button>
        <button 
          className={activeTab === 'products' ? 'active' : ''} 
          onClick={() => handleTabChange('products')}
        >
          🛍️ Products
        </button>
        <button 
          className={activeTab === 'orders' ? 'active' : ''} 
          onClick={() => handleTabChange('orders')}
        >
          📦 Orders
        </button>
      </div>

      <div className="admin-content">
        {activeTab === 'dashboard' && (
          <div className="dashboard-stats">
            <div className="stat-card">
              <h3>👥 Total Users</h3>
              <p>{stats.totalUsers || 0}</p>
            </div>
            <div className="stat-card">
              <h3>🛍️ Total Products</h3>
              <p>{stats.totalProducts || 0}</p>
            </div>
            <div className="stat-card">
              <h3>📦 Total Orders</h3>
              <p>{stats.totalOrders || 0}</p>
            </div>
            <div className="stat-card">
              <h3>💰 Total Revenue</h3>
              <p>${stats.totalRevenue || 0}</p>
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="users-section">
            <h2>👥 Registered Users ({users.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No users found
                      </td>
                    </tr>
                  ) : (
                    users.map(user => (
                      <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.first_name} {user.last_name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: user.role === 'admin' ? '#ff2d6b' : '#ff8fab',
                            color: 'white'
                          }}>
                            {user.role}
                          </span>
                        </td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: user.is_active ? '#4ade80' : '#f87171',
                            color: 'white'
                          }}>
                            {user.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>{new Date(user.created_at).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="products-section">
            <h2>🛍️ All Products ({products.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Category</th>
                    <th>Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No products found
                      </td>
                    </tr>
                  ) : (
                    products.map(product => (
                      <tr key={product.id}>
                        <td>{product.id}</td>
                        <td>{product.name}</td>
                        <td>${product.price}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: product.stock > 10 ? '#4ade80' : product.stock > 0 ? '#fbbf24' : '#f87171',
                            color: 'white'
                          }}>
                            {product.stock}
                          </span>
                        </td>
                        <td>{product.category}</td>
                        <td>
                          <span style={{ 
                            padding: '4px 8px', 
                            borderRadius: '12px', 
                            fontSize: '0.8rem',
                            fontWeight: '600',
                            backgroundColor: product.rating >= 4 ? '#4ade80' : product.rating >= 3 ? '#fbbf24' : '#f87171',
                            color: 'white'
                          }}>
                            ⭐ {product.rating}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <h2>📦 All Orders ({orders.length})</h2>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Customer</th>
                    <th>Total</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>
                        No orders found
                      </td>
                    </tr>
                  ) : (
                    orders.map(order => (
                      <tr key={order.id}>
                        <td>{order.id}</td>
                        <td>{order.first_name} {order.last_name}</td>
                        <td>${order.total_amount}</td>
                        <td>
                          <select 
                            value={order.status} 
                            onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                          >
                            <option value="pending">⏳ Pending</option>
                            <option value="processing">⚙️ Processing</option>
                            <option value="shipped">🚚 Shipped</option>
                            <option value="delivered">✅ Delivered</option>
                            <option value="cancelled">❌ Cancelled</option>
                          </select>
                        </td>
                        <td>{new Date(order.created_at).toLocaleDateString()}</td>
                        <td>
                          <button className="view-btn">👁️ View</button>
                        </td>
                      </tr>
                    ))
                  )}
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