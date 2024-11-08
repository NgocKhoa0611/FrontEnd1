import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { API_URL } from "../../../configs/varibles";
import axios from "axios";
import "./index.css";

const ProductDetails = () => {
  const { id } = useParams(); // Get product ID from route parameters
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Loading state to display loading spinner
  const [product, setProduct] = useState({});
  const [selectedSize, setSelectedSize] = useState("M");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fetch product data by ID
  useEffect(() => {
    axios
      .get(`${API_URL}/product/${id}`)
      .then((response) => {
        console.log("Product fetched:", response.data);
        setProduct(response.data);
        // Set default selected color if available
        setSelectedColor(response.data.detail[0]?.color?.color_name || "");
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleSizeSelect = (size) => setSelectedSize(size);
  const handleColorSelect = (color) => setSelectedColor(color);
  const incrementQuantity = () => setQuantity(quantity + 1);
  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Handle adding the product to the cart
  const handleAddToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if the product is already in the cart
    const existingProductIndex = existingCart.findIndex(
      (item) =>
        item.product_id === product.product_id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingProductIndex !== -1) {
      // If the product exists, update the quantity
      existingCart[existingProductIndex].quantity += quantity;
    } else {
      // If the product does not exist, add it to the cart
      existingCart.push({
        product_id: product.product_id,
        product_name: product.product_name,
        price: product.price,
        image: `${API_URL}/img/${product.detail[0]?.productImage?.img_url}`,
        size: selectedSize,
        color: selectedColor,
        quantity,
      });
    }

    // Save the updated cart to localStorage
    localStorage.setItem("cart", JSON.stringify(existingCart));
    console.log("Product added to cart", {
      product_name: product.product_name,
      selectedSize,
      selectedColor,
      quantity,
    });
  };

  const handleBuyNow = () => {
    // Add product to cart before navigating to checkout
    handleAddToCart();
    navigate("/checkout");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="product-detail">
      <div className="product-detail-top">
        <div className="product-image">
          <img src={`${API_URL}/img/${product.detail[0]?.productImage?.img_url}`} alt={product.product_name} />

          <div className="product-description">
            <h3>Thông tin sản phẩm</h3>
            <p>{product.detail[0]?.description || "No description available"}</p>
          </div>
        </div>

        <div className="product-info">
          <h1>{product.product_name}</h1>
          <p className="price">
            {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(product.price)}
          </p>

          <div className="options">
            <div className="size-selection">
              <h4>Kích thước:</h4>
              {["S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  onClick={() => handleSizeSelect(size)}
                  className={selectedSize === size ? "active" : ""}
                >
                  {size}
                </button>
              ))}
            </div>
            <div className="color-selection">
              <h4>Màu Sắc:</h4>
              <div className="color-options">
                {product.detail.map((detail) => (
                  <button
                    key={detail.color.color_id}
                    onClick={() => handleColorSelect(detail.color.color_name)}
                    className={`color-button ${selectedColor === detail.color.color_name ? "active" : ""}`}
                  >
                    <span className="color-name">{detail.color.color_name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="buy-container">
            <h4>Số lượng:</h4>
            <div className="buy-column">
              <div className="quantity-selector">
                <button className="decrement" onClick={decrementQuantity}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="increment" onClick={incrementQuantity}>+</button>
              </div>
              <div className="buttons">
                <button className="buy-now" onClick={handleBuyNow}>Mua Ngay</button>
                <button className="add-to-cart" onClick={handleAddToCart}>Thêm giỏ hàng</button>
              </div>
            </div>
          </div>

          <div className="contact-info">
            <p>GỌI ĐỂ MUA HÀNG NHANH HƠN</p>
            <h2>0123456789</h2>
            <p>Chính sách bán hàng</p>
            <p>
              <i className="fa-solid fa-truck-fast"></i> Chính sách bán hàng
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
