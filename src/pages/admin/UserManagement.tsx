import React from 'react';
import { Table, Tag, Button, Space, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  role: 'admin' | 'user';
  createdAt: string;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = React.useState<User[]>([]);
  const [loading, setLoading] = React.useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3000/users');
      setUsers(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách người dùng');
    }
    setLoading(false);
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: number, role: string) => {
    if (role === 'admin') {
      message.error('Không thể xóa tài khoản admin');
      return;
    }

    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa người dùng');
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Họ tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Admin' : 'User'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => new Date(date).toLocaleDateString('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="primary">Sửa</Button>
          <Button 
            danger 
            onClick={() => handleDelete(record.id, record.role)}
            disabled={record.role === 'admin'}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button type="primary">Thêm người dùng</Button>
      </div>
      <Table 
        columns={columns} 
        dataSource={users}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default UserManagement; 