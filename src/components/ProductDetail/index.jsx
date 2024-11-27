import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../configs/varibles";
import axios from "axios";
import "./index.css";
import { useDispatch } from "react-redux";
import { addItemToCart, CartCount } from '../../../redux/slices/cartslice';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state to display loading spinner
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  const dispatch = useDispatch();
  const currentCartCount = useSelector((state) => state.cart.cartCount || 0);

  useEffect(() => {
    axios
      .get(`${API_URL}/product/${id}`)
      .then((response) => {
        console.log("Product fetched:", response.data);
        setProduct(response.data);
        setSelectedColor(response.data.detail[0]?.color?.color_name || "");
        setSelectedSize(response.data.detail[0]?.size?.size_name || "");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const addToCartHandler = async () => {
    if (!product.product_name) {
      alert("Dữ liệu sản phẩm chưa được tải đầy đủ.");
      return;
    }
    const selectedDetail = product.detail.find(
      (detail) =>
        detail.size.size_name === selectedSize &&
        detail.color.color_name === selectedColor
    );

    if (!selectedDetail) {
      alert("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.");
      return;
    }

    const newItem = {
      product_detail_id: selectedDetail.product_detail_id,
      quantity,
    };
    console.log("Payload gửi lên API:", newItem);

    try {
      const token = document.cookie
        .split('; ')
        .find((cookie) => cookie.startsWith('token='))
        ?.split('=')[1];

      if (!token) {
        alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
        navigate("/login");
        return;
      }

      const response = await axios.post(
        "http://localhost:8000/cart/add",
        { newItem },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const cartItem = {
          product_detail_id: response.data.product_detail_id,
          product_name: product.product_name,
          img_url: selectedDetail.productImage.img_url,
          size: selectedSize,
          color: selectedColor,
          price: product.price,
          quantity: newItem.quantity,
        };

        const newCartCount = currentCartCount + newItem.quantity;

        dispatch(addItemToCart(cartItem));
        dispatch(CartCount(newCartCount));

        toast.success("Thêm sản phẩm vào giỏ hàng thành công!"); // Use toast.success for success message
      } else {
        alert(response.data.message || "Không thể thêm sản phẩm vào giỏ hàng.");
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleBuyNow = () => {
    const selectedDetail = product.detail.find(
      (detail) =>
        detail.size.size_name === selectedSize &&
        detail.color.color_name === selectedColor
    );

    if (!selectedDetail) {
      alert("Vui lòng chọn kích thước và màu sắc trước khi mua hàng.");
      return;
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      {/* Product Detail */}
      <div className="product-detail-top">
        <div className="product-image">
          <img
            src={`${API_URL}/img/${product.detail[0]?.productImage?.img_url}`}
            alt={product.product_name}
          />
        </div>

        <div className="product-info">
          <h1>{product.product_name}</h1>
          <p className="price">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </p>

          <div className="options">
            <div className="size-selection">
              <h4>Kích thước:</h4>
              {product.detail.map((detail) => (
                <button
                  key={detail.size.size_name}
                  onClick={() => handleSizeSelect(detail.size.size_name)}
                  className={`${selectedSize === detail.size.size_name
                    ? "bg-blue-500 text-black"
                    : "bg-gray-200 text-black"
                    } p-2 m-1 rounded`}
                >
                  {detail.size.size_name}
                </button>
              ))}
            </div>
            <div className="color-selection">
              <h4>Màu Sắc:</h4>
              {product.detail.map((detail) => (
                <button
                  key={detail.color.color_id}
                  onClick={() => handleColorSelect(detail.color.color_name)}
                  className={`${selectedColor === detail.color.color_name
                    ? "bg-blue-500 text-black"
                    : "bg-gray-200 text-black"
                    } p-2 m-1 rounded`}
                >
                  {detail.color.color_name}
                </button>
              ))}
            </div>
          </div>

          <div className="buy-container">
            <h4>Số lượng:</h4>
            <div className="buy-column">
              <div className="quantity-selector">
                <button className="decrement" onClick={decrementQuantity}>
                  -
                </button>
                <span className="quantity">{quantity}</span>
                <button className="increment" onClick={incrementQuantity}>
                  +
                </button>
              </div>
              <div className="buttons">
                <button className="buy-now" onClick={handleBuyNow}>
                  Mua Ngay
                </button>
                <button className="add-to-cart" onClick={addToCartHandler}>
                  Thêm giỏ hàng
                </button>
              </div>
            </div>

            <div className="product-description">
              <h3>Thông tin sản phẩm</h3>
              <p>{product.detail[0]?.description || "No description available"}</p>
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

      {/* Comments Section */}
      <div className="content-cmt mt-10 px-5">
        <h3 className="text-xl font-semibold">Bình luận</h3>
        <div className="comment-form mt-5">
          <textarea
            placeholder="Thêm bình luận..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none">
            Gửi
          </button>
        </div>

        <div className="comments-list mt-5">
          {product.comments && product.comments.length > 0 ? (
            product.comments.map((comment, index) => (
              <div key={index} className="comment-item mb-6">
                <div className="comment-header flex items-center mb-3">
                  <img
                    src={comment.user.avatar || "https://via.placeholder.com/40"}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <p className="font-semibold">{comment.user.name}</p>
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            ))
          ) : (
            <p>Chưa có bình luận nào</p>
          )}
        </div>
      </div>

      {/* Toast container */}
      <Toaster position="top-center" />
    </div>
  );
};

export default ProductDetails;
