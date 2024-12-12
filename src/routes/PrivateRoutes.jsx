import { Navigate } from 'react-router-dom';

const PrivateRoutes = ({ element }) => {
    const token = document.cookie.includes('token');

    if (!token) {
        return <Navigate to="/login-admin" replace />;
    }

    return element;
};

export default PrivateRoutes;
