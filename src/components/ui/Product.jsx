// eslint-disable-next-line react/prop-types
export default function Product({ shopItems = {} }) {
  const { product_name, price, price_promotion, detail = [] } = shopItems;
  const imageUrl = `http://localhost:8000/img/${detail[0]?.productImage?.img_url || 'default-image.jpg'}`;

  return (
    <div className="box">
      <div className="product mtop">
        <div className="img">
          <img src={imageUrl} alt="" />
        </div>
        <div className="product-details">
          <h5 style={{ fontSize: '0.85rem', textAlign: 'center', margin: '0' }}>
            {product_name}
          </h5>
          <div className="price">
            {price_promotion > 0 && (
              <h5 style={{ textDecoration: 'line-through', color: 'gray' }}>
                {price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ
              </h5>
            )}
            <h4>{price.toLocaleString('vi-VN', { minimumFractionDigits: 0 })}đ</h4>
            <button>
              <i className="fa fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
