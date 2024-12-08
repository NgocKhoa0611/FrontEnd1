import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCartItems } from "../../../redux/slices/cartslice";
import { debounce } from "lodash"; // Thêm lodash để debounce

const Search = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Quản lý giá trị nhập vào
  const [searchResults, setSearchResults] = useState([]); // Quản lý kết quả tìm kiếm
  const [loading, setLoading] = useState(false); // Quản lý trạng thái loading
  const dispatch = useDispatch();
  
  const searchResultsRef = useRef(null); // Sử dụng ref để tham chiếu đến kết quả tìm kiếm

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
      const response = await axios.get("http://localhost:8000/cart", {
        withCredentials: true,
      });
      console.log("Cart items:", response.data);
      dispatch(setCartItems(response.data));
    } catch (error) {
      console.error("Error fetching cart:", error.message);
    }
  };

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.id;

      const response = await axios.get(`http://localhost:8000/user/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; path=/; max-age=0";
    setIsLoggedIn(false);
    window.location.href = "/login";
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  // Hàm tìm kiếm đã debounce
  const debouncedSearch = debounce(async (term) => {
    if (!term.trim()) {
      setSearchResults([]);
      return;
    }

    setLoading(true); // Bắt đầu loading
    try {
      const response = await axios.get(`http://localhost:8000/product/search?name=${term.trim()}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error("Error fetching search results:", error.message);
      setSearchResults([]);
    } finally {
      setLoading(false); // Dừng loading
    }
  }, 500); // Chờ 500ms trước khi gửi yêu cầu tìm kiếm

  // Hiển thị kết quả tìm kiếm khi searchTerm thay đổi
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm]);

  // Hàm để ẩn kết quả tìm kiếm khi nhấn ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchResultsRef.current && !searchResultsRef.current.contains(e.target)) {
        setSearchResults([]);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Reset searchTerm khi quay lại trang chủ hoặc sau khi tìm kiếm
  const resetSearchTerm = () => {
    setSearchTerm("");  // Reset giá trị tìm kiếm khi quay lại
  };

  return (
    <section className="search relative">
      <div className="container c_flex">
        <Link className="logo width" to="/" onClick={resetSearchTerm}>
          <img src={logo} alt="Logo" />
        </Link>

        <div className="search-box f_flex relative w-full">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)} // Cập nhật giá trị nhập
            className=" p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Kết quả tìm kiếm */}
          {searchTerm && (
            <div
              ref={searchResultsRef}
              className="search-results-container absolute w-full bg-white shadow-md rounded-lg mt-14 max-h-96 overflow-y-auto z-50"
            >
              {loading ? (
                <div className="p-4 text-center text-gray-500">Đang tìm kiếm...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((product) => (
                  <div key={product.product_id} className="search-result-item flex items-center gap-4 p-3 border-b last:border-b-0">
                    <Link to={`/product/${product.product_id}`} className="flex items-center w-full" onClick={resetSearchTerm}>
                      <img
                        src={`http://localhost:8000/img/${product.detail[0]?.productImage?.img_url}`}
                        alt={product.product_name}
                        className="w-24 h-28 object-cover rounded-md"
                      />
                      <div className="product-details flex flex-col justify-between ml-4">
                        <h1 className="w-full text-xl">{product.product_name}</h1>
                        <div className="product-price text-sm mt-2">
                          <span className="text-red-500 font-bold">{product.price}₫</span>
                          {product.original_price && (
                            <span className="text-gray-500 line-through ml-2">
                              {product.original_price}₫
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-gray-500">Không có sản phẩm nào.</div>
              )}
            </div>
          )}
        </div>

        {/* Các biểu tượng khác */}
        <div className="icon f_flex width">
          {isLoggedIn && user ? (
            <div className="user-menu relative group m-0 block min-w-[90px] text-center cursor-pointer">
              <img
                src={
                  user.avatar
                    ? `http://localhost:8000/avatar/${user.avatar}`
                    : "http://localhost:8000/img/default-avatar.png"
                }
                alt="User Avatar"
                className="user-avatar"
                onClick={toggleDropdown}
              />
              {showDropdown && (
                <div className="dropdown-menu absolute top-12 left-1/2 transform -translate-x-1/2 mt-2 bg-white shadow-lg rounded-lg min-w-[180px] py-2">
                  <Link
                    to="/account"
                    className="text-left block px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
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

          <div className="favorite relative">
            <Link to="/favorites">
              <i className="fa fa-heart icon-circle"></i>
            </Link>
          </div>

          <div className="cart relative">
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
