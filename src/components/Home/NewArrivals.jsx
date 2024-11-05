import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../ui/Product";
import { useState, useEffect } from "react";
import axios from "axios";

const NewArrivals = () => {
  const [shopItems, setShopItems] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
  };

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/product/new");
        setShopItems(response.data);
      } catch (error) {
        console.error("Error fetching new products:", error);
      } finally {
        setLoading(false); // Set loading to false once the fetch is complete
      }
    };

    fetchNewProducts();
  }, []);

  return (
    <section className="Discount background NewArrivals">
      <div className="container">
        <div className="heading d_flex">
          <div className="heading-left row f_flex">
            <img src="https://img.icons8.com/glyph-neue/64/26e07f/new.png" alt="New Products Icon" />
            <h2>Sản phẩm mới</h2>
          </div>
          <div className="heading-right row">
            <span>Xem tất cả</span>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>
        
        {loading ? (
          <div>Loading...</div> // Loading message while fetching data
        ) : (
          <Slider {...settings}>
            {shopItems.length > 0 ? (
              shopItems.map((item) => {
                return <Product key={item.id} shopItems={item} />; // Use unique id as key
              })
            ) : (
              <div>Không có sản phẩm mới nào.</div> // Message if no new products are available
            )}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default NewArrivals;
