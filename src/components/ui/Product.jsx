import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Product({ shopItems = {} }) {
  const { product_id, product_name, price, price_promotion, detail = [] } = shopItems;
  const imageUrl = `http://localhost:8000/img/${detail[0]?.productImage?.img_url || 'default-image.jpg'}`;
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const navigate = useNavigate();

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Gửi yêu cầu lưu trạng thái yêu thích lên server nếu cần
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
          withCredentials: true,
        });
      if (response.status === 200) {
        alert(`${product_name} đã thêm vào giỏ hàng`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  return (
    <div className="box">
      <div className="m-2 rounded-lg shadow-md overflow-hidden bg-white">
        <div className="relative w-full aspect-[4/3]">
          {/* Hình ảnh sản phẩm */}
          <Link to={`/product/${product_id}`} className="absolute top-0 left-0 right-0 bottom-0">
            <img
              src={imageUrl}
              alt={product_name}
              className="w-full h-full object-cover"
            />
          </Link>
          {/* Icon yêu thích */}
          <div
            className="absolute top-2 right-2 bg-white p-2 rounded-full shadow-md cursor-pointer hover:scale-110 transition-transform"
            onClick={toggleFavorite}
          >
            <i
              className={`fa${isFavorite ? "s" : "r"} fa-heart text-red-500`}
              aria-hidden="true"
            ></i>
          </div>
        </div>
        <div className="product-details p-4">
          <h5 className="text-center text-sm font-medium truncate">{product_name}</h5>
          {price_promotion > 0 ? (
            <div className="flex justify-center items-center gap-4 mt-2">
              <h5 className="text-base text-red-500 font-semibold">
                {price_promotion.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
              <h5 className="text-base line-through text-gray-500">
                {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
            </div>
          ) : (
            <h5 className="text-base font-semibold text-center mt-2">
              {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
            </h5>
          )}
          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={addToCart}
              className="mt-1 w-full mt-2 px-5 bg-[#0f3460] text-white py-2"
            >
              Thêm vào giỏ hàng <i className="fa-solid fa-cart-plus ml-1"></i>
            </button>
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700 transition-colors"
            >
              Mua ngay <i className="fa-solid fa-bolt ml-1"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
