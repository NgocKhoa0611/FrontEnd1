import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Product from "../ui/Product";
import axios from "axios";
import hot from "../../../public/images/promotional.png";

const Shop = () => {
  const [shopItems, setShopItems] = useState([]);
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: true,
  };

  useEffect(() => {
    const fetchHotProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8000/product/feature");
        setShopItems(response.data);
      } catch (error) {
        console.error("Error fetching hot products:", error);
      }
    };

    fetchHotProducts();
  }, []);

  return (
    <section className="Discount background NewArrivals">
      <div className="container">
        <div className="heading d_flex">
          <div className="heading-left row f_flex">
            <img src={hot} alt="Promotional" />
            <h2>Sản phẩm nổi bật</h2>
          </div>
          <div className="heading-right row">
            <span>Xem tất cả</span>
            <i className="fa-solid fa-caret-right"></i>
          </div>
        </div>
        <Slider {...settings}>
          {shopItems.map((item, index) => {
            return <Product key={index} shopItems={item} />;
          })}
        </Slider>
      </div>
    </section>
  );
};

export default Shop;
