import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { updateCartDetail, removeItemFromCart, setCartItems } from '../../../../redux/slices/cartslice';
import { setSelectedItems } from '../../../../redux/slices/orderslice';
import { } from '../../../../redux/slices/cartslice';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

const Cart = () => {
  const [cart, setCart] = useState({ cartDetail: [] });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const totalPrice = useSelector((state) => state.order.totalPrice);
  const voucher = 0;
  const reduxSelectedProducts = useSelector((state) => state.order.selectedItems);

  useEffect(() => {
    setSelectedProducts(reduxSelectedProducts || []);
  }, [reduxSelectedProducts]);

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

  const handleCheckboxChange = (cartDetail) => {
    setSelectedProducts((prevSelected) => {
      const isAlreadySelected = prevSelected.some(
        (product) => product.cart_detail_id === cartDetail.cart_detail_id
      );
      console.log('ProductDetail:', cartDetail.ProductDetail);

      const updatedSelectedProducts = isAlreadySelected
        ? prevSelected.filter(
          (product) => product.cart_detail_id !== cartDetail.cart_detail_id
        )
        : [
          ...prevSelected,
          {
            cart_detail_id: cartDetail.cart_detail_id,
            product_detail_id: cartDetail.product_detail_id,
            product_name: cartDetail.ProductDetail?.product?.product_name || '',
            price: cartDetail.ProductDetail?.product?.price || 0,
            quantity: cartDetail.quantity || 1,
            size: cartDetail.ProductDetail?.size?.size_name,
            color: cartDetail.ProductDetail?.color?.color_name,
            img_url: cartDetail.ProductDetail?.productImage?.img_url || '',
          },
        ];

      // Cập nhật Redux store
      console.log(updatedSelectedProducts);

      dispatch(
        setSelectedItems(updatedSelectedProducts)
      );

      return updatedSelectedProducts;
    });
  };

  const handleSelectAll = () => {
    // Kiểm tra nếu tất cả sản phẩm đã được chọn
    const isAllSelected = cart.cartDetail.length > 0 &&
      selectedProducts.length === cart.cartDetail.length;

    const updatedSelectedProducts = isAllSelected
      ? [] // Bỏ chọn tất cả
      : cart.cartDetail.map((cartDetail) => ({
        cart_detail_id: cartDetail.cart_detail_id,
        product_detail_id: cartDetail.product_detail_id,
        product_name: cartDetail.ProductDetail?.product?.product_name || '',
        price: cartDetail.ProductDetail?.product?.price || 0,
        quantity: cartDetail.quantity || 1,
        size: cartDetail.ProductDetail?.size?.size_name || '',
        color: cartDetail.ProductDetail?.color?.color_name || '',
        img_url: cartDetail.ProductDetail?.productImage?.img_url || '',
      }));

    // Cập nhật state local
    setSelectedProducts(updatedSelectedProducts);

    // Cập nhật Redux store
    dispatch(setSelectedItems(updatedSelectedProducts));
  };

  const handleIncrease = async (product_detail_id) => {
    try {
      const response = await axios.put(
        'http://localhost:8000/cart/increase',
        { product_detail_id },
        { withCredentials: true }
      );

      const updatedCart = cart.cartDetail.map((item) => {
        if (item.ProductDetail.product_detail_id === product_detail_id) {
          item.quantity += 1;
        }
        return item;
      });

      setCart({ cartDetail: updatedCart });

      setSelectedProducts((prevSelected) =>
        prevSelected.map((product) =>
          product.product_detail_id === product_detail_id
            ? { ...product, quantity: product.quantity + 1 }
            : product
        )
      );

      const updatedSelectedProducts = selectedProducts.map((product) =>
        product.product_detail_id === product_detail_id
          ? { ...product, quantity: product.quantity + 1 }
          : product
      );

      dispatch(setSelectedItems(updatedSelectedProducts));
    } catch (error) {
      console.error('Error increasing quantity:', error.message || error);
    }
  };

  const handleDecrease = async (product_detail_id) => {
    try {
      const response = await axios.put(
        'http://localhost:8000/cart/decrease',
        { product_detail_id },
        { withCredentials: true }
      );

      const updatedCart = cart.cartDetail.map((item) => {
        if (item.ProductDetail.product_detail_id === product_detail_id && item.quantity > 1) {
          item.quantity -= 1;
          setSelectedProducts((prevSelected) =>
            prevSelected.map((product) =>
              product.product_detail_id === product_detail_id
                ? { ...product, quantity: product.quantity - 1 }
                : product
            )
          );
        }
        return item;
      });

      setCart({ cartDetail: updatedCart });

      const updatedSelectedProducts = selectedProducts.map((product) =>
        product.product_detail_id === product_detail_id
          ? { ...product, quantity: product.quantity - 1 }
          : product
      );

      dispatch(setSelectedItems(updatedSelectedProducts));

    } catch (error) {
      console.error('Error decreasing quantity:', error.message || error);
    }
  };

  const handleRemove = async (product_detail_id) => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?");
    if (!confirmDelete) {
      return;
    }

    try {
      const response = await axios.delete(`http://localhost:8000/cart/${product_detail_id}`, {
        data: { product_detail_id },
        withCredentials: true,
      });

      console.log(response.data.message);

      const updatedCart = cart.cartDetail.filter(
        (item) => item.ProductDetail.product_detail_id !== product_detail_id
      );

      setCart({ cartDetail: updatedCart });
      dispatch(updateCartDetail(updatedCart));

      const updatedSelectedProducts = selectedProducts.filter(
        (product) => product.product_detail_id !== product_detail_id
      );
      setSelectedProducts(updatedSelectedProducts);
      dispatch(setSelectedItems(updatedSelectedProducts));

    } catch (error) {
      console.error('Error removing item:', error.message || error);
    }
  };

  const isAllSelected = cart.cartDetail.length > 0 && selectedProducts.length === cart.cartDetail.length;

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
                    <th className="text-center py-4 w-12">
                      <input
                        type="checkbox"
                        onChange={handleSelectAll}
                        checked={isAllSelected}
                        className="form-checkbox h-5 w-5 text-blue-600"
                      />
                    </th>
                    <th className="text-center font-semibold py-4 text-gray-600">Sản phẩm</th>
                    <th className="text-center font-semibold py-4 text-gray-600">Giá</th>
                    <th className="text-center font-semibold py-4 text-gray-600">Số lượng</th>
                    <th className="text-center font-semibold py-4 text-gray-600">Tổng cộng</th>
                    <th className="text-center font-semibold py-4 text-gray-600">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.cartDetail.map((item) => (
                    <tr className="border-b" key={item.cart_detail_id}>
                      <td className="py-4 w-12">
                        <input
                          type="checkbox"
                          checked={selectedProducts.some(
                            (product) => product.cart_detail_id === item.cart_detail_id
                          )}
                          onChange={() => handleCheckboxChange(item)}
                          className="form-checkbox h-5 w-5 text-blue-600"
                        />
                      </td>
                      <td className="py-4 w-96">
                        <div className="flex items-center">
                          <img
                            className="w-24 h-24 rounded-md mr-4 border"
                            src={`http://localhost:8000/img/${item.ProductDetail.productImage?.img_url}`}
                            alt={item.ProductDetail.product.product_name}
                          />
                          <span className="font-semibold text-gray-700">{item.ProductDetail.product.product_name}</span>
                        </div>
                      </td>
                      <td className="py-4 pr-4 w-14 text-center text-gray-600">{item.ProductDetail.product.price.toLocaleString()}₫</td>
                      <td className="py-4 pr-4 w-12">
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
                      <td className="py-4 px-2 w-12 text-gray-600">{(item.ProductDetail.product.price * item.quantity).toLocaleString()}₫</td>
                      <td className="py-2 text-center w-16">
                        <button
                          onClick={() => handleRemove(item.ProductDetail.product_detail_id)}
                          className="text-red-400 hover:text-red-600 transition" title="Xóa sản phẩm"
                        >
                          <FontAwesomeIcon icon={faTrash} className="text-xl" />
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
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <div className="flex justify-between mb-2 text-gray-600">
                <span>Voucher</span>
                <span>{voucher.toLocaleString()}₫</span>
              </div>
              <hr className="my-4 border-gray-200" />
              <div className="flex justify-between text-lg font-semibold text-gray-700">
                <span>Tổng cộng</span>
                <span>{totalPrice.toLocaleString()}₫</span>
              </div>
              <button
                onClick={() => {
                  navigate('/checkout');
                }}

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