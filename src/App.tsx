import "./App.css";
import { Navigate, Route, Routes, Outlet } from "react-router-dom";
import { Layout } from 'antd';
import HomePage from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import AdminLayout from './layouts/AdminLayout';
import OrderHistory from './pages/OrderHistory';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import ProductManagement from './pages/admin/ProductManagement';
import UserManagement from './pages/admin/UserManagement';
import OrderManagement from './pages/admin/OrderManagement';
import CategoryManagement from './pages/admin/CategoryManagement';

const { Content } = Layout;

// Bảo vệ route yêu cầu đăng nhập
const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;

  if (!isLoggedIn) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

// Bảo vệ route admin
const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <Routes>
      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="/admin/products" replace />} />
        <Route path="products" element={<ProductManagement />} />
        <Route path="orders" element={<OrderManagement />} />
        <Route path="users" element={<UserManagement />} />
        <Route path="categories" element={<CategoryManagement />} />
      </Route>

      {/* Public routes */}
      <Route
        path="/"
        element={
          <Layout>
            <Header />
            <Content>
              <div className="container mx-auto px-4 py-8">
                <Outlet />
              </div>
            </Content>
          </Layout>
        }
      >
        <Route index element={<HomePage />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="cart" element={<Cart />} />
        <Route path="product/:id" element={<ProductDetail />} />
        <Route
          path="order-history"
          element={
            <PrivateRoute>
              <OrderHistory />
            </PrivateRoute>
          }
        />
      </Route>

      {/* 404 route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
