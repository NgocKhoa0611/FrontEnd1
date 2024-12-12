import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../../configs/varibles";
import axios from "axios";
import "./index.css";
import { useDispatch } from "react-redux";
import { addCartDetail } from '../../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../../redux/slices/orderslice';
import { useSelector } from 'react-redux';
import { toast, Toaster } from 'react-hot-toast'; // Import toast

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state to display loading spinner
  const [product, setProduct] = useState({});
  const [selectedDetailId, setSelectedDetailId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    axios
    fetch(`${API_URL}/product/${id}`)
      .then(response => response.json())
      .then(data => {
        setProduct(data);
        setSelectedDetailId(data.detail[0].product_detail_id);
      })
      .catch(error => {
        console.error("Error fetching product:", error);
      })
      .finally(() => {
        setLoading(false);
      });
    fetch(`${API_URL}/review/${id}`)  // API lấy bình luận
      .then(response => response.json())
      .then(data => {
        setReviews(data);  // Lưu bình luận vào state
      })
      .catch(error => {
        console.error("Error fetching reviews:", error);
      });
  }, [id]);

  const handleDetailSelect = (detailId) => {
    setSelectedDetailId(detailId);
  };
  console.log("Selected Detail ID (Add to Cart):", selectedDetailId);
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
      (detail) => detail.product_detail_id == selectedDetailId
    );

    // Validate that a product detail is selected
    if (!selectedDetail) {
      alert("Vui lòng chọn một chi tiết sản phẩm trước khi thêm vào giỏ hàng.");
      return;
    }

    try {
      const newItem = {
        product_detail_id: selectedDetail.product_detail_id,
        quantity,
        size: selectedDetail.size.size_name,
        color: selectedDetail.color.color_name,
        img_url: selectedDetail.productImage.img_url,
        price: product.price,
        name: product.product_name,
      };

      // Send POST request to add item to cart
      const response = await axios.post(
        "http://localhost:8000/cart/add",
        { newItem },
        { withCredentials: true }
      );

      // Update Redux store if successful
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
      (detail) => detail.product_detail_id === selectedDetailId
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
      const newItem = {
        product_detail_id: selectedDetail.product_detail_id,
        quantity,
        size: selectedDetail.size.size_name,
        color: selectedDetail.color.color_name,
        img_url: selectedDetail.productImage.img_url,
        price: product.price,
        name: product.product_name,
      };

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

  const handleSendComment = async () => {
    if (!comment.trim()) {
      toast.error("Bình luận không được để trống!");
      return;
    }

    // Kiểm tra token và lấy user_id từ cookie
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (!token) {
      alert("Bạn cần đăng nhập để bình luận!");
      navigate("/login"); // Điều hướng người dùng đến trang đăng nhập nếu chưa có token
      return;
    }

    // Giải mã token để lấy user_id
    const payload = JSON.parse(atob(token.split('.')[1]));
    const userId = payload.id; // Lấy user_id từ payload (kiểm tra lại payload của token)

    if (!userId) {
      alert("Không tìm thấy thông tin người dùng!");
      return;
    }

    try {
      const newReview = {
        content: comment,
        date: new Date().toISOString(),
        product_detail_id: id, // Bạn cần đảm bảo `id` là id chi tiết sản phẩm hiện tại
        user_id: userId, // Thêm user_id vào đây
      };

      const response = await axios.post(`${API_URL}/review`, newReview, {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token để xác thực
        },
      });

      if (response.status === 201) {
        setReviews((prev) => [response.data.review, ...prev]); // Cập nhật danh sách bình luận
        setComment(""); // Reset khung nhập
        toast.success("Gửi bình luận thành công!");
      }
    } catch (error) {
      console.error("Error sending comment:", error);
      toast.error("Gửi bình luận thất bại!");
    }
  };

  const selectedDetail = product.detail?.find(
    (detail) => detail.product_detail_id === Number(selectedDetailId)
  );
  console.log('detail: ', selectedDetail);


  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      {/* Product Detail */}
      <div className="product-detail-top">
        <div className="product-image">
          <img
            src={`${API_URL}/img/${selectedDetail?.productImage?.img_url || "default_image.png"
              }`}
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
                <option key={detail.product_detail_id} value={detail.product_detail_id}>
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
      <div className="comments-section mt-5">
        <h3>Bình luận</h3>
        <div className="comment-form mt-5">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full p-3 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
          <button
            onClick={handleSendComment}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Gửi
          </button>
        </div>

        <div className="comments-list mt-5">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className="comment-item mb-6">
                <div className="comment-header flex items-center mb-3">
                  <img
                    src={`${API_URL}/avatar/${review.user.avatar}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <p className="font-semibold">{`${review.user.name}`}</p>
                  <span className="text-gray-500 text-sm ml-2">
                    {new Date(review.date).toLocaleString()}
                  </span>
                </div>
                <p className="comment-text">{review.content}</p>
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