// src/components/layout/Sidebar.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link từ React Router
import logo from '../assets/images/logo1.png';
import { useNavigate } from 'react-router-dom';



function Sidebar() {
  const navigate = useNavigate();

  const handleNavigateHome = () => {
    navigate('/');
  };
  return (
    <div className="sidebar">
      <div className="user-info">
        <img src={logo} alt="User" className="main-logo" />
      </div>
      <nav>
        <ul>
          <li><Link to={`/admin`}>Dashboards</Link></li>
          <li><Link to={`/admin/categories`}>Quản lí danh mục</Link></li>
          <li><Link to={`/admin/product`}>Quản lí sản phẩm</Link></li>
          <li><Link to={`/admin/orders`}>Quản lí đơn hàng</Link></li>
          <li><Link to={`/admin/users`}>Quản lí người dùng</Link></li>
        </ul>
      </nav>
      <button className="logout-btn">Đăng xuất</button>
      <button className="logout-btn" onClick={handleNavigateHome}>
        Quay lại trang chủ
      </button>
    </div>
  );
}

export default Sidebar;
