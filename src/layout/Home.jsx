import ProductList from "@/components/ProductList";
import Navbar from "../components/navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import Wishlist from "@/components/Wishlist";

const Home = () => {
  return (
    <>
      <Navbar />
      <ProductList />
      {/* <Wishlist /> */}
      <Footer />
    </>
  );
};

export default Home;
