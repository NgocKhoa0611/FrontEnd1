import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Statistics from '../dashboard/Statistics';
import { Bar } from 'react-chartjs-2'; // Import biểu đồ Bar
import './MainContent.css';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Đăng ký các thành phần cần thiết cho Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function MainContent() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalUsers: 0,
    totalCategories: 0,
    totalOrders: 0,
  });
  const [totalRevenue, setTotalRevenue] = useState(0); // Tổng doanh thu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const [productsRes, usersRes, categoriesRes, ordersRes, revenueRes] = await Promise.all([
          axios.get('http://localhost:8000/product/count'),
          axios.get('http://localhost:8000/user/total'),
          axios.get('http://localhost:8000/category/count'),
          axios.get('http://localhost:8000/orders/total-orders'),
          axios.get('http://localhost:8000/orders/sum/total-revenue'), // API lấy tổng doanh thu
        ]);

        setStats({
          totalProducts: productsRes.data.totalProducts ?? 0,
          totalUsers: usersRes.data.totalUsers ?? 0,
          totalCategories: categoriesRes.data.total ?? 0,
          totalOrders: ordersRes.data.totalOrders ?? 0,
        });

        setTotalRevenue(revenueRes.data.totalRevenue ?? 0); // Cập nhật doanh thu
      } catch (error) {
        console.error('Error fetching statistics:', error);
        setError('Unable to fetch statistics at this time. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading-indicator">Loading...</div>;
  }

  if (error) {
    return (
      <div className="main-content px-4 py-6 pl-60">
        <div className="bg-red-100 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  // Dữ liệu cho biểu đồ cột
  const chartData = {
    labels: ['Doanh thu'], // Chỉ một mục là Doanh thu
    datasets: [
      {
        label: 'Tổng doanh thu',
        data: [totalRevenue], // Dữ liệu doanh thu
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="main-content px-4 py-6 pl-60">
      <section className="statistics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <Statistics title="Tổng sản phẩm" number={stats.totalProducts || 0} link="/" />
        <Statistics title="Tổng thành viên" number={stats.totalUsers || 0} link="/" />
        <Statistics title="Tổng danh mục" number={stats.totalCategories || 0} link="/" />
        <Statistics title="Tổng đơn hàng" number={stats.totalOrders || 0} link="/" />
      </section>

      {/* Biểu đồ Cột */}
      <section className="chart-section mt-6">
        <h4 className="text-xl font-bold text-gray-800 mb-4">Tổng doanh thu</h4>
        <div className="bg-white p-4 shadow-lg rounded-lg">
          <Bar data={chartData} /> {/* Sử dụng Bar chart */}
        </div>
      </section>
    </div>
  );
}

export default MainContent;
