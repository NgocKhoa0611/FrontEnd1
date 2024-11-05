import React, { useState } from "react";
// eslint-disable-next-line no-unused-vars
import { Link, useNavigate } from "react-router-dom";
import "./index.css";

const ProductDetails = ({ product = {} }) => {
  const {
    image = "https://bizweb.dktcdn.net/thumb/1024x1024/100/448/660/products/image1685004991851-375d0df6-8520-4f33-935f-dca1a2b4ac3a.png?v=1689517174680",
    title = "Áo T-Shirts BONIK Authentic White",
    price = 295000,
    description = "Áo Thun của Bonik là một sự kiết hợp hoàn hảo giữa phong cách năng động và thoải mái. Dược làm từ chất liệu thun gân co giãn, áo mang đến cảm giác êm ái và linh hoạt cho cơ thể. Đường may viền chắc chắn và ấn tượng giúp áo luôn giữ form và tạo điểm nhấn thời trang.",
  } = product;

  const colorOptions = [
    { name: 'White', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/660/products/image1685004991851-375d0df6-8520-4f33-935f-dca1a2b4ac3a.png?v=1689517174680' },
    { name: 'Black', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/660/products/image1685004991851-375d0df6-8520-4f33-935f-dca1a2b4ac3a.png?v=1689517174680' },
    { name: 'Blue', image: 'https://bizweb.dktcdn.net/thumb/1024x1024/100/448/660/products/image1685004991851-375d0df6-8520-4f33-935f-dca1a2b4ac3a.png?v=1689517174680' },
  ];
  
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("White");
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = () => {
    // Logic for adding product to cart (e.g., updating cart state or localStorage)
    console.log("Product added to cart", { product, selectedSize, selectedColor, quantity });
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  return (
    <div className="product-detail">
      <div className="product-detail-top">
        <div className="product-image">
          <img src={image} alt={title} />
          <div className="product-description">
            <h3>Thông tin sản phẩm</h3>
            <p>{description}</p>
          </div>
        </div>

        <div className="product-info">
          <h1>{title}</h1>
          <p className="price">
            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
          </p>

          <div className="options">
            <div className="size-selection">
              <h4>Kích thước:</h4>
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
className={selectedSize === size ? "active" : ""}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="color-selection">
              <h4>Màu Sắc:</h4>
              <div className="color-options">
                {colorOptions.map((option) => (
                  <button
                    key={option.name} 
                    onClick={() => handleColorSelect(option.name)} 
                    className={`color-button ${selectedColor === option.name ? 'active' : ''}`}
                  >
                    <img src={option.image} alt={option.name} className="color-image" />
                    <span className="color-name">{option.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="buy-container">
            <h4>Số lượng:</h4>
            <div className="buy-column">
              <div className="quantity-selector"> 
                <button className="decrement" onClick={decrementQuantity}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="increment" onClick={incrementQuantity}>+</button>
              </div>
              <div className="buttons">
                <button className="buy-now" onClick={handleBuyNow}>Mua Ngay</button>
                <button className="add-to-cart" onClick={handleAddToCart}>Thêm giỏ hàng</button>
              </div>
            </div>
          </div>

          <div className="contact-info">
            <p>GỌI ĐỂ MUA HÀNG NHANH HƠN</p>
            <h2>0123456789</h2>
            <p>Chính sách bán hàng</p>
            <p>
              <i className="fa-solid fa-truck-fast"></i> Chính sách bán hàng 
            </p> 
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;