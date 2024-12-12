// src/components/NewCustomers.js
import React from 'react';

function NewCustomers() {
  return (
    <div className="card chart">
      <h4>Khách hàng mới</h4>
      <table className="revenue table table-hover">
        <thead>
          <tr>
            <th>#</th>
            <th>Username</th>
          </tr>
        </thead>
        <tbody>
          {/* Sample rows */}
          <tr><td>1</td><td>giangcoder1</td></tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

export default NewCustomers;
