import React from 'react';

function RevenueTable() {
  return (
    <div className="card chart p-6 bg-white shadow-lg rounded-lg">
      <form action="#" method="post">
        <div className="mb-4 flex space-x-4">
          <div className="flex-1">
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Username"
              aria-label="Username"
            />
          </div>
          <div className="flex-none self-center">
            <span className="text-gray-700">Đến ngày</span>
          </div>
          <div className="flex-1">
            <input
              type="date"
              className="w-full px-4 py-2 border border-gray-300 rounded-md"
              placeholder="Server"
              aria-label="Server"
            />
          </div>
          <button type="button" className="btn btn-primary bg-blue-500 text-white px-4 py-2 rounded-md">
            Xem
          </button>
        </div>
      </form>
      <p className="mt-4 text-gray-700">Tổng doanh thu: <span className="font-bold">100.000.000 VND</span></p>
      <table className="revenue w-full table-auto mt-4">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">#</th>
            <th className="px-4 py-2 text-left">Mã đơn hàng</th>
            <th className="px-4 py-2 text-left">Doanh thu</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t hover:bg-gray-100">
            <td className="px-4 py-2">1</td>
            <td className="px-4 py-2">GIA001</td>
            <td className="px-4 py-2">100.000</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default RevenueTable;
