import React, { useState, useEffect } from "react";
import logo from "../../assets/images/logo.svg";
import { Link } from "react-router-dom";

const Search = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Check if token exists in cookies
  useEffect(() => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) setIsLoggedIn(true);
  }, []);

  // Handle logout
  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0"; // Remove token
    setIsLoggedIn(false);
    window.location.href = "/login"; // Redirect to login
  };

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Add scroll event listener
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
    <section className="search">
      <div className="container c_flex">
        <Link className="logo width" to="/">
          <img src={logo} alt="Logo" />
        </Link>

        <div className="search-box f_flex">
          <i className="fa fa-search"></i>
          <input type="text" placeholder="Search and hit enter..." />
          <span>All Category</span>
        </div>

        <div className="icon f_flex width">
          {isLoggedIn ? (
            <div className="user-menu relative group m-0 block min-w-[90px] text-center cursor-pointer">
              <img
                src="" // Replace with actual avatar URL
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
          <div className="cart">
            <Link to="/cart">
              <i className="fa fa-shopping-bag icon-circle"></i>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Search;

