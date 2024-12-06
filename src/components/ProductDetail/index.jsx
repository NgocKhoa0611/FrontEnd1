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
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState(""); // State lưu bình luận mới
  const dispatch = useDispatch();

  useEffect(() => {
    // Lấy thông tin sản phẩm và bình luận
    const fetchData = async () => {
      try {
        const productResponse = await fetch(`${API_URL}/product/${id}`);
        const productData = await productResponse.json();
        setProduct(productData);
        setSelectedColor(productData.detail[0]?.color?.color_name || "");
        setSelectedSize(productData.detail[0]?.size?.size_name || "");

        const reviewsResponse = await fetch(`${API_URL}/review?product_detail_id=${id}`);
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);
  // const addToCartHandler = async () => {
  //   if (!product.product_name) {
  //     alert("Dữ liệu sản phẩm chưa được tải đầy đủ.");
  //     return;
  //   }
  //   const selectedDetail = product.detail.find(
  //     (detail) =>
  //       detail.size.size_name === selectedSize &&
  //       detail.color.color_name === selectedColor
  //   );

  //   if (!selectedDetail) {
  //     alert("Vui lòng chọn kích thước và màu sắc trước khi thêm vào giỏ hàng.");
  //     return;
  //   }

  //   const newItem = {
  //     product_detail_id: selectedDetail.product_detail_id,
  //     quantity,
  //   };
  //   console.log("Payload gửi lên API:", newItem);

  //   try {
  //     const token = document.cookie
  //       .split('; ')
  //       .find((cookie) => cookie.startsWith('token='))
  //       ?.split('=')[1];

  //     if (!token) {
  //       alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
  //       navigate("/login");
  //       return;
  //     }

  //     const response = await axios.post(
  //       "http://localhost:8000/cart/add",
  //       { newItem },
  //       { withCredentials: true }
  //     );

  //     if (response.status === 200) {
  //       const cartItem = {
  //         product_detail_id: response.data.product_detail_id,
  //         product_name: product.product_name,
  //         img_url: selectedDetail.productImage.img_url,
  //         size: selectedSize,
  //         color: selectedColor,
  //         price: product.price,
  //         quantity: newItem.quantity,
  //       };

  //       const newCartCount = currentCartCount + newItem.quantity;

  //       dispatch(addItemToCart(cartItem));
  //       dispatch(CartCount(newCartCount));

  //       toast.success("Thêm sản phẩm vào giỏ hàng thành công!"); // Use toast.success for success message
  //     } else {
  //       alert(response.data.message || "Không thể thêm sản phẩm vào giỏ hàng.");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi thêm sản phẩm vào giỏ hàng:", error);
  //     alert("Đã xảy ra lỗi khi thêm sản phẩm vào giỏ hàng.");
  //   }
  // };

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
  
  
  


  const addToCart = async () => {
    console.log('Product ID', product.product_id);
    const token = document.cookie.split(';').find(cookie => cookie.trim().startsWith('token='));
    if (!token) {
      alert("Bạn cần phải đăng nhập trước khi thêm sản phẩm vào giỏ hàng.");
      navigate("/login");
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

    try {
      const productDetailResponse = await axios.get(`http://localhost:8000/product/${product.product_id}`, {
        withCredentials: true,
      });


      const productDetail = productDetailResponse.data.detail[0];
      const productData = productDetailResponse.data
      const newItem = {
        product_detail_id: productDetail.product_detail_id,
        quantity: 1,
        size: selectedSize,
        color: selectedColor,
        img_url: productDetail.productImage.img_url,
        price: productData.price,
        name: productData.product_name
      };
      console.log('newItem', newItem);

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
        alert(`${productData.product_name} đã thêm vào giỏ hàng`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
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
                    src="https://via.placeholder.com/40"
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover mr-3"
                  />
                  <p className="font-semibold">{`User ${review.user_id}`}</p>
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
