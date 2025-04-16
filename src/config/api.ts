export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
  users: `${API_BASE_URL}/users`,
  cart: `${API_BASE_URL}/cart`,
  orders: `${API_BASE_URL}/orders`,
} as const;

export default API_ENDPOINTS; 