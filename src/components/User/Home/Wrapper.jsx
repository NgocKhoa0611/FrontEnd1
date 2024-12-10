const Wrapper = () => {
  const data = [
    {
      cover: <i className="fa-solid fa-truck-fast"></i>,
      title: "Giao Hàng Toàn Cầu",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-id-card"></i>,
      title: "Thanh Toán An Toàn",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-shield"></i>,
      title: "Mua Sắm Tự Tin",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
    {
      cover: <i className="fa-solid fa-headset"></i>,
      title: "Hỗ Trợ 24/7",
      decs: "Chúng tôi cung cấp mức giá cạnh tranh trên hơn 100 triệu sản phẩm thuộc mọi loại.",
    },
  ];

  return (
    <>
      <section className="wrapper background">
        <div className="container grid2">
          {data.map((val, index) => {
            return (
              <div className="product" key={index}>
                <div className="img icon-circle">
                  <i>{val.cover}</i>
                </div>
                <h3>{val.title}</h3>
                <p>{val.decs}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default Wrapper;
