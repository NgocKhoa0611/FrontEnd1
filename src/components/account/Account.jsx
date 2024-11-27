import React, { useState, useEffect } from "react";
import axios from "axios";

const Account = () => {
  const [user, setUser] = useState(null);
  const [selectedTab, setSelectedTab] = useState("account");
  const [newAvatar, setNewAvatar] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [orders, setOrders] = useState([]);
  useEffect(() => {
    const token = document.cookie.split("; ").find(row => row.startsWith("token="));
    if (token) {
      fetchUser();
      fetchOrderHistory();
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
      setFormData({
        name: response.data.name || "",
        email: response.data.email || "",
        phone: response.data.phone || "",
        address: response.data.address || "",
      });
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };
  const fetchOrderHistory = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
      const response = await axios.get("http://localhost:8000/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setOrders(response.data); // Set the fetched orders
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };
  const handleChangeAvatar = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewAvatar(file);
    }
  };
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleUpdateUser = async () => {
    try {
      const token = document.cookie.split("; ").find(row => row.startsWith("token="))?.split("=")[1];
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("email", formData.email);
      formDataToSend.append("phone", formData.phone);
      formDataToSend.append("address", formData.address);
      if (newAvatar) {
        formDataToSend.append("avatar", newAvatar);
      }
      await axios.put(`http://localhost:8000/user/${userId}`, formDataToSend, {
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        }
      });
      alert("Cập nhật thành công!");
      fetchUser(); // Reload user data after update
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto mt-6 bg-white rounded-lg shadow-lg">
        <div className="flex">
          {/* Sidebar */}
          <div className="w-1/4 border-r p-6 bg-gray-50">
            <div className="flex flex-col items-center mb-6">
              <input
                type="file"
                accept="image/*"
                onChange={handleChangeAvatar}
                className="hidden"
                id="avatar-upload"
              />
              <label htmlFor="avatar-upload">
                <img
                  src={`/path/to/avatars/${user?.avatar || "default-avatar.jpg"}`}
                  alt="Avatar"
                  className="w-24 h-24 rounded-full shadow-lg mb-4 cursor-pointer"
                />
              </label>
              <p className="text-lg font-semibold text-gray-800">{user?.name || "Không có tên"}</p>
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
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Họ và tên</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Số điện thoại</label>
                    <input
                      type="text"
                      id="phone"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">Địa chỉ</label>
                    <input
                      type="text"
                      id="address"
                      className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
                      value={formData.address}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div>
                    <button
                      type="button"
                      onClick={handleUpdateUser}
                      className="w-full mt-4 bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700"
                    >
                      Cập nhật thông tin
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Lịch sử đơn hàng */}
            {selectedTab === "orders" && (
              <div id="order-history" className="space-y-6">
                <h2 className="text-xl font-bold text-gray-800">Lịch sử đơn hàng</h2>
                <table className="w-full table-auto">
                  <thead>
                    <tr className="text-left">
                      <th className="px-4 py-2 font-semibold text-sm text-gray-700">ID Đơn Hàng</th>
                      <th className="px-4 py-2 font-semibold text-sm text-gray-700">Ngày Đặt</th>
                      <th className="px-4 py-2 font-semibold text-sm text-gray-700">Trạng Thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.length > 0 ? (
                      orders.map(order => (
                        <tr key={order.id} className="border-b">
                          <td className="px-4 py-2">{order.id}</td>
                          <td className="px-4 py-2">{order.date}</td>
                          <td className="px-4 py-2">{order.status}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center py-4">Không có đơn hàng nào.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Account;
