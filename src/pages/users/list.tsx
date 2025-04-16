/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button, Skeleton, Table, Modal, Form, Input, message, Select } from "antd";
import useList from "../../hooks/useList";
import { IProduct } from "../../interface/type";
import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
// import { IProduct } from "../../interface/type";

const UserListPage = () => {
  const { data, isLoading, error, isError, refetch } = useList({ resource: "users" });
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const dataSource = data?.data?.map((product: IProduct) => ({
    key: product.id,
    ...product,
  }));

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/users/${id}`);
      message.success('Xóa tài khoản thành công');
      refetch();
    } catch (error) {
      message.error('Xóa tài khoản thất bại');
    }
  };

  const handleCreate = async (values: any) => {
    try {
      // Thêm các trường bắt buộc
      const userData = {
        ...values,
        password: values.password || '123456', // Mật khẩu mặc định
        role: values.role || 'user' // Role mặc định
      };
      
      const response = await axios.post('http://localhost:3000/users', userData);
      console.log('Response:', response);
      message.success('Thêm tài khoản thành công');
      setIsModalVisible(false);
      form.resetFields();
      refetch();
    } catch (error) {
      console.error('Error:', error);
      message.error('Thêm tài khoản thất bại');
    }
  };

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullname",
      key: "fullname",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Giới tính",
      dataIndex: "sex",
      key: "sex",
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      render: (_: any, item: IProduct) => {
        return (
          <div className="flex space-x-3">
            <Button danger onClick={() => handleDelete(item.id)}>
              Xóa
            </Button>
          </div>
        );
      },
    },
  ];

  if (isLoading) return <Skeleton active />;
  if (isError) return <div>Error: {error.message}</div>;
  if (!data) return <div>Không có tài khoản nào</div>;

  return (
    <div>
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Danh sách tài khoản</h2>
        <Button type="primary" onClick={() => setIsModalVisible(true)}>
          Thêm tài khoản
        </Button>
      </div>
      <Table dataSource={dataSource} columns={columns} />

      <Modal
        title="Thêm tài khoản mới"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} onFinish={handleCreate} layout="vertical">
          <Form.Item
            name="fullname"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
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
          <Form.Item
            name="sex"
            label="Giới tính"
            rules={[{ required: true, message: 'Vui lòng nhập giới tính' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true, message: 'Vui lòng nhập số điện thoại' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Select.Option value="user">Người dùng</Select.Option>
              <Select.Option value="admin">Quản trị viên</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Thêm
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserListPage;
