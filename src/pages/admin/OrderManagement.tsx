import React, { useState, useEffect } from 'react';
import { Table, Tag, Button, Modal, Select, message, Space, Card, Row, Col, Statistic } from 'antd';
import { EyeOutlined, ShoppingCartOutlined, CheckCircleOutlined, ClockCircleOutlined, CarOutlined, CloseCircleOutlined } from '@ant-design/icons';
import axios from 'axios';

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface Order {
  id: string;
  items: OrderItem[];
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
  };
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipping' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: string, newStatus: Order['status']) => {
    try {
      await axios.patch(`http://localhost:3000/orders/${orderId}`, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      message.success('Cập nhật trạng thái thành công');
      fetchOrders();
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'yellow';
      case 'processing':
        return 'blue';
      case 'shipping':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'cancelled':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'Chờ xử lý';
      case 'processing':
        return 'Đang xử lý';
      case 'shipping':
        return 'Đang giao hàng';
      case 'delivered':
        return 'Đã giao hàng';
      case 'cancelled':
        return 'Đã hủy';
      default:
        return status;
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(order => order.status === filterStatus);

  const calculateStatistics = () => {
    const totalOrders = orders.length;
    const ordersByStatus = {
      pending: orders.filter(order => order.status === 'pending').length,
      processing: orders.filter(order => order.status === 'processing').length,
      shipping: orders.filter(order => order.status === 'shipping').length,
      delivered: orders.filter(order => order.status === 'delivered').length,
      cancelled: orders.filter(order => order.status === 'cancelled').length
    };
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      ordersByStatus,
      totalRevenue
    };
  };

  const stats = calculateStatistics();

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: ['customerInfo', 'fullName'],
      key: 'customerName',
    },
    {
      title: 'Số điện thoại',
      dataIndex: ['customerInfo', 'phone'],
      key: 'phone',
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => (
        <span>{amount.toLocaleString('vi-VN')}đ</span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: Order['status'], record: Order) => (
        <Select
          value={status}
          style={{ width: 150 }}
          onChange={(value) => handleStatusChange(record.id, value)}
        >
          <Select.Option value="pending">Chờ xử lý</Select.Option>
          <Select.Option value="processing">Đang xử lý</Select.Option>
          <Select.Option value="shipping">Đang giao hàng</Select.Option>
          <Select.Option value="delivered">Đã giao hàng</Select.Option>
          <Select.Option value="cancelled">Đã hủy</Select.Option>
        </Select>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Order) => (
        <Button
          icon={<EyeOutlined />}
          onClick={() => setSelectedOrder(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số đơn hàng"
              value={stats.totalOrders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng đã giao"
              value={stats.ordersByStatus.delivered}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Đơn hàng đang xử lý"
              value={stats.ordersByStatus.processing + stats.ordersByStatus.shipping}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng doanh thu"
              value={stats.totalRevenue}
              prefix="₫"
              formatter={(value) => value.toLocaleString('vi-VN')}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng chờ xử lý"
              value={stats.ordersByStatus.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng đang giao"
              value={stats.ordersByStatus.shipping}
              prefix={<CarOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng đã hủy"
              value={stats.ordersByStatus.cancelled}
              prefix={<CloseCircleOutlined />}
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>

      <div style={{ marginBottom: 16 }}>
        <Space>
          <span>Lọc theo trạng thái:</span>
          <Select
            value={filterStatus}
            style={{ width: 150 }}
            onChange={setFilterStatus}
          >
            <Select.Option value="all">Tất cả</Select.Option>
            <Select.Option value="pending">Chờ xử lý</Select.Option>
            <Select.Option value="processing">Đang xử lý</Select.Option>
            <Select.Option value="shipping">Đang giao hàng</Select.Option>
            <Select.Option value="delivered">Đã giao hàng</Select.Option>
            <Select.Option value="cancelled">Đã hủy</Select.Option>
          </Select>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={filteredOrders}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Chi tiết đơn hàng"
        open={!!selectedOrder}
        onCancel={() => setSelectedOrder(null)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <h3>Thông tin khách hàng</h3>
            <p><strong>Tên:</strong> {selectedOrder.customerInfo.fullName}</p>
            <p><strong>Số điện thoại:</strong> {selectedOrder.customerInfo.phone}</p>
            <p><strong>Địa chỉ:</strong> {selectedOrder.customerInfo.address}</p>
            {selectedOrder.customerInfo.note && (
              <p><strong>Ghi chú:</strong> {selectedOrder.customerInfo.note}</p>
            )}

            <h3 style={{ marginTop: 20 }}>Danh sách sản phẩm</h3>
            <Table
              dataSource={selectedOrder.items}
              columns={[
                {
                  title: 'Sản phẩm',
                  dataIndex: 'name',
                  key: 'name',
                  render: (text, record) => (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <img
                        src={record.image}
                        alt={text}
                        style={{ width: 50, height: 50, marginRight: 10 }}
                      />
                      <span>{text}</span>
                    </div>
                  ),
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price: number) => (
                    <span>{price.toLocaleString('vi-VN')}đ</span>
                  ),
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record) => (
                    <span>{(record.price * record.quantity).toLocaleString('vi-VN')}đ</span>
                  ),
                },
              ]}
              pagination={false}
            />

            <div style={{ marginTop: 20, textAlign: 'right' }}>
              <h3>
                Tổng tiền: {selectedOrder.totalAmount.toLocaleString('vi-VN')}đ
              </h3>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderManagement; 