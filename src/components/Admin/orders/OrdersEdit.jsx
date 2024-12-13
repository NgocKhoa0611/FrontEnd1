import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";  // Import axios
import './Orders.css';

function OrdersEdit() {
    let { id } = useParams(); // Lấy ID đơn hàng từ URL
    const [orderStatus, setOrderStatus] = useState(""); // Trạng thái đơn hàng
    const navigate = useNavigate();

    // Lấy thông tin đơn hàng theo ID
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                console.log(`Fetching order with ID: ${id}`);
                const response = await axios.get(`http://localhost:8000/orders/${id}`);
                console.log("Order data fetched:", response.data);
                if (response.data) {
                    setOrderStatus(response.data.order.order_status);
                }
            } catch (error) {
                console.error("Lỗi khi gọi API:", error);
                alert("Không thể tải dữ liệu đơn hàng");
            }
        };
        fetchOrder();
    }, [id]);

    // Cập nhật trạng thái đơn hàng
    const submitOrderStatus = async () => {
        try {
            const response = await axios.put(`http://localhost:8000/orders/${id}/status`, {
                order_status: orderStatus,
            });
            alert("Đã cập nhật trạng thái đơn hàng");
            navigate("/admin/orderslist"); // Chuyển về danh sách đơn hàng
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái:", error);
            alert("Không thể cập nhật trạng thái đơn hàng. Vui lòng thử lại.");
        }
    };

    return (
        <form id="frmeditorders" onSubmit={(e) => e.preventDefault()}>
            <h1 className="title-page-orders">Cập nhật trạng thái đơn hàng</h1>
            <div className="col">
                <label>Trạng thái đơn hàng:</label>
                <select value={orderStatus} onChange={(e) => setOrderStatus(e.target.value)} className="form-control">
                    <option value="" disabled>Chọn trạng thái</option>
                    <option value="Chờ xử lý">Chờ xử lý</option>
                    <option value="Đã xác nhận">Đã xác nhận</option>
                    <option value="Đang giao">Đang giao</option>
                    <option value="Đã giao">Đã giao</option>
                    <option value="Đã hủy">Đã hủy</option>
                </select>
            </div>
            <div className="mb-3">
                <button className="edit-btn-orders" type="button" onClick={submitOrderStatus}>Cập nhật trạng thái</button>
                &nbsp;
                <button className="btn-orders-list" onClick={() => navigate("/admin/orderslist")}>Danh sách đơn hàng</button>
            </div>
        </form>
    );
}

export default OrdersEdit;