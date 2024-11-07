import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../ui/Product";
import { useState, useEffect } from "react";
import axios from "axios";

const Discount = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading

  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  };

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/product");
        setDiscountedProducts(response.data);
      } catch (error) {
        console.error("Error fetching discounted products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscountedProducts();
  }, []);

  return (
    <section className="Discount background NewArrivals">
      <div className="container">
        <div className="heading d_flex">
          <div className="heading-left row f_flex">
            <img src="https://img.icons8.com/windows/32/fa314a/gift.png" alt="Discount Icon" />
            <h2>Sản phẩm giảm giá</h2>
          </div>
          <div className="heading-right row">
            <span>Xem tất cả</span>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>

        {loading ? (
          <div>Loading...</div>
        ) : (
          <Slider {...settings}>
            {discountedProducts.length > 0 ? (
              discountedProducts.map((item) => {
                return <Product key={item.id} shopItems={item} />;
              })
            ) : (
              <div>Không có sản phẩm giảm giá nào.</div>
            )}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default Discount;

