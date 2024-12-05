import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../configs/varibles";
import axios from "axios";
import "./index.css";
import { useDispatch } from "react-redux";
import { addCartDetail } from '../../../redux/slices/cartslice';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state to display loading spinner
  const [product, setProduct] = useState({});
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get(`${API_URL}/product/${id}`)
      .then((response) => {
        console.log("Product fetched:", response.data);
        setProduct(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleDetailSelect = (detailId) => {
    setSelectedDetailId(detailId);
    const selectedDetail = product.detail.find(
      (detail) => detail.product_detail_id === detailId
    );
    setSelectedColor(selectedDetail?.color?.color_name || "");
    setSelectedSize(selectedDetail?.size?.size_name || "");
  };

  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const addToCart = async () => {
    const token = document.cookie
      .split(";")
      .find((cookie) => cookie.trim().startsWith("token="));

    if (!token) {
      alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
      return;
    }

    const selectedDetail = product.detail.find(
      (detail) => detail.product_detail_id === selectedDetailId
    );

    // Kiểm tra nếu `selectedDetailId` không hợp lệ
    if (!selectedDetail) {
      alert("Vui lòng chọn một chi tiết sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    try {
      // Gửi yêu cầu thêm vào giỏ hàng
      const newItem = {
        product_detail_id: selectedDetail.product_detail_id,
        quantity,
        size: selectedDetail.size.size_name,
        color: selectedDetail.color.color_name,
        img_url: selectedDetail.productImage.img_url,
        price: product.price,
        name: product.product_name,
      };

      console.log("newItem", newItem);

      // Gửi yêu cầu POST tới API để thêm vào giỏ hàng
      const response = await axios.post(
        "http://localhost:8000/cart/add",
        { newItem },
        { withCredentials: true }
      );

      // Cập nhật Redux store nếu thêm thành công
      if (response.status === 200) {
        dispatch(addCartDetail(newItem));
        alert(`${product.product_name} đã được thêm vào giỏ hàng.`);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
    }
  };


  const handleBuyNow = async () => {
    const selectedDetail = product.detail.find(
      (detail) =>
        detail.size.size_name === selectedSize &&
        detail.color.color_name === selectedColor
    );

    if (!selectedDetail) {
      alert("Vui lòng chọn kích thước và màu sắc trước khi mua hàng.");
      return;
    }
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
      const productData = productDetailResponse.data;
      const newItem =
      {
        product_detail_id: productDetail.product_detail_id,
        product_name: productData.product_name,
        price: productData.price,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
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

          <div className="options pb-4">
            <h4>Chọn Tùy Chọn:</h4>
            <select
              value={selectedDetailId}
              onChange={(e) => handleDetailSelect(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {product.detail.map((detail) => (
                <option
                  key={detail.product_detail_id}
                  value={detail.product_detail_id}
                >
                  {`Màu ${detail.color.color_name} - Size ${detail.size.size_name}`}
                </option>
              ))}
            </select>
          </div>


          <div className="buy-container">
            <h4>Số lượng:</h4>
            <div className="buy-column pb-2">
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
                <button className="add-to-cart" onClick={addToCart}>
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
