import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import { clearSelectedItems } from '../../../redux/slices/orderslice'; // Adjust the path based on your folder structure
import { Link } from 'react-router-dom';
import axios from 'axios';
import './index.css';

const Checkout = () => {
  const dispatch = useDispatch();
  const [errorMessage, setErrorMessage] = useState("");
  const cartItems = useSelector((state) => state.order.selectedItems);
  const totalPrice = useSelector((state) => state.order.totalPrice);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'cash',
  });

  const [orderSuccess, setOrderSuccess] = useState(false);
  const [user, setUser] = useState(null);
  const shippingFee = 0;
  const total = totalPrice + shippingFee;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await axios.get(`http://localhost:8000/user/${userId}`, { withCredentials: true });
        setUser(response.data);
        setFormData(prev => ({
          ...prev,
          email: response.data.email,
          fullName: response.data.name,
          phoneNumber: response.data.phone,
          address: response.data.address || '',
          city: response.data.city || '',
        }));
      } catch (error) {
        console.error('Error fetching user data:', error);
        setErrorMessage('Không thể lấy thông tin người dùng.');
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        setOrderSuccess(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [orderSuccess]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const orderData = {
        total_price: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        payment_method: formData.paymentMethod,
        order_status: 'Chờ xử lý',
        order_details: cartItems.map((item) => ({
          product_detail_id: item.product_detail_id,
          quantity: item.quantity,
          payment_date: null,
          total_amount: item.price * item.quantity,
        })),
      };

      const response = await axios.post('http://localhost:8000/orders', orderData, {
        withCredentials: true,
      });

      setOrderSuccess(true);
      setErrorMessage('');
      setFormData({
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        city: '',
        notes: '',
        paymentMethod: 'cash',
      });
    } catch (error) {
      console.error('Error creating order:', error);
      setErrorMessage('Đã có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.');
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {orderSuccess && (
          <div className="mb-6 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <p>Đặt hàng thành công! Cảm ơn bạn đã mua sắm.</p>
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Customer Information */}
          <div className="lg:w-2/3 space-y-6">
            {/* Shipping Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Thông tin nhận hàng</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ghi chú</label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Phương thức thanh toán</h2>
              <div className="space-y-4">
                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={formData.paymentMethod === 'cash'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bankTransfer"
                    checked={formData.paymentMethod === 'bankTransfer'}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600"
                  />
                  <span>Thanh toán qua thẻ ATM</span>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column - Order Summary */}
          <div className="lg:w-1/3">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Đơn hàng</h2>

              {/* Order Items */}
              <div className="space-y-4 mb-6">
                {cartItems.map((item) => (
                  <div key={item.product_detail_id} className="flex gap-4">
                    <img
                      src={`http://localhost:8000/img/${item.img_url}`}
                      alt={item.product_name}
                      className="w-20 h-20 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium">{item.product_name}</h3>
                      <p className="text-sm text-gray-500">
                        Size: {item.size} | Màu: {item.color}
                      </p>
                      <div className="flex justify-between mt-2">
                        <span>{formatCurrency(item.price)}</span>
                        <span>x{item.quantity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(totalPrice)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Phí vận chuyển</span>
                  <span>{formatCurrency(shippingFee)}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-3 border-t">
                  <span>Tổng cộng</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 space-y-4">
                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Đặt hàng
                </button>
                <Link
                  to="/cart"
                  className="block w-full text-center py-3 text-gray-600 hover:text-gray-800"
                >
                  ← Quay về giỏ hàng
                </Link>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;