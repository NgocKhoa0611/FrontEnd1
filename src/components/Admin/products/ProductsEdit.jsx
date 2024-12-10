import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import axios
import './Products.css';

function ProductEdit() {
  let { id } = useParams();
  const [product, setProduct] = useState({
    product_id: '',
    product_name: '',
    category_id: '',
    price: '',
    price_promotion: '',
    img_url: ''
  });
  const navigate = useNavigate();

  // Lấy thông tin sản phẩm theo ID
  useEffect(() => {
    axios.get(`http://localhost:8000/product/${id}`)
      .then(response => {
        setProduct(response.data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        alert("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.");
      });
  }, [id]);

  // Cập nhật thông tin sản phẩm
  const submitDuLieu = (e) => {
    e.preventDefault();
    axios.put(`http://localhost:8000/product/${id}`, product, {
      headers: { 'Content-Type': 'application/json' }
    })
      .then(response => {
        alert("Đã cập nhật sản phẩm");
        navigate('/admin/productlist');
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại!");
      });
  };

  // Xử lý thay đổi dữ liệu
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: name === 'price' || name === 'price_promotion'
        ? (value === '' || isNaN(value) ? '' : parseFloat(value))
        : value
    }));
  };

  return (
    <form className="frmeditproduct" onSubmit={submitDuLieu}>
      <h1 className="title-page-products">Sửa sản phẩm</h1>
      <div className='col'>ID sản phẩm:
        <input value={product.product_id} type="text" className="form-control" readOnly />
      </div>
      <div className='col'>Tên sản phẩm:
        <input value={product.product_name} type="text" className="form-control" name="product_name" onChange={handleChange} />
      </div>
      <div className='col'>Danh mục:
        <input value={product.category_id} type="text" className="form-control" name="category_id" onChange={handleChange} />
      </div>
      <div className='col'>Giá:
        <input value={product.price} type="number" className="form-control" name="price" onChange={handleChange} />
      </div>
      <div className='col'>Giá khuyến mãi:
        <input value={product.price_promotion} type="number" className="form-control" name="price_promotion" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <button className="edit-btn-products" type="submit">Sửa sản phẩm</button> &nbsp;
        <Link to={`/admin/productlist`} className="btn-products-list">Danh sách sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductEdit;
