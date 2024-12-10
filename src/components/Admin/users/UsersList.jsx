import React, { useEffect, useState } from 'react';
import './Users.css';

const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const fetchUsers = () => {
    fetch('http://localhost:8000/user')
      .then(response => {
        if (!response.ok) {
          throw new Error(`Máy chủ trả về mã lỗi ${response.status}: ${response.statusText}`);
        }
        return response.json();
      })
      .then(data => {
        setUsers(data);
      })
      .catch(error => {
        console.error("Có lỗi khi lấy danh sách người dùng!", error);
      });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) {
      try {
        const response = await fetch(`http://localhost:8000/user/${userId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': 'Bearer your_token_here', // Thêm nếu cần
          },
        });
        if (!response.ok) {
          const errorMessage = `Máy chủ trả về mã lỗi ${response.status}: ${response.statusText}`;
          throw new Error(errorMessage);
        }
        // Cập nhật danh sách người dùng sau khi xóa
        setUsers(prevUsers => prevUsers.filter(user => user.user_id !== userId));
        alert("Xóa người dùng thành công!");
      } catch (error) {
        console.error("Có lỗi khi xóa người dùng!", error);
        alert(`Có lỗi khi xóa người dùng: ${error.message}`);
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  const handleNextPage = () => {
    if (currentPage < Math.ceil(users.length / usersPerPage)) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  return (
    <div className="users-table">
      <h2>Danh sách người dùng</h2>
      <table id="example" className="table table-hover">
        <thead>
          <tr>
            <th>ID người dùng</th>
            <th>Tên người dùng</th>
            <th>Ảnh tài khoản</th>
            <th>Email</th>
            <th>Vai trò</th>
            <th>SĐT</th>
            <th>Ngày đăng ký</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.user_id}</td>
              <td>{user.name}</td>
              <td><img src={user.avatar} alt="Avatar" width="50" /></td>
              <td>{user.email}</td>
              <td>{user.role === 0 ? 'Admin' : 'User'}</td>
              <td>{user.phone}</td>
              <td>{new Date(user.registration_date).toLocaleString()}</td>
              <td>
                <button className="delete-btn-users" onClick={() => handleDeleteUser(user.user_id)}>Xóa</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Trang trước</button>
        <span>Trang {currentPage} / {Math.ceil(users.length / usersPerPage)}</span>
        <button onClick={handleNextPage} disabled={currentPage === Math.ceil(users.length / usersPerPage)}>Trang sau</button>
      </div>
    </div>
  );
};

export default UserTable;
