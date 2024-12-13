import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import './Products.css';

function ProductEdit() {
  let { id } = useParams();
  const [productdetail, setProductDetail] = useState({
    product_detail_id: '',
    color_id: '',
    size_id: '',
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
      body: JSON.stringify(productdetail),
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("Selected file:", file);
    }
  };

  return (
    <form id="frmeditproduct" className="frmeditproduct">
      <h1 className="title-page-products">Sửa chi tiết sản phẩm</h1>
      <div className='col'>ID:
        <input value={productdetail.product_id} type="text" className="form-control" readOnly />
      </div>
      <div className='col'>Màu sắc:
        <input value={productdetail.color && productdetail.color.color_name ? productdetail.color.color_name : "Không có màu"} type="text" className="form-control" name="product_name" onChange={handleChange} />
      </div>
      <div className='col'>Kích cỡ:
        <input value={productdetail.size && productdetail.size.size_name ? productdetail.size.size_name : "Không có kích thước"} type="text" className="form-control" name="category_id" onChange={handleChange} />
      </div>
      <div className='col'>Hình ảnh:
        <input type="file" className="file-input" name="image" accept="image/*" onChange={handleImageChange} />
      </div>
      <div className="mb-3">
        <button className="edit-btn-products" type="submit" onClick={submitDuLieu}>Sửa chi tiết sản phẩm</button> &nbsp;
        <Link to={`/admin/productdetaillist/${productdetail.product_id}`} className="btn-products-list">Danh sách chi tiết sản phẩm</Link>
      </div>
    </form>
  );
}

export default ProductEdit;
