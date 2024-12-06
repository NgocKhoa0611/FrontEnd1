import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './Categories.css';
import axios from 'axios';

function CategoriesList() {
    const [categories, setCategories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const categoriesPerPage = 5; // Số lượng danh mục mỗi trang

    const fetchCategories = async () => {
        try {
            const response = await fetch("http://localhost:8000/category");
            if (!response.ok) throw new Error("Lỗi khi lấy danh mục");
            const data = await response.json();
            setCategories(data);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const hideCategory = async (category_id, is_hidden) => {
        const newStatus = is_hidden ? "show" : "hide";
        if (window.confirm(`Bạn có chắc chắn muốn ${newStatus} danh mục này?`)) {
            try {
                const response = await axios.patch(`http://localhost:8000/category/${newStatus}/${category_id}`, {}, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                if (response.status === 200) {
                    console.log(`Danh mục đã được ${newStatus} thành công`);
                    fetchCategories();
                } else {
                    console.error("Lỗi khi thay đổi trạng thái danh mục");
                }
            } catch (error) {
                console.error("Error changing category status:", error);
            }
        }
    };

    // Phân trang logic
    const indexOfLastCategory = currentPage * categoriesPerPage;
    const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
    const currentCategories = categories.slice(indexOfFirstCategory, indexOfLastCategory);

    const totalPages = Math.ceil(categories.length / categoriesPerPage);

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

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <div className="categories-table">
            <h3 className="title-page">Danh sách danh mục</h3>
            <div className="d-flex justify-content-between align-items-center mb-3">
                <Link to={`add-categories`} href="/#" id="mb-2" className="add-btn-categories">Thêm danh mục</Link>
                <form className="d-flex" role="search">
                    <input className="form-control-search-categories" type="search" placeholder="Tìm kiếm danh mục..." aria-label="Search" />
                    <button className="search-btn-catgories" type="submit">Tìm kiếm</button>
                </form>
            </div>
            <table id="example" className="table table-hover">
                <thead>
                    <tr>
                        <th>ID danh mục</th>
                        <th>ID danh mục cha</th>
                        <th>Tên danh mục</th>
                        <th>Công cụ</th>
                    </tr>
                </thead>
                <tbody>
                    {currentCategories.map((category) => (
                        <tr key={category.category_id}>
                            <td>{category.category_id}</td>
                            <td>{category.category_parent_id}</td>
                            <td>{category.category_name}</td>
                            <td>
                                <Link to={`/categories/edit-categories/${category.category_id}`} className="edit-btn">Sửa</Link>
                                <button
                                    className={`hide-btn-categories ${category.is_hidden ? 'show-text' : ''}`}
                                    onClick={() => hideCategory(category.category_id, category.is_hidden)}
                                >
                                    {category.is_hidden ? "Hiện" : "Ẩn"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1} className="pagination-btn">
                    Trang trước
                </button>
                <span className="pagination-info">
                    Trang {currentPage} / {totalPages}
                </span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages} className="pagination-btn">
                    Trang sau
                </button>
            </div>
        </div>
    );
}

export default CategoriesList;
