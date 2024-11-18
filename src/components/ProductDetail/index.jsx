import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../configs/varibles";
import axios from "axios";
import "./index.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state to display loading spinner
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product data by ID
  useEffect(() => {
    axios
      .get(`${API_URL}/product/${id}`)
      .then((response) => {
        console.log("Product fetched:", response.data);
        setProduct(response.data);
        // Set default selected color if available
        setSelectedColor(response.data.detail[0]?.color?.color_name || "");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleAddToCart = async () => {
    const cartItem = {
      product_id: product._id,  // ID sản phẩm
      size: selectedSize,       // Kích thước đã chọn
      color: selectedColor,     // Màu sắc đã chọn
      quantity: quantity,       // Số lượng đã chọn
    };
  
    try {
      const response = await axios.post("http://localhost:8000/cart/add", cartItem, { withCredentials: true });
      console.log("Product added to cart:", response.data);
      alert("Sản phẩm đã được thêm vào giỏ hàng!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Không thể thêm sản phẩm vào giỏ hàng.");
    }
  };

  const handleBuyNow = () => {
    navigate("/checkout");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <div className="product-detail-top">
        <div className="product-image">
          <img src={`${API_URL}/img/${product.detail[0]?.productImage?.img_url}`} alt={product.product_name} />

        </div>

        <div className="product-info">
          <h1>{product.product_name}</h1>
          <p className="price">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
          </p>

          <div className="options">
          <div className="size-selection">
            <h4>Kích thước:</h4>
            {["S", "M", "L", "XL"].map((size) => (
              <button
                key={size}
                onClick={() => handleSizeSelect(size)}
                className={`${
                  selectedSize === size ? "bg-blue-500 text-black" : "bg-gray-200 text-black"
                } p-2 m-1 rounded`}
              >
                {size}
              </button>
            ))}
          </div>
            <div className="color-selection">
              <h4>Màu Sắc:</h4>
              <div className="color-options">
                {product.detail.map((detail) => (
                  <button
                    key={detail.color.color_id}
                    onClick={() => handleColorSelect(detail.color.color_name)}
                    className={`color-button ${selectedColor === detail.color.color_name ? "active" : ""}`}
                  >
                    <span className="color-name">{detail.color.color_name}</span>
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
              className="w-10 h-10 rounded-full mr-4"
            />
            <div className="comment-user flex flex-col">
              <span className="font-semibold text-sm">{comment.user.name}</span>
              <span className="text-xs text-gray-500">{comment.timestamp}</span>
            </div>
          </div>
          <p className="comment-text text-sm text-gray-800 mb-3">{comment.text}</p>

          <div className="comment-actions flex items-center">
            <button className="like-btn text-blue-600 hover:text-blue-700 text-sm flex items-center mr-5">
              <i className="fa fa-thumbs-up mr-2"></i> {comment.likes}
            </button>
            <button className="reply-btn text-blue-600 hover:text-blue-700 text-sm flex items-center">
              <i className="fa fa-reply mr-2"></i> Trả lời
            </button>
          </div>

          {/* Nếu có trả lời, hiển thị chúng */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="replies mt-4 pl-10">
              {comment.replies.map((reply, idx) => (
                <div key={idx} className="reply-item mb-4">
                  <div className="reply-header flex items-center mb-2">
                    <img
                      src={reply.user.avatar || "https://via.placeholder.com/40"}
                      alt="User Avatar"
                      className="w-8 h-8 rounded-full mr-3"
                    />
                    <div className="reply-user flex flex-col">
                      <span className="font-semibold text-xs">{reply.user.name}</span>
                      <span className="text-xs text-gray-500">{reply.timestamp}</span>
                    </div>
                  </div>
                  <p className="reply-text text-xs text-gray-700">{reply.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))
    ) : (
      <p className="text-gray-500">Chưa có bình luận nào.</p>
    )}
  </div>
  
</div>


    </div>
  );
};

export default ProductDetails;
