import { useEffect, useState } from "react";
import Banner from "./Banner";
import NewArrivals from "./NewArrivals";
import Discount from "./Discount";
import Shop from "./Shop";
import Annocument from "./Annocument";
import Wrapper from "./Wrapper";
import Loading from "../ui/Loading";
import axios from "axios";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("https://672768ed270bd0b975523606.mockapi.io/products")
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (  loading) {
    return <Loading />;
  }

  return (
    <>
      <Banner />
      <NewArrivals products={products} />
      <Discount />
      <Shop products={products} />
      <Annocument />
      <Wrapper />
    </>
  );
}
