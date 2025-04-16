import React, { useState } from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

interface LoginFormData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginFormData) => {
    setLoading(true);
    try {
      // Tìm user theo email
      const response = await axios.get(`${API_ENDPOINTS.users}?email=${encodeURIComponent(values.email)}`);
      const users = response.data;

      if (users.length === 0) {
        message.error('Email hoặc mật khẩu không đúng');
        return;
      }

      const user = users[0];

      // So sánh mật khẩu
      if (user.password !== values.password) {
        message.error('Email hoặc mật khẩu không đúng');
        return;
      }

      // Lưu thông tin user vào localStorage (không lưu mật khẩu)
      const userInfo = {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      };
      localStorage.setItem('user', JSON.stringify(userInfo));

      message.success('Đăng nhập thành công!');
      
      // Chuyển hướng dựa vào role
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      message.error('Có lỗi xảy ra khi đăng nhập');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Đăng nhập</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
              đăng ký tài khoản mới
            </Link>
          </p>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                type: 'email',
                message: 'Email không hợp lệ!',
              },
              {
                required: true,
                message: 'Vui lòng nhập email!',
              },
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full" 
              size="large"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Login; 