import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Card, Layout, InputNumber, message, Descriptions, Breadcrumb } from 'antd';
import axios from 'axios';
import { ShoppingCartOutlined, HomeOutlined } from '@ant-design/icons';
import { API_ENDPOINTS } from '../config/api';

const { Header, Content, Footer } = Layout;

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  description: string;
  categoryID: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_ENDPOINTS.products}/${id}`);
        setProduct(response.data);
      } catch (error) {
        message.error('Không thể tải thông tin sản phẩm');
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = async () => {
    // Kiểm tra đăng nhập
    const userStr = localStorage.getItem('user');
    if (!userStr) {
      message.warning('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
      navigate('/login');
      return;
    }

    try {
      // Kiểm tra số lượng
      if (product && quantity > product.quantity) {
        message.error('Số lượng vượt quá hàng có sẵn');
        return;
      }

      // Lấy giỏ hàng hiện tại
      const cartResponse = await axios.get(API_ENDPOINTS.cart);
      const cart = cartResponse.data;

      // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
      const existingItem = cart.find((item: any) => item.productId === product?.id);

      if (existingItem) {
        // Cập nhật số lượng nếu sản phẩm đã có trong giỏ
        await axios.patch(`${API_ENDPOINTS.cart}/${existingItem.id}`, {
          quantity: existingItem.quantity + quantity
        });
      } else {
        // Thêm sản phẩm mới vào giỏ
        await axios.post(API_ENDPOINTS.cart, {
          productId: product?.id,
          name: product?.name,
          price: product?.price,
          image: product?.image,
          quantity: quantity
        });
      }

      message.success('Đã thêm vào giỏ hàng');
    } catch (error) {
      message.error('Không thể thêm vào giỏ hàng');
    }
  };

  if (!product) return null;

  return (
    <Layout className="min-h-screen">
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <div className="flex justify-between items-center h-full">
          <div className="text-2xl font-bold">Shop Online</div>
          <Button icon={<ShoppingCartOutlined />} onClick={() => navigate('/cart')}>
            Giỏ hàng
          </Button>
        </div>
      </Header>

      <Content style={{ padding: '0 50px' }}>
        <div className="py-6">
          <Breadcrumb items={[
            {
              href: '/',
              title: <><HomeOutlined /> Trang chủ</>
            },
            {
              title: product.name
            }
          ]} />
        </div>

        <Card>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full rounded-lg"
                style={{ maxHeight: '500px', objectFit: 'contain' }}
              />
            </div>
            <div className="md:w-1/2">
              <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
              <Descriptions column={1} items={[
                {
                  label: "Giá",
                  children: <span className="text-2xl text-red-500 font-bold">
                    {product.price.toLocaleString('vi-VN')} đ
                  </span>
                },
                {
                  label: "Tình trạng",
                  children: <span className="text-green-500">
                    Còn {product.quantity} sản phẩm
                  </span>
                },
                {
                  label: "Mô tả",
                  children: product.description
                }
              ]} />

              <div className="mt-6">
                <div className="mb-4">
                  <span className="mr-4">Số lượng:</span>
                  <InputNumber
                    min={1}
                    max={product.quantity}
                    value={quantity}
                    onChange={(value) => setQuantity(value || 1)}
                  />
                </div>
                <Button
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </Content>

      <Footer style={{ textAlign: 'center' }}>
        Shop Online ©{new Date().getFullYear()} - Được tạo bởi Thế Anh
      </Footer>
    </Layout>
  );
};

export default ProductDetail; 