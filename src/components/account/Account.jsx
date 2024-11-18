import React, { useState, useEffect } from "react";
import axios from "axios";

const Account = () => {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("account"); // Trạng thái lưu tab đang chọn

  useEffect(() => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) {
      fetchUser();
    }
  }, []);

  const fetchUser = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find(row => row.startsWith("token="))
        ?.split("=")[1];

      if (!token) return;

      const payload = JSON.parse(atob(token.split('.')[1]));
      console.log("ra", payload);
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

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto mt-6 bg-white rounded-lg shadow-lg">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 border-r p-6 bg-gray-50">
            <div className="flex flex-col items-center mb-6">
              <img
                src={`/path/to/avatars/${user?.avatar || "default-avatar.jpg"}`}
                alt="Avatar"
                className="w-24 h-24 rounded-full shadow-lg mb-4"
              />
              <p className="text-lg font-semibold text-gray-800">
                {user?.name || "Không có tên"}
              </p>
              <p className="text-sm text-gray-500">{user?.email || "N/A"}</p>
            </div>
            <ul className="space-y-6">
              <li>
                <button
                  onClick={() => setSelectedTab("account")}
                  className={`text-blue-600 font-semibold hover:text-blue-700 p-2 rounded-md transition duration-300 
                    ${selectedTab === "account" ? "bg-blue-100 text-blue-700" : "text-gray-600"}`}
                >
                  Thông tin tài khoản
                </button>
              </li>
              <li>
                <button
                  onClick={() => setSelectedTab("orders")}
                  className={`text-blue-600 font-semibold hover:text-blue-700 p-2 rounded-md transition duration-300 
                    ${selectedTab === "orders" ? "bg-blue-100 text-blue-700" : "text-gray-600"}`}
                >
                  Lịch sử đơn hàng
                </button>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="w-3/4 p-8">
            {/* Thông tin tài khoản */}
            {selectedTab === "account" && (
              <div id="account-info" className="transition-all duration-300 ease-in-out opacity-100">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Thông tin cá nhân</h2>
                <form className="space-y-6">
                  <div>
                    <label htmlFor="user_id" className="block text-sm font-medium text-gray-700">
                      User ID
                    </label>
                    <input
                      type="text"
                      id="user_id"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      defaultValue={user?.user_id || ""}
                      readOnly
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Họ và tên
                    </label>
                    <input
                      type="text"
                      id="name"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      defaultValue={user?.name || "Chưa cập nhật"}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      defaultValue={user?.email || ""}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="text"
                      id="phone"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      defaultValue={user?.phone || "Chưa cập nhật"}
                    />
                  </div>
                  <div>
                    <label htmlFor="registration_date" className="block text-sm font-medium text-gray-700">
                      Ngày đăng ký
                    </label>
                    <input
                      type="text"
                      id="registration_date"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      defaultValue={new Date(user?.registration_date).toLocaleDateString() || "Chưa cập nhật"}
                      readOnly
                    />
                  </div>
                </form>
              </div>
            )}

            {/* Lịch sử đơn hàng */}
            {selectedTab === "orders" && (
              <div id="order-history" className="transition-all duration-300 ease-in-out opacity-100 mt-10">
                <h2 className="text-xl font-bold text-gray-800 mb-6">Lịch sử đơn hàng</h2>
                <div className="space-y-4">
                  {/* Đơn hàng 1 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <p className="text-lg font-semibold text-gray-800">Đơn hàng #1</p>
                    <p className="text-sm text-gray-600">Ngày đặt: 06/11/2024</p>
                    <p className="text-sm text-gray-600">Trạng thái: Đang xử lý</p>
                  </div>
                  {/* Đơn hàng 2 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <p className="text-lg font-semibold text-gray-800">Đơn hàng #2</p>
                    <p className="text-sm text-gray-600">Ngày đặt: 05/11/2024</p>
                    <p className="text-sm text-gray-600">Trạng thái: Đã giao</p>
                  </div>
                  {/* Đơn hàng 3 */}
                  <div className="p-4 border rounded-lg shadow-sm bg-gray-50">
                    <p className="text-lg font-semibold text-gray-800">Đơn hàng #3</p>
                    <p className="text-sm text-gray-600">Ngày đặt: 04/11/2024</p>
                    <p className="text-sm text-gray-600">Trạng thái: Đang xử lý</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
