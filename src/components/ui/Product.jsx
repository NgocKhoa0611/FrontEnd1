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
      <div className="mtop m-2 rounded-lg shadow-md overflow-hidden">
      <div className="img relative w-full aspect-[4/3]">
        <Link to={`/product/${product_id}`} className="absolute top-0 left-0 right-0 bottom-0">
          <img 
            src={imageUrl} 
            alt={product_name} 
            className="w-full h-full object-cover"
          />
        </Link>
      </div>
        <div className="product-details mt-4">
          <h5 className="text-center text-sm font-medium truncate" style={{ margin: '0' }}>
            {product_name}
          </h5>
          <div>
            {price_promotion > 0 ? (
              <>
              <div className="flex justify-center w-full gap-4 mt-2">
                <h5 className="text-base text-red-500 font-semibold text-center">
                  {price_promotion.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
                </h5>
                <h5 className="text-base line-through text-gray-500 text-center">
                  {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
                </h5>
              </div>  
              </>
            ) : (
              <h5 className="text-base font-semibold text-center mt-2">
                {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
            )}
            <button onClick={addToCart} className="mt-1 w-full mt-2 px-5 bg-[#0f3460] text-white py-2">
              Thêm vào giỏ hàng  <i className="fa-solid fa-cart-plus ml-1 bg-"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
