import React, { useEffect, useState } from 'react';
import { Table, Button, InputNumber, message, Form, Input, Modal, Radio, Steps, Row, Col, Card } from 'antd';
import { ShoppingCartOutlined, CreditCardOutlined, HomeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface OrderFormData {
  fullName: string;
  phone: string;
  address: string;
  note?: string;
  paymentMethod: 'cod' | 'banking';
}

const Cart: React.FC = () => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Kiểm tra user đã đăng nhập chưa
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isLoggedIn = !!user.id;

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/cart');
      setCart(response.data);
    } catch (error) {
      message.error('Không thể tải giỏ hàng');
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (id: number, quantity: number) => {
    try {
      await axios.patch(`http://localhost:3000/cart/${id}`, { quantity });
      fetchCart();
    } catch (error) {
      message.error('Không thể cập nhật số lượng');
    }
  };

  const handleRemove = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/cart/${id}`);
      message.success('Đã xóa sản phẩm khỏi giỏ hàng');
      fetchCart();
    } catch (error) {
      message.error('Không thể xóa sản phẩm');
    }
  };

  const handleProceedToCheckout = () => {
    if (!isLoggedIn) {
      message.warning('Vui lòng đăng nhập để tiếp tục đặt hàng');
      navigate('/login');
      return;
    }
    setCurrentStep(1);
    // Tự động điền thông tin từ user profile
    form.setFieldsValue({
      fullName: user.fullName,
      phone: user.phone,
    });
  };

  const handleOrder = async (values: OrderFormData) => {
    if (!isLoggedIn) {
      message.warning('Vui lòng đăng nhập để tiếp tục đặt hàng');
      navigate('/login');
      return;
    }

    if (isProcessing) return;
    setIsProcessing(true);
    try {
      const orderData = {
        userId: user.id,
        items: cart,
        customerInfo: {
          fullName: values.fullName,
          phone: values.phone,
          address: values.address,
          note: values.note
        },
        paymentMethod: values.paymentMethod,
        totalAmount: cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await axios.post('http://localhost:3000/orders', orderData);
      
      // Xóa giỏ hàng sau khi đặt hàng thành công
      for (const item of cart) {
        await axios.delete(`http://localhost:3000/cart/${item.id}`);
      }

      message.success('Đặt hàng thành công!');
      setIsModalVisible(false);
      form.resetFields();
      fetchCart();
      navigate('/order-history');
    } catch (error) {
      message.error('Có lỗi xảy ra khi đặt hàng');
    } finally {
      setIsProcessing(false);
    }
  };

  const columns: ColumnsType<CartItem> = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div className="flex items-center">
          <img 
            src={record.image} 
            alt={text} 
            style={{ width: 80, height: 80, objectFit: 'cover', marginRight: 15 }}
          />
          <span className="font-medium">{text}</span>
        </div>
      ),
    },
    {
      title: 'Đơn giá',
      dataIndex: 'price',
      key: 'price',
      render: (price) => (
        <span className="text-gray-600">
          {price.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (_, record) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => handleQuantityChange(record.id, value || 1)}
          className="w-20"
        />
      ),
    },
    {
      title: 'Thành tiền',
      key: 'total',
      render: (_, record) => (
        <span className="text-red-500 font-medium">
          {(record.price * record.quantity).toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button danger onClick={() => handleRemove(record.id)}>Xóa</Button>
      ),
    },
  ];

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const steps = [
    {
      title: 'Giỏ hàng',
      icon: <ShoppingCartOutlined />
    },
    {
      title: 'Thông tin giao hàng',
      icon: <HomeOutlined />
    },
    {
      title: 'Thanh toán',
      icon: <CreditCardOutlined />
    }
  ];

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Giỏ hàng</h1>
        <div className="flex items-center gap-4">
          <Button 
            type="link" 
            onClick={() => navigate('/order-history')}
            icon={<ShoppingCartOutlined />}
          >
            Lịch sử đơn hàng
          </Button>
          {!isLoggedIn && (
            <Button 
              type="primary"
              onClick={() => navigate('/login')}
            >
              Đăng nhập
            </Button>
          )}
        </div>
      </div>
      <Steps
        current={currentStep}
        items={steps}
        className="mb-8"
      />

      {currentStep === 0 && (
        <>
          <Table 
            columns={columns} 
            dataSource={cart}
            loading={loading}
            rowKey="id"
            pagination={false}
            locale={{
              emptyText: (
                <div className="py-8 text-center">
                  <ShoppingCartOutlined style={{ fontSize: 48 }} className="text-gray-300 mb-4" />
                  <p>Giỏ hàng trống</p>
                </div>
              )
            }}
          />

          <Card className="mt-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600">Tổng tiền hàng: {totalAmount.toLocaleString('vi-VN')} đ</p>
                <p className="text-gray-600">Phí vận chuyển: 0 đ</p>
                <p className="text-lg font-bold mt-2">
                  Tổng thanh toán: <span className="text-red-500">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </p>
              </div>
              <Button 
                type="primary" 
                size="large"
                disabled={cart.length === 0}
                onClick={handleProceedToCheckout}
              >
                {isLoggedIn ? `Mua hàng (${cart.length})` : 'Đăng nhập để mua hàng'}
              </Button>
            </div>
          </Card>
        </>
      )}

      {currentStep === 1 && (
        <Card title="Thông tin giao hàng" className="max-w-2xl mx-auto">
          <Form
            form={form}
            layout="vertical"
            onFinish={(values) => {
              form.setFieldsValue(values);
              setCurrentStep(2);
            }}
          >
            <Form.Item
              name="fullName"
              label="Họ tên người nhận"
              rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
            >
              <Input size="large" placeholder="Nhập họ tên người nhận" />
            </Form.Item>

            <Form.Item
              name="phone"
              label="Số điện thoại"
              rules={[
                { required: true, message: 'Vui lòng nhập số điện thoại' },
                { pattern: /^[0-9]{10}$/, message: 'Số điện thoại không hợp lệ' }
              ]}
            >
              <Input size="large" placeholder="Nhập số điện thoại" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Địa chỉ nhận hàng"
              rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
            >
              <Input.TextArea 
                rows={3} 
                size="large"
                placeholder="Nhập địa chỉ nhận hàng chi tiết"
              />
            </Form.Item>

            <Form.Item
              name="note"
              label="Ghi chú"
            >
              <Input.TextArea 
                rows={2} 
                size="large"
                placeholder="Ghi chú về đơn hàng, ví dụ: thời gian hay chỉ dẫn địa điểm giao hàng chi tiết hơn"
              />
            </Form.Item>

            <div className="flex justify-between mt-8">
              <Button onClick={() => setCurrentStep(0)}>
                Quay lại
              </Button>
              <Button type="primary" htmlType="submit">
                Tiếp tục
              </Button>
            </div>
          </Form>
        </Card>
      )}

      {currentStep === 2 && (
        <Row gutter={24}>
          <Col span={16}>
            <Card title="Phương thức thanh toán" className="mb-4">
              <Form
                form={form}
                onFinish={handleOrder}
                initialValues={{ paymentMethod: 'cod' }}
              >
                <Form.Item
                  name="paymentMethod"
                  rules={[{ required: true, message: 'Vui lòng chọn phương thức thanh toán' }]}
                >
                  <Radio.Group className="w-full">
                    <Row>
                      <Col span={24}>
                        <Radio value="cod" className="p-4 w-full border rounded mb-4">
                          <div className="flex items-center">
                            <img 
                              src="https://down-vn.img.susercontent.com/file/d4bbea4570b93bfd5fc652ca82a262a8" 
                              alt="COD" 
                              className="w-8 h-8 mr-4"
                            />
                            <div>
                              <div className="font-medium">Thanh toán khi nhận hàng</div>
                              <div className="text-gray-500 text-sm">Thanh toán bằng tiền mặt khi nhận hàng</div>
                            </div>
                          </div>
                        </Radio>
                      </Col>
                      <Col span={24}>
                        <Radio value="banking" className="p-4 w-full border rounded">
                          <div className="flex items-center">
                            <img 
                              src="https://down-vn.img.susercontent.com/file/9263fa8c83628f5deff55e2a90758b06" 
                              alt="Banking" 
                              className="w-8 h-8 mr-4"
                            />
                            <div>
                              <div className="font-medium">Chuyển khoản ngân hàng</div>
                              <div className="text-gray-500 text-sm">Thanh toán qua Internet Banking</div>
                            </div>
                          </div>
                        </Radio>
                      </Col>
                    </Row>
                  </Radio.Group>
                </Form.Item>

                <div className="flex justify-between mt-8">
                  <Button onClick={() => setCurrentStep(1)}>
                    Quay lại
                  </Button>
                  <Button 
                    type="primary" 
                    htmlType="submit"
                    loading={isProcessing}
                    disabled={isProcessing}
                  >
                    {isProcessing ? 'Đang xử lý...' : 'Đặt hàng'}
                  </Button>
                </div>
              </Form>
            </Card>
          </Col>

          <Col span={8}>
            <Card title="Thông tin đơn hàng">
              <div className="mb-4">
                <p className="text-gray-600">Tổng tiền hàng: {totalAmount.toLocaleString('vi-VN')} đ</p>
                <p className="text-gray-600">Phí vận chuyển: 0 đ</p>
                <p className="text-lg font-bold mt-2">
                  Tổng thanh toán: <span className="text-red-500">{totalAmount.toLocaleString('vi-VN')} đ</span>
                </p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium mb-2">Thông tin người nhận:</h4>
                <p>{form.getFieldValue('fullName')}</p>
                <p>{form.getFieldValue('phone')}</p>
                <p>{form.getFieldValue('address')}</p>
                {form.getFieldValue('note') && (
                  <p className="text-gray-500 mt-2">Ghi chú: {form.getFieldValue('note')}</p>
                )}
              </div>
            </Card>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default Cart; 