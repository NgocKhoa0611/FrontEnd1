import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { updateItemQuantity, CartCount, removeItemFromCart } from '../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../redux/slices/orderslice';
import { } from '../../../redux/slices/cartslice';
import { useSelector } from 'react-redux';

const Cart = () => {
  const [cart, setCart] = useState({ cartDetail: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentCartCount = useSelector((state) => state.cart.cartCount || 0);

  useEffect(() => {
    const getCart = async () => {
      try {
        const response = await axios.get('http://localhost:8000/cart', {
          withCredentials: true,
        });
        console.log('Cart items:', response.data.cart);
        setCart(response.data.cart || { cartDetail: [] });
        setLoading(false);
      } catch (error) {
        const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
        console.error('Error fetching cart:', errorMessage);
        setLoading(false);
      }
    };
    getCart();
  }, []);

  useEffect(() => {
    const { subtotal, voucher, total } = calculateTotal();
    console.log('Updated totals:', { subtotal, voucher, total });
  }, [selectedProducts]);


  const handleCheckboxChange = (cartDetail) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (product) => product.cart_detail_id === cartDetail.cart_detail_id
      );

      const updatedSelectedProducts = isAlreadySelected
        ? prevSelected.filter(
          (product) => product.cart_detail_id !== cartDetail.cart_detail_id
        )
        : [
          ...prevSelected,
          {
            ...cartDetail,
            ...cartDetail.ProductDetail,
            ...cartDetail.ProductDetail.product,
          },
        ];

      const subtotal = updatedSelectedProducts.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      );

      const voucher = 0;
      const totalAmount = subtotal + voucher;

      // Cập nhật Redux store
      dispatch(
        setSelectedItems({
          selectedItems: updatedSelectedProducts,
          totalAmount,
        })
      );

      return updatedSelectedProducts;
    });
  };

  const calculateTotal = () => {
    if (!selectedProducts || selectedProducts.length === 0) return { subtotal: 0, voucher: 0, total: 0 };

    const subtotal = selectedProducts.reduce((acc, productDetail) => {
      return acc + (productDetail.price || 0) * (productDetail.quantity || 1); // Assuming quantity is available
    }, 0);

    const voucher = 0; // Update this with voucher logic if needed
    return { subtotal, voucher, total: subtotal + voucher };
  };

  const { subtotal, voucher, total } = calculateTotal();

  const handleIncrease = async (product_detail_id) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/cart/increase",
        { product_detail_id },
        { withCredentials: true }
      );

      if (response.data.cartDetail) {
        const updatedQuantity = response.data.cartDetail.quantity;

        // Lấy số lượng hiện tại từ cart state hoặc Redux store
        const existingItem = cart.cartDetail.find(item => item.product_detail_id === product_detail_id);
        const existingItemQuantity = existingItem ? existingItem.quantity : 0;

        // Tính chênh lệch
        const quantityDifference = updatedQuantity - existingItemQuantity;

        // Dispatch cập nhật số lượng cho Redux store
        dispatch(updateItemQuantity({
          product_detail_id: response.data.cartDetail.product_detail_id,
          quantity: updatedQuantity,
        }));

        // Cập nhật tổng số lượng sản phẩm
        dispatch(CartCount(currentCartCount + quantityDifference));

        // Cập nhật giỏ hàng trong component state
        setCart((prevCart) => ({
          ...prevCart,
          cartDetail: prevCart.cartDetail.map(item =>
            item.cart_detail_id === response.data.cartDetail.cart_detail_id
              ? { ...item, quantity: updatedQuantity }
              : item
          ),
        }));

        // Đồng bộ danh sách sản phẩm đã chọn
        setSelectedProducts((prevSelected) =>
          prevSelected.map(product =>
            product.cart_detail_id === response.data.cartDetail.cart_detail_id
              ? { ...product, quantity: updatedQuantity }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error increasing quantity:", error.response?.data || error.message);
      alert("Không thể tăng số lượng sản phẩm.");
    }
  };

  const handleDecrease = async (product_detail_id) => {
    try {
      const response = await axios.put(
        "http://localhost:8000/cart/decrease",
        { product_detail_id },
        { withCredentials: true }
      );

      if (response.data.cartDetail) {
        const updatedQuantity = response.data.cartDetail.quantity;

        // Lấy số lượng hiện tại của sản phẩm trong giỏ
        const existingItem = cart.cartDetail.find(item => item.product_detail_id === product_detail_id);
        const existingItemQuantity = existingItem ? existingItem.quantity : 0;

        // Tính chênh lệch
        const quantityDifference = updatedQuantity - existingItemQuantity;

        // Dispatch cập nhật số lượng cho Redux store
        dispatch(updateItemQuantity({
          product_detail_id: response.data.cartDetail.product_detail_id,
          quantity: updatedQuantity,
        }));

        // Cập nhật tổng số lượng sản phẩm
        dispatch(CartCount(currentCartCount + quantityDifference));

        // Cập nhật giỏ hàng trong component state
        setCart((prevCart) => ({
          ...prevCart,
          cartDetail: prevCart.cartDetail.map(item =>
            item.cart_detail_id === response.data.cartDetail.cart_detail_id
              ? { ...item, quantity: updatedQuantity }
              : item
          ),
        }));

        // Đồng bộ danh sách sản phẩm đã chọn
        setSelectedProducts((prevSelected) =>
          prevSelected.map(product =>
            product.cart_detail_id === response.data.cartDetail.cart_detail_id
              ? { ...product, quantity: updatedQuantity }
              : product
          )
        );
      }
    } catch (error) {
      console.error("Error decreasing quantity:", error.response?.data || error.message);
      alert("Không thể giảm số lượng sản phẩm.");
    }
  };

  const handleRemove = async (product_detail_id) => {
    // Confirm the deletion with the user first
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    if (!confirmDelete) {
      return; // If the user cancels, exit the function
    }

    try {
      console.log('Removing product with ID:', product_detail_id);

      const response = await axios.delete(`http://localhost:8000/cart/${product_detail_id}`, {
        withCredentials: true
      });

      if (response.status === 200) {
        dispatch(removeItemFromCart(product_detail_id));
        const updatedCartResponse = await axios.get('http://localhost:8000/cart', {
          withCredentials: true
        });

        setCart(updatedCartResponse.data.cart);

        const updatedCartCount = cart.cartDetail.reduce(
          (total, item) =>
            total +
            (item.ProductDetail.product_detail_id === product_detail_id
              ? 0 // Bỏ sản phẩm vừa xóa
              : item.quantity),
          0
        );
        dispatch(CartCount(updatedCartCount));

        alert("Sản phẩm đã được xóa khỏi giỏ hàng!");
      } else {
        console.warn('Unexpected response:', response.data);
        alert("Đã xảy ra lỗi khi xóa sản phẩm. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error removing product from cart:", error.response?.data || error.message);

      if (error.response) {
        const errorMessage = error.response.data?.message || "Không thể xóa sản phẩm.";
        alert(errorMessage);
      } else {
        alert("Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.");
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!cart || !cart.cartDetail || cart.cartDetail.length === 0) {
    return (
      <div className="flex justify-center items-center flex-col py-12">
        <img
          src="../../../public/shopping.png"
          alt="Empty Cart"
          className="w-64 h-64 mb-6" // Adjusted size to w-64 h-64
        />
        <p className="text-xl text-gray-700">Giỏ hàng của bạn chưa có sản phẩm nào.</p>
      </div>
    );

  }


  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-700">Giỏ hàng</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left font-semibold py-4 text-gray-600">Chọn</th>
                    <th className="text-center font-semibold py-4 text-gray-600">Sản phẩm</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Giá</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Số lượng</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Tổng cộng</th>
                    <th className="text-left font-semibold py-4 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartDetail.map((item) => (
                    <tr className="border-b" key={item.cart_detail_id}>
                      <td className="py-4">
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(
                            (product) => product.cart_detail_id === item.cart_detail_id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>

                      <td className="py-4">
                        <div className="flex items-center">
                          <img
                            className="h-24 w-24 rounded-md mr-4 border"
                            src={`http://localhost:8000/img/${item.ProductDetail.productImage?.img_url}`}
                            alt={item.ProductDetail.product.product_name}
                          />
                          <span className="font-semibold text-gray-700">{item.ProductDetail.product.product_name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 text-gray-600">{item.ProductDetail.product.price.toLocaleString()}₫</td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center border border-gray-300 rounded-md w-24">
                          <button
                            onClick={() => handleDecrease(item.ProductDetail.product_detail_id)}
                            className="py-2 px-2 text-gray-700 hover:bg-gray-200 transition"
                            disabled={item.quantity <= 1}
                          >
                            -
                          </button>
                          <span className="text-center w-12 border-l border-r border-gray-500 py-2 text-gray-700">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => handleIncrease(item.ProductDetail.product_detail_id)}
                            className="py-2 px-2 text-gray-700 hover:bg-gray-200 transition"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="py-4 px-2 text-gray-600">{(item.ProductDetail.product.price * item.quantity).toLocaleString()}₫</td>
                      <td className="py-4">
                        <button
                          onClick={() => handleRemove(item.ProductDetail.product_detail_id)}
                          className="text-red-500 hover:text-red-700 transition"
                        >
                          Xóa
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">Chi tiết thanh toán</h2>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Tạm tính</span>
                <span>{subtotal.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Voucher</span>
                <span>{voucher.toLocaleString()}₫</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Tổng cộng</span>
                <span>{total.toLocaleString()}₫</span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                className="bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg mt-6 w-full hover:bg-blue-600 transition"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
