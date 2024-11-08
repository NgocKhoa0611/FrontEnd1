import { Link } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function Product({ shopItems = {} }) {
  const { product_id, product_name, price, price_promotion, detail = [] } = shopItems;
  const imageUrl = `http://localhost:8000/img/${detail[0]?.productImage?.img_url || 'default-image.jpg'}`;

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart")) || [];
    const itemIndex = existingCart.findIndex(item => item.product_id === product_id);

    if (itemIndex !== -1) {
      existingCart[itemIndex] = { ...existingCart[itemIndex], quantity: existingCart[itemIndex].quantity + 1 };
    } else {
      existingCart.push({
        product_id,
        product_name,
        price,
        quantity: 1,
        image: imageUrl,
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));
    alert(`${product_name} đã thêm vào giỏ hàng`);
  };

  return (
    <div className="box">
      <div className="product mtop">
        <div className="img">
          <Link className="" to={`/product/${product_id}`}>
            <img   src={imageUrl} alt={product_name} />
          </Link>
        </div>
        <div className="product-details">
          <h5 className="text-center text-sm font-medium truncate" style={{ margin: '0' }}>
            {product_name}
          </h5>
          <div className="price">
            {price_promotion > 0 && (
              <h5 className="line-through text-gray-500">
                {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
            )}
            <h4>{price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ</h4>
            <button onClick={addToCart}>
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
