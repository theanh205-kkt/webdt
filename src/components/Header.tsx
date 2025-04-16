import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout, Menu, Button, Badge, Dropdown, message } from 'antd';
import { ShoppingCartOutlined, HistoryOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header: AntHeader } = Layout;

interface User {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

const Header: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      setUser(JSON.parse(userStr));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    message.success('Đăng xuất thành công');
    navigate('/');
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: '1',
      label: 'Đơn hàng của tôi',
      icon: <HistoryOutlined />,
      onClick: () => navigate('/order-history')
    },
    {
      key: '2',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: handleLogout
    },
  ];

  if (user?.role === 'admin') {
    userMenuItems.unshift({
      key: '0',
      label: 'Quản trị',
      onClick: () => navigate('/admin')
    });
  }

  return (
    <AntHeader style={{ background: '#fff', padding: '0 50px', borderBottom: '1px solid #f0f0f0' }}>
      <div className="flex justify-between items-center h-full">
        <div className="flex items-center">
          <Link to="/" className="text-2xl font-bold mr-8">Shop Online</Link>
          <Menu mode="horizontal" className="border-0">
            <Menu.Item key="home">
              <Link to="/">Trang chủ</Link>
            </Menu.Item>
            <Menu.Item key="products">
              <Link to="/products">Sản phẩm</Link>
            </Menu.Item>
          </Menu>
        </div>
        
        <div className="flex items-center gap-4">
          {user && (
            <Link to="/order-history" className="flex items-center">
              <Button type="text" icon={<HistoryOutlined />}>
                Đơn hàng của tôi
              </Button>
            </Link>
          )}
          
          <Link to="/cart" className="flex items-center">
            <Badge>
              <Button type="text" icon={<ShoppingCartOutlined />}>
                Giỏ hàng
              </Button>
            </Badge>
          </Link>

          {user ? (
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Button type="text" icon={<UserOutlined />}>
                {user.fullName || user.email}
              </Button>
            </Dropdown>
          ) : (
            <Link to="/login">
              <Button type="text" icon={<UserOutlined />}>
                Đăng nhập
              </Button>
            </Link>
          )}
        </div>
      </div>
    </AntHeader>
  );
};

export default Header; 