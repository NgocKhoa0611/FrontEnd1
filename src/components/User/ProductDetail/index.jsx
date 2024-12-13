import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../../configs/varibles";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addCartDetail } from '../../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../../redux/slices/orderslice';
import { toast, Toaster } from 'react-hot-toast';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
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
        product_name: product.product_name,
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

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Detail Section */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Product Image */}
        <div className="lg:w-1/2">
          <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              src={`${API_URL}/img/${selectedDetail?.productImage?.img_url || "default_image.png"
                }`}
              alt={product.product_name}
            />
          </div>
        </div>

        {/* Product Info */}
        <div className="lg:w-1/2 space-y-6">
          <h1 className="text-2xl md:text-3xl font-bold">{product.product_name}</h1>

          <div className="text-xl md:text-2xl font-semibold text-red-600">
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(product.price)}
          </div>

          {/* Product Options */}
          <div className="space-y-4">
            <h4 className="font-medium">Chọn Tùy Chọn:</h4>
            <select
              value={selectedDetailId}
              onChange={(e) => handleDetailSelect(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {product.detail.map((detail) => (
                <option key={detail.product_detail_id} value={detail.product_detail_id}>
                  {`Màu ${detail.color.color_name} - Size ${detail.size.size_name}`}
                </option>
              ))}
            </select>
          </div>

          {/* Quantity Selector */}
          <div className="space-y-4">
            <h4 className="font-medium">Số lượng:</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <button
                  onClick={decrementQuantity}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  -
                </button>
                <span className="px-4 py-2 border-x">{quantity}</span>
                <button
                  onClick={incrementQuantity}
                  className="px-4 py-2 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleBuyNow}
              className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Mua Ngay
            </button>
            <button
              onClick={addToCart}
              className="flex-1 bg-[#0f3460] border-2 text-white py-3 rounded-lg hover:bg-[#072344] transition-all duration-200"
            >
              Thêm vào giỏ hàng
            </button>
          </div>

          {/* Product Description */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Thông tin sản phẩm</h3>
            <p className="text-gray-600">
              {product.detail[0]?.description || "Chưa có mô tả"}
            </p>
          </div>

          {/* Contact Info */}
          <div className="border-t pt-6">
            <div className="space-y-3">
              <p className="font-medium">GỌI ĐỂ MUA HÀNG NHANH HƠN</p>
              <h2 className="text-xl font-bold">0123456789</h2>
              <p className="flex items-center gap-2 text-gray-600">
                <i className="fa-solid fa-truck-fast"></i>
                Chính sách bán hàng
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-12">
        <h3 className="text-xl font-bold mb-6">Bình luận</h3>

        {/* Comment Form */}
        <div className="mb-8">
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="w-full p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 min-h-[100px]"
          ></textarea>
          <button
            onClick={handleSendComment}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Gửi bình luận
          </button>
        </div>

        {/* Comments List */}
        <div className="space-y-6">
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review.review_id} className="border-b pb-6">
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={`${API_URL}/avatar/${review?.user.avatar}`}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold">{review?.user.name}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(review?.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="text-gray-700">{review.content}</p>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Chưa có bình luận nào</p>
          )}
        </div>
      </div>

      <Toaster position="top-center" />
    </div>
  );
};

export default ProductDetails;