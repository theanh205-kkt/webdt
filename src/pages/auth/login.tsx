import { Button, Form, Input, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      // Kiểm tra kết nối với server
      const response = await axios.get('http://localhost:3000/users');
      console.log('Server response:', response.data); // Log data để debug
      
      const users = response.data;
      
      // Tìm user với email và password khớp
      const user = users.find((u: any) => {
        console.log('Checking user:', u.email, values.email); // Log để debug
        return u.email === values.email && u.password === values.password;
      });

      if (user) {
        // Lưu thông tin user vào localStorage
        localStorage.setItem('user', JSON.stringify(user));
        message.success('Đăng nhập thành công');
        
        // Log trước khi chuyển hướng
        console.log('Navigating to /admin');
        navigate('/admin');
        
        // Log sau khi chuyển hướng
        console.log('Navigation completed');
      } else {
        message.error('Email hoặc mật khẩu không đúng');
      }
    } catch (error: any) {
      // Log chi tiết lỗi
      console.error('Login error:', {
        message: error.message,
        response: error.response,
        stack: error.stack
      });
      
      if (error.code === 'ERR_NETWORK') {
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra json-server đã chạy chưa.');
      } else {
        message.error('Đăng nhập thất bại. Vui lòng thử lại');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          initialValues={{ email: 'anhctph52494@gmail.com', password: '123456' }}
        >
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage; 