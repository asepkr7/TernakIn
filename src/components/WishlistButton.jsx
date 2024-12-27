import { useWishlist } from "../context/WishlistContext";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
const WishlistButton = ({ products }) => {
  const { state, dispatch } = useWishlist();
  const isWishlisted = state.items.some((item) => item.id === products.id);

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (isWishlisted) {
      dispatch({ type: "REMOVE_FROM_WISHLIST", payload: products.id });
    } else {
      dispatch({ type: "ADD_TO_WISHLIST", payload: products });
    }
  };

  return (
    <button
      onClick={toggleWishlist}
      className="absolute -top-3 -right-3 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 group-hover:scale-105 transform transition-all duration-300 ease-in-out hover:bg-gray-100"
    >
      {isWishlisted ? (
        <IoIosHeart className="h-5 w-5 text-red-500" />
      ) : (
        <IoIosHeartEmpty className="h-5 w-5 text-gray-500" />
      )}
    </button>
  );
};

export default WishlistButton;
