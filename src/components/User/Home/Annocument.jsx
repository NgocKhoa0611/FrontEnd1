const Annocument = () => {
  const mystyle = {
    width: "30%",
    height: "340px",
  };
  const mystyle1 = {
    width: "68%",
    height: "340px",
  };
  return (
    <>
      <section className="annocument background">
        <div className="container d_flex">
          <div style={mystyle}>
            <img src="./images/banner-1.png" className="w-full h-full rounded-md" />
          </div>
          <div style={mystyle1}>
            <img src="./images/banner-2.png" className="w-full h-full rounded-md" />
          </div>
        </div>
      </section>
    </>
  );
};

export default Annocument;
