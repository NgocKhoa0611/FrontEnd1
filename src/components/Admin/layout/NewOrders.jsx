import React, { useEffect, useState } from 'react';

function NewOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    setTimeout(() => {
      setOrders([
        { id: 'GIA001', status: 'Chờ duyệt' },
        { id: 'GIA002', status: 'Đã duyệt' },
        // Add more sample orders here
      ]);
    }, 1000);
  }, []);

  return (
    <div className="card chart">
      <h4>Đơn hàng mới</h4>
      <table className="revenue table table-hover">
        <thead>
          <tr>
            <th>Mã đơn hàng</th>
            <th>Trạng thái</th>
          </tr>
        </thead>
        <tbody>
          {orders.length ? (
            orders.map(order => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2">Loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default NewOrders;
