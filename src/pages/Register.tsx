import React from 'react';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined, PhoneOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface RegisterFormData {
  username: string;
  password: string;
  email: string;
  phone: string;
  fullName: string;
}

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterFormData) => {
    try {
      // Kiểm tra email đã tồn tại chưa
      const emailCheck = await axios.get(`http://localhost:3000/users?email=${values.email}`);
      if (emailCheck.data.length > 0) {
        message.error('Email đã được sử dụng');
        return;
      }

      // Tạo user mới
      const response = await axios.post('http://localhost:3000/users', {
        ...values,
        role: 'user',
        createdAt: new Date().toISOString()
      });

      if (response.status === 201) {
        message.success('Đăng ký thành công!');
        navigate('/login');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi đăng ký');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-900">Đăng ký tài khoản</h2>
          <p className="mt-2 text-sm text-gray-600">
            Hoặc{' '}
            <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
              đăng nhập nếu đã có tài khoản
            </Link>
          </p>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          scrollToFirstError
        >
          <Form.Item
            name="fullName"
            label="Họ tên"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập họ tên!',
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Họ tên" />
          </Form.Item>

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
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập số điện thoại!',
              },
              {
                pattern: /^[0-9]{10}$/,
                message: 'Số điện thoại không hợp lệ!',
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Số điện thoại" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
              {
                min: 6,
                message: 'Mật khẩu phải có ít nhất 6 ký tự!',
              },
            ]}
            hasFeedback
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Vui lòng xác nhận mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Register; 