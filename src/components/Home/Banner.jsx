import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const images = [
  "/images/banner_home.jpg",
  "/images/banner_home.jpg",
  "/images/banner_home.jpg",
  "/images/banner_home.jpg",
  "/images/banner_home.jpg",
];

const Banner = () => {
  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };
  return (
    <div className="w-full block overflow-hidden mb-5">
      <Slider {...settings}>
        {images.map((src, index) => (
          <div key={index} className="sm:h-[500px] h-[300px] ">
            <img
              src={src}
              alt={`Banner ${index + 1}`}
              className="w-full h-full object-cover bg-center block"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Banner;
