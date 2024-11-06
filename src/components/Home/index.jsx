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

  return (
    <>
      <Banner />
      <NewArrivals />
      <Discount />
      <Shop />
      <Annocument />
      <Wrapper />
    </>
  );
}
