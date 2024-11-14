import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Product({ shopItems = {} }) {
  const { product_id, product_name, price, price_promotion, detail = [] } = shopItems;
  const imageUrl = `http://localhost:8000/img/${detail[0]?.productImage?.img_url || 'default-image.jpg'}`;
  const [cart, setCart] = useState(null);
  const navigate = useNavigate();

  const getCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cart', {
        withCredentials: true,
      });
      console.log('Cart items:', response.data.cart);
      setCart(response.data.cart);
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
      console.error('Error fetching cart:', errorMessage);
    }
  };
  const addToCart = async () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (!token) {
      alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8000/cart/add',
        {
          product_id,
          quantity: 1,
        },
        {
          withCredentials: true,  // Đảm bảo cookie sẽ được gửi cùng với yêu cầu
        });
      if (response.status === 200) {
        alert(`${product_name} đã thêm vào giỏ hàng`);
      }
      getCart()
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="box">
      <div className="product mtop">
        <div className="img">
          <Link className="" to={`/product/${product_id}`}>
            <img src={imageUrl} alt={product_name} className="w-full h-full object-cover" />
          </Link>
        </div>
        <div className="product-details">
          <h5 className="text-center text-sm font-medium truncate" style={{ margin: '0' }}>
            {product_name}
          </h5>
          <div className="price">
            {price_promotion > 0 ? (
              <>
                <h5 className="text-base line-through text-gray-500">
                  {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
                </h5>
                <h5 className="text-base text-red-500 font-semibold">
                  {price_promotion.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
                </h5>
              </>
            ) : (
              <h5 className="text-base font-semibold">
                {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
            )}
            <button onClick={addToCart} className="mt-1">
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
