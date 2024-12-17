import { Routes, Route } from "react-router-dom";
import Sidebar from "../components/Admin/layout/Sidebar";
import MainContent from "../components/Admin/layout/MainContent";
import ProductsList from '../components/Admin/products/ProductsList';
import ProductsDetailList from '../components/Admin/products/ProductsDetailList'
import ProductsAdd from '../components/Admin/products/ProductsAdd';
import ProductsEdit from '../components/Admin/products/ProductsEdit';
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
                        <Route path="/product" element={<ProductsList />} />
                        <Route path="/product/add-product" element={<ProductsAdd />} />
                        <Route path="/product/edit-product/:id" element={<ProductsEdit />} />
                        <Route path="/categories" element={<CategoriesList />} />
                        <Route path="/categories/add-categories" element={<CategoriesAdd />} />
                        <Route path="/categories/edit-categories/:id" element={<CategoriesEdit />} />
                        <Route path="/product/:id" element={<ProductsDetailList />} />
                        <Route path="/orders" element={<OrdersList />} />
                        <Route path="/orders/edit/:id" element={<OrdersEdit />} />
                        <Route path="/users" element={<UsersList />} />
                    </Routes>
                </div>
            </div>
        </>
    );
};

export default AdminRoutes;

