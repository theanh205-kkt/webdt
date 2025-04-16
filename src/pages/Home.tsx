import { Button, Card, Layout, Menu, Row, Col, Select, Input, Space, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import useList from '../hooks/useList';
import { ShoppingCartOutlined, SearchOutlined } from '@ant-design/icons';
import { useState, useEffect } from 'react';
import axios from 'axios';

const { Header, Content, Footer } = Layout;
const { Option } = Select;

interface Product {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  categoryID: number;
  description: string;
}

interface Category {
  id: number;
  name: string;
}

const HomePage = () => {
  const navigate = useNavigate();
  const { data: products, isLoading } = useList({ resource: "products" });
  const { data: categories } = useList({ resource: "categories" });
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (products?.data) {
      let filtered = [...products.data] as Product[];
      
      // Lọc theo danh mục
      if (selectedCategory !== 'all') {
        filtered = filtered.filter((product) => 
          product.categoryID === parseInt(selectedCategory)
        );
      }

      // Lọc theo từ khóa tìm kiếm
      if (searchText) {
        filtered = filtered.filter((product) =>
          product.name.toLowerCase().includes(searchText.toLowerCase())
        );
      }

      setFilteredProducts(filtered);
    }
  }, [products?.data, selectedCategory, searchText]);

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleAddToCart = async (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    try {
      // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
      const cartResponse = await axios.get('http://localhost:3000/cart');
      const cartItems = cartResponse.data;
      const existingItem = cartItems.find((item: any) => item.productId === product.id);

      if (existingItem) {
        // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
        await axios.patch(`http://localhost:3000/cart/${existingItem.id}`, {
          quantity: existingItem.quantity + 1
        });
        message.success('Đã tăng số lượng sản phẩm trong giỏ hàng');
      } else {
        // Nếu sản phẩm chưa có trong giỏ hàng, thêm mới
        await axios.post('http://localhost:3000/cart', {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image
        });
        message.success('Đã thêm sản phẩm vào giỏ hàng');
      }
    } catch (error) {
      message.error('Có lỗi xảy ra khi thêm vào giỏ hàng');
    }
  };

  return (
    <Layout className="min-h-screen">
      <Header style={{ background: '#fff', padding: '0 50px' }}>
        <div className="flex justify-between items-center h-full">
          <div className="text-2xl font-bold cursor-pointer" onClick={() => navigate('/')}>
            Shop Online
          </div>
          <div className="space-x-4">
            <Button icon={<ShoppingCartOutlined />} onClick={() => navigate('/cart')}>
              Giỏ hàng
            </Button>
            <Button type="primary" onClick={handleLoginClick}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </Header>

      <Content style={{ padding: '30px' }}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Chào mừng đến với Shop Online</h1>
          <p className="text-lg text-gray-600 mb-8">Khám phá các sản phẩm chất lượng của chúng tôi</p>
          
          {/* Phần tìm kiếm và lọc */}
          <div className="flex justify-center gap-4 mb-8">
            <Space size="large">
              <Select
                defaultValue="all"
                style={{ width: 200 }}
                onChange={(value) => setSelectedCategory(value)}
              >
                <Option value="all">Tất cả danh mục</Option>
                {categories?.data?.map((category: Category) => (
                  <Option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </Option>
                ))}
              </Select>
              <Input
                placeholder="Tìm kiếm sản phẩm..."
                prefix={<SearchOutlined />}
                style={{ width: 300 }}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Space>
          </div>
        </div>

        <div className="site-card-wrapper">
          <Row gutter={[16, 16]}>
            {filteredProducts.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  style={{ overflow: 'hidden', maxWidth: '280px', margin: '0 auto' }}
                  cover={
                    <div style={{ position: 'relative', paddingTop: '100%', maxWidth: '280px' }}>
                      <img 
                        alt={product.name} 
                        src={product.image} 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'contain',
                          padding: '10px'
                        }}
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/280x280?text=No+Image';
                        }}
                      />
                      <div 
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          background: 'rgba(0,0,0,0)',
                          transition: 'background 0.3s',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '10px',
                          opacity: 0
                        }}
                        className="hover:bg-black/20 hover:opacity-100"
                      >
                        <Button 
                          type="primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/product/${product.id}`);
                          }}
                        >
                          Xem chi tiết
                        </Button>
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          onClick={(e) => handleAddToCart(e, product)}
                        />
                      </div>
                    </div>
                  }
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <Card.Meta
                    title={<span className="text-base font-bold">{product.name}</span>}
                    description={
                      <div>
                        <p className="text-lg text-red-500 font-bold mb-2">
                          {product.price.toLocaleString('vi-VN')} đ
                        </p>
                        <p className="text-gray-500">
                          Còn {product.quantity} sản phẩm
                        </p>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </Content>

      <Footer style={{ textAlign: 'center', background: '#f0f2f5', padding: '24px' }}>
        <div className="container mx-auto">
          <p className="text-gray-600">
            Shop Online ©{new Date().getFullYear()} - Được tạo bởi Thế Anh
          </p>
        </div>
      </Footer>
    </Layout>
  );
};

export default HomePage; 