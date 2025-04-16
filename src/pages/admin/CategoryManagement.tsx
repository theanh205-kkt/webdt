import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message, Modal, Form, Input } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

interface Category {
  id: number;
  name: string;
}

const CategoryManagement: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.categories);
      setCategories(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.categories}/${id}`);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error) {
      message.error('Không thể xóa danh mục');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue(category);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await axios.put(`${API_ENDPOINTS.categories}/${editingCategory.id}`, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await axios.post(API_ENDPOINTS.categories, values);
        message.success('Thêm danh mục thành công');
      }
      setIsModalVisible(false);
      fetchCategories();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Category) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý danh mục</h1>
        <Button type="primary" onClick={handleAdd}>
          Thêm danh mục
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={categories} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={editingCategory ? "Sửa danh mục" : "Thêm danh mục"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryManagement; 