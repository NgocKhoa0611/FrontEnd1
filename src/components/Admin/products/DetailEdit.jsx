import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Products.css';

function ProductEdit() {
  let { id } = useParams();
  const [productdetail, setProductDetail] = useState({
    product_detail_id: '',
    product_name: '',
    category_id: '',
    price: '',
    price_promotion: '',
    img_url: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    let opt = {
      method: "get",
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(`http://localhost:8000/product/${id}`, opt)
      .then(res => res.json())
      .then(data => {
        setProductDetail(data);
      })
      .catch(error => {
        console.error('Error fetching product:', error);
        alert("Có lỗi xảy ra khi tải sản phẩm. Vui lòng thử lại sau.");
      });
  }, [id]);

  const submitDuLieu = (e) => {
    e.preventDefault();
    let url = `http://localhost:8000/product/${id}`;
    let opt = {
      method: "put",
      body: JSON.stringify(product),
      headers: { 'Content-Type': 'application/json' }
    };
    fetch(url, opt)
      .then(res => res.json())
      .then(data => {
        alert("Đã cập nhật sản phẩm");
        navigate('/admin/productlist/productdetaillist');
      })
      .catch(error => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng thử lại!");
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductDetail(prevProduct => ({
      ...prevProduct,
      [name]: name === 'price' || name === 'price_promotion' ? (value === '' ? '' : parseFloat(value)) : value
    }));
  };

  return (
    <form id="frmeditproduct" className="frmeditproduct">
      <h1 className="title-page-products">Sửa chi tiết sản phẩm</h1>
      <div className='col'>ID:
        <input value={productdetail.product_id} type="text" className="form-control" readOnly />
      </div>
      <div className='col'>Màu sắc:
        <input value={productdetail.color_name} type="text" className="form-control" name="product_name" onChange={handleChange} />
      </div>
      <div className='col'>Kích cỡ:
        <input value={productdetail.size_id} type="text" className="form-control" name="category_id" onChange={handleChange} />
      </div>
      <div className='col'>Hình ảnh:
        <input value={productdetail.price} type="number" className="form-control" name="price" onChange={handleChange} />
      </div>
      <div className="mb-3">
        <button className="edit-btn-products" type="submit" onClick={submitDuLieu}>Sửa chi tiết sản phẩm</button> &nbsp;
        <Link to={`/admin/productlist/productdetaillist/`} className="btn-products-list">Danh sách chi tiết sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductEdit;
