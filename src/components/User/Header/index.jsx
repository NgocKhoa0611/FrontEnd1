import Head from "./Head";
import Search from "./Search";
import Navbar from "./Navbar";

const Header = () => {
  return (
    <section className="sticky top-0 z-10 bg-white shadow-md">
      <Head />
      <Search />
      <Navbar />
    </section>
  );
};

export default Header;
