import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Admin/layout/Sidebar";
import MainContent from "../components/Admin/layout/MainContent";
import NewOrders from '../components/Admin/layout/NewOrders';
import NewCustomers from '../components/Admin/dashboard/NewCustomers';
import RevenueTable from '../components/Admin/dashboard/RevenueTable';
import ProductsList from '../components/Admin/products/ProductsList';
import ProductsDetailList from '../components/Admin/products/ProductsDetailList'
import ProductsAdd from '../components/Admin/products/ProductsAdd';
import ProductsEdit from '../components/Admin/products/ProductsEdit';
import ProductDetailList from '../components/Admin/products/ProductsDetailList';
import DetailAdd from '../components/Admin/products/DetailAdd';
import DetailEdit from '../components/Admin/products/DetailEdit';
import CategoriesList from '../components/Admin/categories/CategoriesList';
import CategoriesAdd from '../components/Admin/categories/CategoriesAdd';
import CategoriesEdit from '../components/Admin/categories/CategoriesEdit';
import OrdersList from '../components/Admin/orders/OrdersList';
import OrdersEdit from '../components/Admin/orders/OrdersEdit';
import UsersList from '../components/Admin/users/UsersList';
import '../components/Admin/assets/styles/admin.css';
import '../components/Admin/assets/styles/index.css';

const AdminRoutes = () => {
    return (
        <>
            <div className="app">
                <Sidebar />
                <div className="">
                    <Routes>
                        <Route path="/" element={<MainContent />} />
                        <Route path="/new-orders" element={<NewOrders />} />
                        <Route path="/new-customers" element={<NewCustomers />} />
                        <Route path="/revenue" element={<RevenueTable />} />
                        <Route path="/productlist" element={<ProductsList />} />
                        <Route path="/productlist/add-product" element={<ProductsAdd />} />
                        <Route path="/productlist/edit-product/:id" element={<ProductsEdit />} />
                        <Route path="/productdetaillist/:id" element={<ProductDetailList />} />
                        <Route path="/productdetaillist/add-detail/:id" element={<DetailAdd />} />
                        <Route path="/productdetaillist/edit-detail/:id" element={<DetailEdit />} />
                        <Route path="/categorieslist" element={<CategoriesList />} />
                        <Route path="/categorieslist/add-categories" element={<CategoriesAdd />} />
                        <Route path="/categorieslist/edit-categories/:id" element={<CategoriesEdit />} />
                        <Route path="/productlist/:id" element={<ProductsDetailList />} />
                        <Route path="/orderslist" element={<OrdersList />} />
                        <Route path="/orderslist/edit/:id" element={<OrdersEdit />} />
                        <Route path="/userslist" element={<UsersList />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default AdminRoutes;