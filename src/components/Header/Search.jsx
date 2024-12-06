import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from 'react-redux';
import { setCartItems } from '../../../redux/slices/cartslice';

const Search = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      setIsLoggedIn(true);
      fetchUser();
      getCart();
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  const getCart = async () => {
    try {
      const response = await axios.get('http://localhost:8000/cart', {
        withCredentials: true,
      });
      console.log('Cart items:', response.data);
      dispatch(setCartItems(response.data))
    }
    catch (error) {
      const errorMessage = error.response?.data?.message || error.message || 'Lỗi không xác định';
      console.error('Error fetching cart:', errorMessage);

    }
  };
  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log(payload);
      const userId = payload.id;

      const response = await axios.get(`http://localhost:8000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const cartDetail = useSelector((state) => state.cart.items?.cart?.cartDetail);
  const itemCount = cartDetail ? cartDetail.length : 0;
  console.log(itemCount);

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  useEffect(() => {
    const onScroll = () => {
      const search = document.querySelector(".search");
      if (search) {
        search.classList.toggle("active", window.scrollY > 100);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="search" >
      <div className="container c_flex">
        <Link className="logo width" to="/">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="search-box f_flex">
          <input type="text" placeholder="Tìm kiếm sản phẩm" />
          <i className="fa fa-search"></i>
        </div>

        <div className="icon f_flex width">
          {isLoggedIn && user ? (
            <div className="user-menu relative group m-0 block min-w-[90px] text-center cursor-pointer">
              <img
                src={user.avatar ? `http://localhost:8000/avatar/${user.avatar}` : "http://localhost:8000/img/default-avatar.png"}
                alt="User Avatar"
                className="user-avatar"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="dropdown-menu absolute top-12 left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg min-w-[180px] py-2">
                  <Link to="/account" className="text-left block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Thông tin tài khoản
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="login">
              <Link to="/login">
                <i className="fa fa-user icon-circle"></i>
              </Link>
            </div>
          )}

          {/* Favorite Icon */}
          <div className="favorite relative">
            <Link to="/favorites">
              <i className="fa fa-heart icon-circle"></i>
              {/* Example: Add a badge for wishlist count if desired */}
              {/* <span className="favorite-count absolute -top-2 -right-2 bg-red-500 text-white text-xs text-center rounded-full px-2">
        {wishlistCount}
      </span> */}
            </Link>
          </div>

          {/* Cart Icon */}
          <div className="cart relative">
            <Link to="/cart">
              <i className="fa fa-shopping-bag icon-circle"></i>
              {itemCount > 0 && (
                <span className="cart-count absolute -top-2 -right-2 bg-red-500 text-white text-xs text-center rounded-full px-2">
                  {itemCount}
                </span>
              )}
            </Link>
          </div>
        </div>

      </div>
    </section >
  );
};

export default Search;