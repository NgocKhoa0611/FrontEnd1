import React, { useState } from 'react';
import { Link } from 'react-router-dom'; 
import './index.css'; 

const Checkout = ({ CartItem }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    notes: '',
    paymentMethod: 'bankTransfer' // Default payment method
  });

  const exampleCartItems = [
    {
      id: 1,
      name: "Áo Thun Nam",
      price: 250000, // VND
      qty: 2,
      cover: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQp9n6dneTzP-7cmmYE7PGIazusy-1ZosqQ4A&s", // URL to the product image
      selectedSize: "M"
    },
    {
      id: 2,
      name: "Quần Jean Nữ",
      price: 300000, // VND
      qty: 1,
      cover: "https://bizweb.dktcdn.net/thumb/grande/100/419/932/products/ao-phong-3-soc-ke-trang-ed7483-01-laydown.jpg?v=1622122684113", // URL to the product image
      selectedSize: "S"
    }
  ];

  CartItem = exampleCartItems;
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here (e.g., send data to backend)
    console.log('Form submitted:', formData); 
  };

  // Calculate total price
  const totalPrice = CartItem.reduce(
    (total, item) => total + item.qty * item.price,
    0
  );

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <div className="checkout-page">
      <div className="container">
      <form onSubmit={handleSubmit} className="checkout-content">
          {/* Form Section */}
   
        <div className="checkout-info">
        <h2>Thông tin nhận hàng</h2>
            <div className="form-group">
    <input
        type="email"
        id="email"
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
        id="fullName"
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
        id="phoneNumber"
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
        id="address"
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
        id="city"
        name="city"
        value={formData.city}
        onChange={handleChange}
        required
        className="form-input"
    >
        <option value="">Chọn tỉnh thành</option> {/* Placeholder option */}
        <option value="Hà Nội">Hà Nội</option>
        <option value="Hồ Chí Minh">Hồ Chí Minh</option>
        <option value="Đà Nẵng">Đà Nẵng</option>
        <option value="Hải Phòng">Hải Phòng</option>
        <option value="Cần Thơ">Cần Thơ</option>
        <option value="An Giang">An Giang</option>
        <option value="Bà Rịa - Vũng Tàu">Bà Rịa - Vũng Tàu</option>
        <option value="Bắc Giang">Bắc Giang</option>
        <option value="Bắc Ninh">Bắc Ninh</option>
        <option value="Bến Tre">Bến Tre</option>
        <option value="Bình Định">Bình Định</option>
        <option value="Bình Dương">Bình Dương</option>
        <option value="Bình Thuận">Bình Thuận</option>
        <option value="Cà Mau">Cà Mau</option>
        <option value="Đắk Lắk">Đắk Lắk</option>
        <option value="Đắk Nông">Đắk Nông</option>
        <option value="Điện Biên">Điện Biên</option>
        <option value="Hà Giang">Hà Giang</option>
        <option value="Hà Nam">Hà Nam</option>
        <option value="Hà Tĩnh">Hà Tĩnh</option>
        <option value="Hòa Bình">Hòa Bình</option>
        <option value="Hưng Yên">Hưng Yên</option>
        <option value="Khánh Hòa">Khánh Hòa</option>
        <option value="Kiên Giang">Kiên Giang</option>
        <option value="Kon Tum">Kon Tum</option>
        <option value="Lai Châu">Lai Châu</option>
        <option value="Lạng Sơn">Lạng Sơn</option>
        <option value="Lào Cai">Lào Cai</option>
        <option value="Nam Định">Nam Định</option>
        <option value="Ninh Bình">Ninh Bình</option>
        <option value="Ninh Thuận">Ninh Thuận</option>
        <option value="Phú Thọ">Phú Thọ</option>
        <option value="Phú Yên">Phú Yên</option>
        <option value="Quảng Bình">Quảng Bình</option>
        <option value="Quảng Nam">Quảng Nam</option>
        <option value="Quảng Ngãi">Quảng Ngãi</option>
        <option value="Quảng Ninh">Quảng Ninh</option>
        <option value="Sóc Trăng">Sóc Trăng</option>
        <option value="Sơn La">Sơn La</option>
        <option value="Tây Ninh">Tây Ninh</option>
        <option value="Thái Bình">Thái Bình</option>
        <option value="Thái Nguyên">Thái Nguyên</option>
        <option value="Thanh Hóa">Thanh Hóa</option>
        <option value="Thừa Thiên - Huế">Thừa Thiên - Huế</option>
        <option value="Tiền Giang">Tiền Giang</option>
        <option value="Trà Vinh">Trà Vinh</option>
        <option value="Tuyên Quang">Tuyên Quang</option>
        <option value="Vĩnh Long">Vĩnh Long</option>
        <option value="Vĩnh Phúc">Vĩnh Phúc</option>
        <option value="Yên Bái">Yên Bái</option>
    </select>
</div>


<div className="form-group">
    <textarea
        type="text"
        id="notes"
        name="notes"
        value={formData.notes}
        onChange={handleChange}
        placeholder="Ghi chú (tùy chọn)"
        className="form-input"
        rows={3}
    ></textarea>
</div>
         
        </div>
        
        <div className="payment">
    <h2>Thanh toán</h2>
    <div className="payment-methods list-group">
        <div className="payment-option list-group-item">
            <input
                type="radio"
                id="bankTransfer"
                name="paymentMethod"
                value="bankTransfer"
                checked={formData.paymentMethod === 'bankTransfer'} 
                onChange={handleChange}
            />
            <div className="label-group"><label htmlFor="bankTransfer" className="payment-label">Chuyển khoản qua ngân hàng</label><i class="fa-solid fa-money-bill"></i></div>
        </div>
        <div className="payment-option list-group-item">
            <input
                type="radio"
                id="cashOnDelivery"
                name="paymentMethod"
                value="cashOnDelivery"
                checked={formData.paymentMethod === 'cashOnDelivery'} 
                onChange={handleChange}
            />
            <div className="label-group"><label htmlFor="cashOnDelivery" className="payment-label">Thanh toán khi giao hàng (COD)</label><i class="fa-solid fa-money-bill"></i></div>
        </div>
        {/* Add more payment methods similarly */}
    </div>
</div>

          {/* Order Summary Section */}
          <div className="order-summary">
            <h2>Đơn hàng</h2>
            <ul className="cart-items-list">
              {CartItem.map((item) => (
                <li key={item.id} className="cart-item">
                  <img src={item.cover} alt={item.name} className="item-image" />
                  <div className="item-details">
                    <span className="item-name">{item.name}</span>
                    <span className="item-size">Size: {item.selectedSize}</span> {/* Make sure selectedSize is passed correctly */}
                  </div>
                  <span className="item-price">{formatCurrency(item.price)} x{item.qty}</span>
                </li>
              ))}
            </ul>

            {/* Discount Section (Optional) */}
            <div className="discount-section">
              <input
                type="text"
                placeholder="Nhập mã giảm giá"
                className="discount-input"
              />
              <button className="apply-discount-btn">Áp dụng</button>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Tạm tính</span>
                <span className='price-right'>{formatCurrency(totalPrice)}</span>
              </div>
              {/* Add other price rows (e.g., shipping) if needed */}
              <div className="price-row">
                <span>Phí vận chuyển</span>
                <span className='price-right'>0</span> {/* Update with actual shipping cost */}
              </div>

              
            </div>

            <div className="total-price">
                <span>Tổng cộng</span>
                <span className='price-right'>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="checkout-button-group">
                <Link to="/cart" className="back-to-cart">
                <i class="fa-solid fa-chevron-left"></i> Quay về giỏ hàng
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