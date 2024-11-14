import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = () => {
  const [cart, setCart] = useState(null); // Khởi tạo cart là null
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cart', {
          withCredentials: true,
        });
        console.log('Cart items:', response.data.cart);
        setCart(response.data.cart);
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
        console.error('Error fetching cart:', errorMessage);
        setLoading(false);
      }
    };
    getCart();
  }, []);

  const calculateTotal = () => {
    if (!cart || !cart.cartDetail) return { subtotal: 0, taxes: 0, total: 0 }; // Nếu cart chưa có dữ liệu, trả về 0
    const subtotal = cart.cartDetail.reduce((acc, item) => acc + item.ProductDetail.product.price * item.quantity, 0);
    const taxes = Math.round(subtotal * 0.1); // Giả sử thuế là 10%
    return { subtotal, taxes, total: subtotal + taxes };
  };

  const { subtotal, taxes, total } = calculateTotal();

  const handleIncrease = (product_id) => {
    if (!cart || !cart.cartDetail) return;
    const updatedCart = cart.cartDetail.map((item) =>
      item.ProductDetail.product.product_id === product_id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart({ ...cart, cartDetail: updatedCart });
  };

  const handleDecrease = (product_id) => {
    if (!cart || !cart.cartDetail) return;
    const updatedCart = cart.cartDetail.map((item) =>
      item.ProductDetail.product.product_id === product_id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart({ ...cart, cartDetail: updatedCart });
  };

  const handleRemove = (product_id) => {
    if (!cart || !cart.cartDetail) return;
    const updatedCart = cart.cartDetail.filter((item) => item.ProductDetail.product.product_id !== product_id);
    setCart({ ...cart, cartDetail: updatedCart });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cart || !cart.cartDetail || cart.cartDetail.length === 0) {
    return <div>Giỏ hàng của bạn chưa có sản phẩm nào.</div>;
  }

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Giỏ hàng</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold py-4 text-gray-600">Sản phẩm</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Giá</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Số lượng</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Tổng cộng</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartDetail.map((item) => (
                    <tr className="border-b" key={item.cart_detail_id}>
                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            className="h-24 w-24 rounded-md mr-4 border"
                            src={`http://localhost:8000/img/${item.ProductDetail.productImage?.img_url}`}
                            alt={item.ProductDetail.product.product_name}
                          />
                          <span className="font-semibold text-gray-700">{item.ProductDetail.product.product_name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{item.ProductDetail.product.price.toLocaleString()}₫</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center border border-gray-300 rounded-md w-24">
                          <button
                            onClick={() => handleDecrease(item.ProductDetail.product.product_id)}
                            className="py-2 px-2 text-gray-700 hover:bg-gray-200 transition"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-center w-12 border-l border-r border-gray-500 py-2 text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.ProductDetail.product.product_id)}
                            className="py-2 px-2 text-gray-700 hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600">{(item.ProductDetail.product.price * item.quantity).toLocaleString()}₫</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleRemove(item.ProductDetail.product.product_id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Chi tiết thanh toán</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Thuế</span>
                <span>{taxes.toLocaleString()}₫</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
              <Link to="/checkout" className="block">
                <button className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-6 w-full hover:bg-blue-600 transition">
                  Thanh toán
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
