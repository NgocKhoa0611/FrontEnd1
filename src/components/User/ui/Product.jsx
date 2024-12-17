import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { addCartDetail } from '../../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../../redux/slices/orderslice';
import { useDispatch } from "react-redux";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';

export default function Product({ shopItems = {} }) {
  const { product_id, product_name, price, price_promotion, detail = [] } = shopItems;
  const imageUrl = `http://localhost:8000/img/${detail[0]?.productImage?.img_url || 'default-image.jpg'}`;
  const [isFavorite, setIsFavorite] = useState(false); // Trạng thái yêu thích
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  const addToCart = async () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (!token) {
      alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    try {
      const productDetailResponse = await axios.get(`http://localhost:8000/product/${product_id}`, {
        withCredentials: true,
      });
      const productDetail = productDetailResponse.data.detail[0];
      const product = productDetailResponse.data
      const newItem = {
        product_detail_id: productDetail.product_detail_id,
        quantity: 1,
        size: productDetail.size.size_name,
        color: productDetail.color.color_name,
        img_url: productDetail.productImage.img_url,
        price: product.price,
        name: product.product_name
      };
      console.log('newItem', newItem);

      // Check if the product is primary (is_primary = 1)
      if (productDetail?.is_primary !== true) {
        alert("Sản phẩm này không phải là sản phẩm chính. Không thể thêm vào giỏ hàng.");
        return;
      }

      const response = await axios.post('http://localhost:8000/cart/add', {
        newItem,
      }, {
        withCredentials: true,
      });
      dispatch(addCartDetail(newItem))
      if (response.status === 200) {
        alert(`${product_name} đã thêm vào giỏ hàng`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };
  const buyNow = async () => {
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (!token) {
      alert("Bạn cần phải đăng nhập trước khi mua sản phẩm.");
      navigate("/login");
      return;
    }

    try {
      const productDetailResponse = await axios.get(`http://localhost:8000/product/${product_id}`, {
        withCredentials: true,
      });
      const productDetail = productDetailResponse.data.detail[0];
      const product = productDetailResponse.data;
      const newItem =
      {
        product_detail_id: productDetail.product_detail_id,
        product_name: product.product_name,
        price: product.price,
        quantity: 1,
        size: productDetail.size.size_name,
        color: productDetail.color.color_name,
        img_url: productDetail.productImage.img_url,
      }
        ;

      if (productDetail?.is_primary !== true) {
        alert("Sản phẩm này không phải là sản phẩm chính. Không thể thêm vào giỏ hàng.");
        return;
      }
      const response = await axios.post('http://localhost:8000/cart/add', {
        newItem,
      }, {
        withCredentials: true,
      });
      dispatch(addCartDetail(newItem))


      if (response.status === 200) {
        dispatch(setSelectedItems([newItem]));
        navigate('/checkout');
      }
    } catch (error) {
      console.error('Error buying now:', error);
    }
  };

  return (
    <div className="box">
      <div className="m-2 rounded-lg shadow-md overflow-hidden bg-white">
        <div className="relative w-full aspect-[4/3]">
          {/* Hình ảnh sản phẩm */}
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
              <Link to={`/product/${product_id}`} className="">
                <h5 className="text-center text-sm font-medium truncate">{product_name}</h5>
              </Link>
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
              <div className="flex justify-between items-center mt-4 gap-4">
                <button
                  onClick={addToCart}
                  className="px-6 py-2 bg-[#0f3460] text-white rounded-lg hover:bg-[#072344] transition-all duration-200 flex items-center justify-center"
                  title="Thêm giỏ hàng"
                >
                  <FontAwesomeIcon icon={faCartPlus} className="w-6 h-6" />
                </button>
                <button
                  onClick={buyNow}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 flex items-center justify-center"
                  title="Mua ngay"
                >
                  Mua ngay
                </button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}