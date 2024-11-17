import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Product from "../ui/Product";  // Import the Product component
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';  // Import the icons
import "./Products.css"
import Loading from "../ui/Loading";  // Import the Loading component

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);  // Track current page
  const [productsPerPage] = useState(12);  // Number of products per page

  useEffect(() => {
    axios
      .get("http://localhost:8000/product")
      .then((response) => {
        setProducts(response.data);
        // Add a delay before setting loading to false
        setTimeout(() => {
          setLoading(false);
        }, 1000);  // Delay of 1 second (1000 ms)
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, []);

  // Get current products for the current page
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  // Calculate total number of pages
  const totalPages = Math.ceil(products.length / productsPerPage);

  // Change page
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <Loading />;  // Display the loading component
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Tất cả Sản phẩm</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentProducts.map((product) => {
          return (
            <Product key={product.product_id} shopItems={product} />
          );
        })}
      </div>

      {/* Pagination controls */}
      <div className="pagination mt-4 flex justify-center">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 border rounded-l-lg"
        >
          <FaArrowLeft />
        </button>

        {[...Array(totalPages).keys()].map((page) => {
          const pageNumber = page + 1;
          return (
            <button
              key={pageNumber}
              onClick={() => handlePageChange(pageNumber)}
              className={`px-4 py-2 border ${currentPage === pageNumber ? 'bg-blue-500 text-white' : 'bg-white'}`}
            >
              {pageNumber}
            </button>
          );
        })}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 border rounded-r-lg"
        >
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
};

export default Products;
