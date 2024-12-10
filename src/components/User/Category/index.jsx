import Product from "../ui/Product";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

export default function Category() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [categoryName, setCategoryName] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:8000/category/${id}`)
      .then((response) => {
        setCategoryName(response.data.category_name);
        setIsHidden(response.data.is_hidden)
        console.log(response.data.category_name);
      })
      .catch((error) => {
        console.error("Error fetching category details:", error);
      });

    axios.get(`http://localhost:8000/product/category/${id}`)
      .then((response) => {
        const visibleProducts = response.data.filter(product => !product.is_hidden);
        setProducts(visibleProducts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setLoading(false);
      });
  }, [id]);

  if ((products.length === 0 && !loading)) {
    return <p>Danh mục này hiện không có sản phẩm.</p>;
  }

  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:max-w-screen-xl lg:px-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Danh mục: {categoryName || 'Loading...'}
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((product, index) => (
              <Product key={index} shopItems={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
