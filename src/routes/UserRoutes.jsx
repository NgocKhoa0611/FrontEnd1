import { Routes, Route } from "react-router-dom";
import '../components/User/user.css';
import Header from "../pages/User/Header.jsx";
import Home from "../pages/User/Home.jsx";
import Footer from "../pages/User/Footer.jsx";
import Cart from "../pages/User/Cart.jsx";
import Login from "../pages/User/Login.jsx";
import Register from "../pages/User/Register.jsx";
import Products from "../components/User/Products/index.jsx";
import ProductDetail from "../pages/User/ProductDetail.jsx";
import NotFound from "../pages/User/NotFound.jsx";
import Contact from "../pages/User/Contact.jsx";
import Category from "../pages/User/Category.jsx";
import Checkout from "../pages/User/Checkout.jsx";
import Account from "../pages/User/account.jsx";
import CategoryParent from "../components/User/Category/parentID.jsx";

const UserRoutes = () => {
    return (
        <>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/category/:id" element={<Category />} />
                <Route path="category/parent/:id" element={<CategoryParent />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/products" element={<Products />} />
                <Route path="/account" element={<Account />} />
                <Route path="/account/:userId" element={<Account />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer /> {/* Đặt Footer bên ngoài Routes */}
        </>
    );
};

export default UserRoutes;