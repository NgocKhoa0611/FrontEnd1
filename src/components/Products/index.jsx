import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from "../ui/Product";
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import "./index.css";
import Loading from "../ui/Loading";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");  // State for color filter
  const [selectedSize, setSelectedSize] = useState("");  // State for size filter
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(12);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [minSliderValue, setMinSliderValue] = useState(0);
  const [maxSliderValue, setMaxSliderValue] = useState(1000000);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productRes, categoryRes, colorRes, sizeRes] = await Promise.all([
          axios.get("http://localhost:8000/product"),
          axios.get("http://localhost:8000/category"),
          axios.get("http://localhost:8000/detail/color"),
          axios.get("http://localhost:8000/detail/size"),
        ]);

        setProducts(productRes.data);
        setCategories(categoryRes.data);
        setColors(colorRes.data);
        setSizes(sizeRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lọc sản phẩm theo màu sắc và kích cỡ
  const filteredProducts = products.filter((product) => {
    // Kiểm tra điều kiện lọc
    const isPriceInRange = (product.price_promotion >= minPrice && product.price_promotion <= maxPrice) ||
      (product.price >= minPrice && product.price <= maxPrice);
    const isCategoryMatch = selectedCategory ? product.category_id === selectedCategory : true;
    const isColorMatch = selectedColor ? product.color_id === selectedColor : true;  // Lọc theo màu sắc
    const isSizeMatch = selectedSize ? product.size_id === selectedSize : true;  // Lọc theo kích cỡ
    const isNotHidden = product.is_hidden === 0;  // Chỉ hiển thị sản phẩm không ẩn

    return isPriceInRange && isCategoryMatch && isColorMatch && isSizeMatch && isNotHidden;
  });

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleMinSliderChange = (e) => {
    const newMin = Math.min(Number(e.target.value), maxSliderValue);
    setMinSliderValue(newMin);
    setMinPrice(newMin);
  };

  const handleMaxSliderChange = (e) => {
    const newMax = Math.max(Number(e.target.value), minSliderValue);
    setMaxSliderValue(newMax);
    setMaxPrice(newMax);
  };

  const handleMinPriceChange = (e) => {
    const newMinPrice = Math.min(Number(e.target.value), maxPrice);
    setMinPrice(newMinPrice);
    setMinSliderValue(newMinPrice);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Math.max(Number(e.target.value), minPrice);
    setMaxPrice(newMaxPrice);
    setMaxSliderValue(newMaxPrice);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="filter-container col-span-1">
          <h3 className="text-xl font-semibold mb-4">Lọc Sản phẩm</h3>

          {/* Bộ lọc theo danh mục */}
          <div className="category-filter mb-4">
            <label htmlFor="category">Danh mục:</label>
            <select
              id="category"
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border p-2 w-full"
            >
              <option value="">Tất cả</option>
              {categories.map((category) => (
                <option key={category.category_id} value={category.category_id}>
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>

          {/* Bộ lọc theo khoảng giá */}
          <div className="price-filter mb-4">
            <label>Khoảng Giá:</label>
            <div className="flex justify-between mb-2">
              <input
                type="number"
                value={minPrice}
                onChange={handleMinPriceChange}
                placeholder="Giá Tối Thiểu"
                className="border p-2 w-full mr-2"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={handleMaxPriceChange}
                placeholder="Giá Lớn Nhất"
                className="border p-2 w-full"
              />
            </div>
            <div className="flex items-center">
              <input
                type="range"
                min="0"
                max="1000000"
                value={minSliderValue}
                onChange={handleMinSliderChange}
                className="w-1/2 mr-2"
              />
              <input
                type="range"
                min="0"
                max="1000000"
                value={maxSliderValue}
                onChange={handleMaxSliderChange}
                className="w-1/2"
              />
            </div>
          </div>

          {/* Bộ lọc theo màu */}
          <div className="color-filter mb-4">
            <label htmlFor="color">Màu sắc:</label>
            <select
              id="color"
              value={selectedColor}
              onChange={(e) => {
                setSelectedColor(e.target.value);
                setCurrentPage(1);
              }}
              className="border p-2 w-full"
            >
              <option value="">Tất cả</option>
              {colors.map((color) => (
                <option key={color.color_id} value={color.color_id}>
                  {color.color_name}
                </option>
              ))}
            </select>
          </div>

          {/* Bộ lọc theo kích cỡ */}
          <div className="size-filter mb-4">
            <label htmlFor="size">Kích cỡ:</label>
            <select
              id="size"
              value={selectedSize}
              onChange={(e) => {
                setSelectedSize(Number(e.target.value));  // Ensure it's a number
                setCurrentPage(1);
              }}
              className="border p-2 w-full"
            >
              <option value="">Tất cả</option>
              {sizes.map((size) => (
                <option key={size.size_id} value={size.size_id}>
                  {size.size_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="products-container col-span-3">
          <h2 className="text-2xl font-bold mb-4">Tất cả Sản phẩm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <Product key={product.product_id} shopItems={product} />
            ))}
          </div>

          <div className="pagination mt-4 flex justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-l-lg"
            >
              <FaArrowLeft />
            </button>
            {[...Array(totalPages).keys()].map((number) => (
              <button
                key={number + 1}
                onClick={() => handlePageChange(number + 1)}
                className={`px-4 py-2 ${currentPage === number + 1 ? 'bg-blue-500 text-white' : 'bg-white text-black'}`}
              >
                {number + 1}
              </button>
            ))}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-r-lg"
            >
              <FaArrowRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
