import { Layout, Menu } from 'antd';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
  ShoppingOutlined,
  UserOutlined,
  OrderedListOutlined,
  AppstoreOutlined
} from '@ant-design/icons';

const { Header, Content, Sider } = Layout;

const items = [
  {
    key: '/admin/products',
    icon: <ShoppingOutlined />,
    label: <Link to="/admin/products">Quản lý sản phẩm</Link>,
  },
  {
    key: '/admin/categories',
    icon: <AppstoreOutlined />,
    label: <Link to="/admin/categories">Quản lý danh mục</Link>,
  },
  {
    key: '/admin/orders',
    icon: <OrderedListOutlined />,
    label: <Link to="/admin/orders">Quản lý đơn hàng</Link>,
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: <Link to="/admin/users">Quản lý người dùng</Link>,
  },
];

const AdminLayout = () => {
  const location = useLocation();
  
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header style={{ padding: 0, background: '#fff' }}>
        <div className="logo" />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0 }}
            items={items}
          />
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
              background: '#fff',
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;