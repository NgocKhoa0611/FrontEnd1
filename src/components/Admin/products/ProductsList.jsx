import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from 'axios';
import './Products.css';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortOrder, setSortOrder] = useState('asc');
  const productsPerPage = 10; // Số sản phẩm trên mỗi trang

  const fetchProduct = async () => {
    try {
      const response = await fetch("http://localhost:8000/product");
      if (!response.ok) throw new Error("Lỗi khi lấy danh mục");
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortOrder === 'asc') {
      return a.product_id - b.product_id;
    } else {
      return b.product_id - a.product_id;
    }
  })

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const handleSortById = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const hideProduct = async (product_id, is_hidden) => {
    const newStatus = is_hidden ? "show" : "hide";
    if (window.confirm(`Bạn có chắc chắn muốn ${newStatus} danh mục này?`)) {
      try {
        const response = await axios.patch(`http://localhost:8000/product/${newStatus}/${product_id}`, {}, {
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (response.status === 200) {
          console.log(`Sản phẩm đã được ${newStatus} thành công`);
          fetchProduct();
        } else {
          console.error("Lỗi khi thay đổi trạng thái sản phẩm");
        }
      } catch (error) {
        console.error("Error changing product status:", error);
      }
    }
  };
  useEffect(() => {
    fetchProduct();
  }, []);

  return (
    <div className="products-table">
      <h3 className="title-page">Danh sách sản phẩm</h3>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Link to={`add-product`} id="mb-2" className="add-btn-products">Thêm sản phẩm</Link>
        <form className="d-flex" role="search" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control-search-products"
            type="search"
            placeholder="Tìm kiếm sản phẩm..."
            aria-label="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="search-btn-products" type="submit">Tìm kiếm</button>
        </form>
      </div>
      <table id="example" className="table table-hover">
        <thead>
          <tr>
            <th style={{ width: '10%' }}>
              <span>ID</span>
              <button className="sort-btn" onClick={handleSortById}>
                {sortOrder === 'asc' ? '↑' : '↓'}
              </button>
            </th>
            <th>Tên sản phẩm</th>
            <th style={{ width: '10%' }}>Giá</th>
            <th style={{ width: '10%' }}> Giá khuyến mãi</th>
            <th>Công cụ</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map(product => (
            <tr key={product.product_id}>
              <td>{product.product_id}</td>
              <td>{product.product_name}</td>
              <td>{product.price}</td>
              <td>{product.price_promotion}</td>
              <td>
                <Link to={`/product/${product.product_id}`} className="detail-btn">
                  Chi tiết
                </Link>

                <Link to={`/product/edit-product/${product.product_id}`} className="edit-btn"> Sửa</Link>
                <button
                  className={`hide-btn-products ${product.is_hidden ? 'show-text' : ''}`}
                  onClick={() => hideProduct(product.product_id, product.is_hidden)}
                >
                  {product.is_hidden ? "Hiện" : "Ẩn"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination controls */}
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>Trang trước</button>
        <span>Trang {currentPage} / {totalPages}</span>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Trang sau</button>
      </div>
    </div>
  );
}

export default ProductList;
