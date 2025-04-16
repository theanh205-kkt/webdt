import React, { useEffect, useState } from 'react';
import { Table, Button, Space, message, Modal, Form, Input, InputNumber, Upload, Select } from 'antd';
import { UploadOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import type { UploadProps } from 'antd';
import axios from 'axios';
import { API_ENDPOINTS } from '../../config/api';

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  categoryId: number;
}

interface Category {
  id: number;
  name: string;
}

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.categories);
      setCategories(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách danh mục');
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_ENDPOINTS.products);
      setProducts(response.data);
    } catch (error) {
      message.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_ENDPOINTS.products}/${id}`);
      message.success('Xóa sản phẩm thành công');
      fetchProducts();
    } catch (error) {
      message.error('Không thể xóa sản phẩm');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    form.setFieldsValue(product);
    setIsModalVisible(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingProduct) {
        await axios.put(`${API_ENDPOINTS.products}/${editingProduct.id}`, values);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        await axios.post(API_ENDPOINTS.products, values);
        message.success('Thêm sản phẩm thành công');
      }
      setIsModalVisible(false);
      fetchProducts();
    } catch (error) {
      message.error('Có lỗi xảy ra');
    }
  };

  const uploadProps: UploadProps = {
    name: 'file',
    action: 'http://localhost:3001/upload',
    onChange(info) {
      if (info.file.status === 'done') {
        message.success(`${info.file.name} tải lên thành công`);
        form.setFieldValue('image', info.file.response.url);
      } else if (info.file.status === 'error') {
        message.error(`${info.file.name} tải lên thất bại.`);
      }
    },
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'image',
      key: 'image',
      render: (image: string) => (
        <img src={image} alt="product" style={{ width: 50, height: 50, objectFit: 'cover' }} />
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price),
    },
    {
      title: 'Số lượng',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Danh mục',
      dataIndex: 'categoryId',
      key: 'categoryId',
      render: (categoryId: number) => {
        const category = categories.find(c => c.id === categoryId);
        return category ? category.name : 'N/A';
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Product) => (
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
        <h1 className="text-2xl font-bold">Quản lý sản phẩm</h1>
        <Button type="primary" onClick={handleAdd}>
          Thêm sản phẩm
        </Button>
      </div>

      <Table 
        columns={columns} 
        dataSource={products} 
        rowKey="id" 
        loading={loading}
      />

      <Modal
        title={editingProduct ? "Sửa sản phẩm" : "Thêm sản phẩm"}
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
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="price"
            label="Giá"
            rules={[{ required: true, message: 'Vui lòng nhập giá' }]}
          >
            <InputNumber 
              style={{ width: '100%' }}
              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={value => value!.replace(/\$\s?|(,*)/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng' }]}
          >
            <InputNumber style={{ width: '100%' }} min={0} />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea />
          </Form.Item>

          <Form.Item
            name="image"
            label="Hình ảnh"
            rules={[{ required: true, message: 'Vui lòng nhập URL hình ảnh' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select>
              {categories.map(category => (
                <Select.Option key={category.id} value={category.id}>
                  {category.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductManagement; 