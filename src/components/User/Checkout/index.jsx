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
  const shippingFee = 0, total = totalPrice + shippingFee

  useEffect(() => {
    // Fetch user data from the API
    const fetchUserData = async () => {
      try {
        const token = document.cookie
          .split("; ")
          .find(row => row.startsWith("token="))
          ?.split("=")[1];

        if (!token) return;

        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.id;

        const response = await axios.get(`http://localhost:8000/user/${userId}`, { withCredentials: true }); // Adjust the API endpoint
        setUser(response.data);
        setFormData({
          ...formData,
          email: response.data.email,
          fullName: response.data.name,
          phoneNumber: response.data.phone,
          address: response.data.address || '',
          city: response.data.city || '',
        });
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
    const { value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      paymentMethod: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Cấu trúc dữ liệu gửi đến API
      const orderData = {
        total_price: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        payment_method: formData.paymentMethod,
        order_status: 'Chờ xử lý', // Default status
        order_details: cartItems.map((item) => ({
          product_detail_id: item.product_detail_id,
          quantity: item.quantity,
          payment_date: null,
          total_amount: item.price * item.quantity,
        })),
      };

      // Gửi yêu cầu POST đến API
      const response = await axios.post('http://localhost:8000/orders', orderData, {
        withCredentials: true,
      });

      console.log('Order Response:', response.data);

      setOrderSuccess(true);
      setErrorMessage('');

      setFormData({
        email: '',
        fullName: '',
        phoneNumber: '',
        address: '',
        city: '',
        notes: '',
        paymentMethod: 'Tiền mặt',
        payment_date: '',
      });

      dispatch(clearSelectedItems());
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
                  id="cash"
                  name="paymentMethod"
                  value="cash"
                  checked={formData.paymentMethod === 'cash'}
                  onChange={handleChange}
                />
                <label htmlFor="cashOnDelivery">Thanh toán khi giao hàng (COD)</label>
              </div>
              <div className="payment-option">
                <input
                  type="radio"
                  id="bankTransfer"
                  name="paymentMethod"
                  value="bankTransfer"
                  checked={formData.paymentMethod === 'bankTransfer'}
                  onChange={handleChange}
                />
                <label htmlFor="bankTransfer">Thanh toán thẻ ATM</label>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h2>Đơn hàng</h2>
            <ul className="cart-items-list">
              {cartItems.map((item) => (
                <li key={item.product_detail_id} className="cart-item">
                  <img
                    src={`http://localhost:8000/img/${item.img_url}`}
                    alt={item.product_name}
                    className="item-image"
                  />
                  <div className="item-details">
                    <span className="item-name">{item.product_name}</span>
                    <div className="item-options">
                      <span>Size: {item.size}</span><br />
                      <span>Màu: {item.color}</span>
                    </div>
                  </div>
                  <span className="item-price">
                    {formatCurrency(item.price)} x {item.quantity}
                  </span>
                </li>
              ))}
            </ul>

            <div className="price-breakdown">
              <div className="price-row">
                <span>Tạm tính</span>
                <span className="price-right">{formatCurrency(totalPrice)}</span>
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
