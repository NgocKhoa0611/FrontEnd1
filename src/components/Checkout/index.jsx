import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './index.css';
import axios from "axios";

const Checkout = () => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'bankTransfer' // Default payment method
  });
  const [loading, setLoading] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [orderSuccess, setOrderSuccess] = useState(false); // State for success message

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cart', {
          withCredentials: true,
        });
        console.log('Cart items:', response.data.cart);
        setCartItems(response.data.cart.cartDetail || { cartDetail: [] });
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
        console.error('Error fetching cart:', errorMessage);
        setLoading(false);
      }
    };
    getCart();
  }, []);

  useEffect(() => {
    // Retrieve cart data from localStorage
    const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(storedCart);
  }, []);

  useEffect(() => {
    if (orderSuccess) {
      const timer = setTimeout(() => {
        setOrderSuccess(false); // Ẩn thông báo sau 3 giây
      }, 3000);
      return () => clearTimeout(timer); // Dọn dẹp timer
    }
  }, [orderSuccess]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate order submission
    console.log('Form submitted:', formData);

    // Clear form data and show success message
    setFormData({
      email: '',
      fullName: '',
      phoneNumber: '',
      address: '',
      city: '',
      notes: '',
      paymentMethod: 'bankTransfer'
    });

    setOrderSuccess(true);

    // Clear cart after successful order
    setCartItems([]);
    localStorage.removeItem('cart');
  };

  // Calculate subtotal and total prices
  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + item.quantity * item.ProductDetail.product.price_promotion, 0);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  const subtotal = calculateSubtotal();
  const shippingFee = 0; // Can be adjusted based on conditions
  const total = subtotal + shippingFee;

  return (
    <div className="checkout-page">
      <div className="container">
        {/* Success Message */}
        {orderSuccess && (
          <div className="success-message">
            <p>Đặt hàng thành công! Cảm ơn bạn đã mua sắm.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="checkout-content">
          {/* Recipient Information */}
          <div className="checkout-info">
            <h2>Thông tin nhận hàng</h2>
            <div className="form-group">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Họ và tên"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                required
                placeholder="Số điện thoại"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Địa chỉ"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="form-input"
              >
                <option value="">Chọn tỉnh thành</option>
                <option value="Hà Nội">Hà Nội</option>
                <option value="Hồ Chí Minh">Hồ Chí Minh</option>
                <option value="Đà Nẵng">Đà Nẵng</option>
                {/* Add more cities as needed */}
              </select>
            </div>
            <div className="form-group">
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Ghi chú (tùy chọn)"
                className="form-input"
                rows={3}
              ></textarea>
            </div>
          </div>

          {/* Payment Method */}
          <div className="payment">
            <h2>Thanh toán</h2>
            <div className="payment-methods">
              <div className="payment-option">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={formData.paymentMethod === 'bankTransfer'}
                  onChange={handleChange}
                />
                <label htmlFor="bankTransfer">Chuyển khoản qua ngân hàng</label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="cashOnDelivery"
                  name="paymentMethod"
                  value="cashOnDelivery"
                  checked={formData.paymentMethod === 'cashOnDelivery'}
                  onChange={handleChange}
                />
                <label htmlFor="cashOnDelivery">Thanh toán khi giao hàng (COD)</label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Đơn hàng</h2>
            <ul className="cart-items-list">
              {loading ? "loading..." : cartItems.map((item, index) => (
                <li key={index} className="cart-item">
                    <img  
                        className="h-24 w-24 rounded-md mr-4 border min-w-24"
                        src={`http://localhost:8000/img/${item.ProductDetail.productImage?.img_url}`}
                        alt={item.ProductDetail.product.product_name}
                    />
                    <div className='flex flex-col h-full w-full gap-5'>
                      <div className="item-details">
                        <span className="item-name">{item.ProductDetail.product.product_name}</span>
                      </div>
                      <div className='flex justify-between'>
                        <span className="item-price">   
                          {formatCurrency(item.ProductDetail.product.price_promotion)} x {item.quantity}
                        </span>
                        <span className="item-total">
                        Tổng tiền: {formatCurrency(item.ProductDetail.product.price_promotion * item.quantity)}
                        </span>
                      </div>
                    </div>
                </li>
              ))}
            </ul>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Tạm tính</span>
                <span className="price-right">{formatCurrency(subtotal)}</span>
              </div>
              <div className="price-row">
                <span>Phí vận chuyển</span>
                <span className="price-right">{formatCurrency(shippingFee)}</span>
              </div>
            </div>

            <div className="total-price">
              <span>Tổng cộng</span>
              <span className="price-right">{formatCurrency(total)}</span>
            </div>
            <div className="checkout-button-group">
              <Link to="/cart" className="back-to-cart">
                <i className="fa-solid fa-chevron-left"></i> Quay về giỏ hàng
              </Link>
              <button type="submit" className="place-order-btn">
                Đặt hàng
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
