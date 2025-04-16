import React, { useEffect, useState } from 'react';
import { Table, Tag, Card, Descriptions, Modal, Button, Empty } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';
import { ShoppingOutlined } from '@ant-design/icons';

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  id: number;
  items: OrderItem[];
  customerInfo: {
    fullName: string;
    phone: string;
    address: string;
    note?: string;
  };
  paymentMethod: 'cod' | 'banking';
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const OrderHistory: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/orders');
      setOrders(response.data.reverse()); // Hiển thị đơn hàng mới nhất trước
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    const statusColors: { [key: string]: string } = {
      'pending': 'gold',
      'processing': 'blue',
      'shipping': 'cyan',
      'delivered': 'green',
      'cancelled': 'red'
    };
    return statusColors[status] || 'default';
  };

  const getStatusText = (status: string) => {
    const statusText: { [key: string]: string } = {
      'pending': 'Chờ xử lý',
      'processing': 'Đang xử lý',
      'shipping': 'Đang giao hàng',
      'delivered': 'Đã giao hàng',
      'cancelled': 'Đã hủy'
    };
    return statusText[status] || status;
  };

  const showOrderDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const columns: ColumnsType<Order> = [
    {
      title: 'Mã đơn hàng',
      key: 'id',
      render: (_, record) => `#${record.id}`,
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => (
        <span className="text-red-500 font-medium">
          {amount.toLocaleString('vi-VN')} đ
        </span>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Button type="link" onClick={() => showOrderDetail(record)}>
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div className="container mx-auto p-4">
      <Card title="Đơn hàng của tôi" className="mb-4">
        {orders.length > 0 ? (
          <Table
            columns={columns}
            dataSource={orders}
            loading={loading}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        ) : (
          <Empty
            image={<ShoppingOutlined style={{ fontSize: 64 }} />}
            description="Bạn chưa có đơn hàng nào"
          />
        )}
      </Card>

      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedOrder && (
          <div>
            <Descriptions title="Thông tin đơn hàng" bordered column={1}>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedOrder.status)}>
                  {getStatusText(selectedOrder.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Người nhận">
                {selectedOrder.customerInfo.fullName}
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại">
                {selectedOrder.customerInfo.phone}
              </Descriptions.Item>
              <Descriptions.Item label="Địa chỉ">
                {selectedOrder.customerInfo.address}
              </Descriptions.Item>
              {selectedOrder.customerInfo.note && (
                <Descriptions.Item label="Ghi chú">
                  {selectedOrder.customerInfo.note}
                </Descriptions.Item>
              )}
              <Descriptions.Item label="Phương thức thanh toán">
                {selectedOrder.paymentMethod === 'cod' ? 'Thanh toán khi nhận hàng' : 'Chuyển khoản ngân hàng'}
              </Descriptions.Item>
            </Descriptions>

            <Table
              title={() => <div className="font-medium">Danh sách sản phẩm</div>}
              columns={[
                {
                  title: 'Sản phẩm',
                  key: 'product',
                  render: (_, record: OrderItem) => (
                    <div className="flex items-center">
                      <img
                        src={record.image}
                        alt={record.name}
                        style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 15 }}
                      />
                      <span>{record.name}</span>
                    </div>
                  ),
                },
                {
                  title: 'Đơn giá',
                  dataIndex: 'price',
                  key: 'price',
                  render: (price) => `${price.toLocaleString('vi-VN')} đ`,
                },
                {
                  title: 'Số lượng',
                  dataIndex: 'quantity',
                  key: 'quantity',
                },
                {
                  title: 'Thành tiền',
                  key: 'total',
                  render: (_, record: OrderItem) => (
                    <span className="text-red-500">
                      {(record.price * record.quantity).toLocaleString('vi-VN')} đ
                    </span>
                  ),
                },
              ]}
              dataSource={selectedOrder.items}
              pagination={false}
              rowKey="id"
              summary={() => (
                <Table.Summary fixed>
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0} colSpan={3}>
                      <strong>Tổng tiền</strong>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <span className="text-red-500 font-medium">
                        {selectedOrder.totalAmount.toLocaleString('vi-VN')} đ
                      </span>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                </Table.Summary>
              )}
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderHistory; 