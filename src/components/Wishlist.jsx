import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { getImageUrl } from "@/utils/helpers";
import Navbar from "./Navbar";
import { Footer } from "./Footer";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
const Wishlist = () => {
  const { state, dispatch } = useWishlist();
  const { dispatch: cartDispatch } = useCart();

  // State untuk item yang ditampilkan dan jumlah item yang terlihat
  const [visibleWishlistItems, setVisibleWishlistItems] = useState([]);
  const [visibleCount, setVisibleCount] = useState(9); // Menampilkan 4 item awal

  useEffect(() => {
    // Inisialisasi item yang ditampilkan
    setVisibleWishlistItems(state.items.slice(0, visibleCount));
  }, [state.items, visibleCount]);

  const removeFromWishlist = (productId) => {
    dispatch({ type: "REMOVE_FROM_WISHLIST", payload: productId });
  };

  const moveToCart = (product) => {
    cartDispatch({ type: "ADD_TO_CART", payload: product });
    removeFromWishlist(product.id);
  };

  const loadMoreWishlistItems = () => {
    // Menambah jumlah item yang ditampilkan, tetapi tidak melebihi total item
    setVisibleCount((prevCount) =>
      Math.min(prevCount + visibleCount, state.items.length)
    );
  };
  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">My Wishlist</h2>

        {state.items.length === 0 ? (
          <p className="text-center text-gray-500">Your wishlist is empty</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {visibleWishlistItems.map((item) => (
              <div
                key={item.id}
                className="border bg-white rounded-lg shadow-lg p-4 flex gap-4"
              >
                <Link to={`/product-detail/${item.id}`}>
                  <img
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="w-24 h-24 object-cover rounded"
                  />
                </Link>

                <div className="flex-grow">
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-gray-600">${item.price}</p>
                  <div className="mt-2 flex gap-2">
                    <button
                      onClick={() => moveToCart(item)}
                      className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500"
                    >
                      Move to Cart
                    </button>
                    <button
                      onClick={() => removeFromWishlist(item.id)}
                      className="px-3 py-1 text-red-500 border border-red-500 rounded hover:bg-red-50"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tombol Load More */}
        {visibleWishlistItems.length < state.items.length && (
          <div className="flex justify-center mb-5 mt-10">
            <button
              className="px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-400 transition"
              onClick={loadMoreWishlistItems}
            >
              Load More
            </button>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};
export default Wishlist;
