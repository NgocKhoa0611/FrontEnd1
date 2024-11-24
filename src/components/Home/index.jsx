import { useEffect, useState } from "react";
import Banner from "./Banner";
import NewArrivals from "./NewArrivals";
import Discount from "./Discount";
import Shop from "./Shop";
import Annocument from "./Annocument";
import Wrapper from "./Wrapper";


export default function Home() {
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