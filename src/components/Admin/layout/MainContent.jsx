import React from 'react';
import Statistics from '../dashboard/Statistics';
import RevenueTable from '../dashboard/RevenueTable';
import NewOrders from './NewOrders';
import NewCustomers from '../dashboard/NewCustomers';

function MainContent() {
  return (
    <div className="main-content px-4 py-6 pl-60">
      <h3 className="text-xl font-bold text-gray-800 mb-6">Dashboards</h3>

      {/* Statistics Section */}
      <section className="statistics grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Statistics title="Tổng sản phẩm" number="3M" link="/" />
        <Statistics title="Tổng thành viên" number="3M" link="/" />
        <Statistics title="Tổng danh mục" number="3M" link="/" />
        <Statistics title="Tổng danh mục" number="3M" />
      </section>

      {/* Other Sections */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
        <div className="lg:col-span-6">
          <RevenueTable />
        </div>
        <div className="lg:col-span-3">
          <NewOrders />
        </div>
        <div className="lg:col-span-3">
          <NewCustomers />
        </div>
      </section>
    </div>
  );
}

export default MainContent;

