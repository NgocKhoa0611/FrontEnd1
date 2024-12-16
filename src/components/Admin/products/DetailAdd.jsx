import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from 'axios';
import './Products.css';

function DetailAdd() {
  const { id } = useParams(); // Lấy `product_id` từ URL
  const navigate = useNavigate();

  // State cho chi tiết sản phẩm
  const [detail, setDetail] = useState({
    size_id: '',
    color_id: '',
    description: '',
    product_id: id, // Gán product_id từ URL
    isFeature: false,
    isHot: false
  });

  // State cho danh sách size và color
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);

  // Fetch danh sách size và color
  useEffect(() => {
    const fetchData = async () => {
      try {
        const sizeResponse = await axios.get("http://localhost:8000/detail/size");
        setSizes(sizeResponse.data);

        const colorResponse = await axios.get("http://localhost:8000/detail/color");
        setColors(colorResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.");
      }
    };

    fetchData();
  }, []);

  // Xử lý thay đổi input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetail((prevDetail) => ({
      ...prevDetail,
      [name]: name === 'isFeature' || name === 'isHot' ? e.target.checked : value,
    }));
  };

  const [image, setImage] = useState(null);

  // Gửi dữ liệu chi tiết sản phẩm
  const submitDuLieu = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('size_id', detail.size_id);
    formData.append('color_id', detail.color_id);
    formData.append('description', detail.description);
    formData.append('product_id', detail.product_id);
    formData.append('isFeature', detail.isFeature);
    formData.append('isHot', detail.isHot);
    if (image) formData.append('product_image', image);

    try {
        // Gửi dữ liệu tới server
        await axios.post(`http://localhost:8000/productdetail${id}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert("Đã thêm chi tiết sản phẩm thành công!");
        navigate(`/admin/productlist/${id}`);
    } catch (error) {
        console.error("Lỗi khi thêm chi tiết sản phẩm:", error.response ? error.response.data : error);
        alert("Có lỗi xảy ra. Vui lòng thử lại!");
    }
};

  return (
    <form id="frmaddproduct" className="frmaddproduct" onSubmit={submitDuLieu}>
      <h2>Thêm chi tiết sản phẩm</h2>

      <div className="col">Mô tả:
        <textarea
          value={detail.description}
          className="form-control"
          name="description"
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="col">Size:
        <select
          className="form-control"
          name="size_id"
          value={detail.size_id}
          onChange={handleChange}
          required
        >
          <option value="">Chọn size</option>
          {sizes.map((size) => (
            <option key={size.size_id} value={size.size_id}>
              {size.size_name}
            </option>
          ))}
        </select>
      </div>

      <div className="col">Màu sắc:
        <select
          className="form-control"
          name="color_id"
          value={detail.color_id}
          onChange={handleChange}
          required
        >
          <option value="">Chọn màu sắc</option>
          {colors.map((color) => (
            <option key={color.color_id} value={color.color_id}>
              {color.color_name}
            </option>
          ))}
        </select>
      </div>

      <div className="col">Nổi bật:
        <input
          type="checkbox"
          name="isFeature"
          checked={detail.isFeature}
          onChange={handleChange}
        />
      </div>

      <div className="col">Sản phẩm hot:
        <input
          type="checkbox"
          name="isHot"
          checked={detail.isHot}
          onChange={handleChange}
        />
      </div>

      <div className="col">Ảnh sản phẩm:
        <input
            type="file"
            className="form-control"
            onChange={(e) => setImage(e.target.files[0])}
            accept="image/*"
        />
      </div>

      <div className="mb-3">
        <button className="add-btn-products" type="submit">Thêm chi tiết</button>
        &nbsp;
        <Link to={`/admin/productlist/${id}`} className="btn-products-list">Danh sách chi tiết</Link>
      </div>
    </form>
  );
}

export default DetailAdd;
