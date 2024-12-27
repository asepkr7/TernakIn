import { useWishlist } from "@/context/WishlistContext";
import { IoIosHeart } from "react-icons/io";
import { FaHeart } from "react-icons/fa6";
import { Link } from "react-router-dom";

const WishlistBadge = () => {
  const { state } = useWishlist();
  const wishlistItemCount = state.items.length;

  return (
    <Link
      to={"/wishlist"}
      className="flex items-center relative group " // Tambahkan "relative" dan "group"
    >
      {/* Icon Wrapper with Hover Animation */}
      <div className="p-2 rounded-full bg-[#f0f0f0]  hover:bg-gray-100  group-hover:bg-gray-200 transition-all duration-300 animate-on-hover">
        <FaHeart className="h-5 w-5 m-0.5 group-hover:text-red-500 transition-all duration-300 " />
      </div>
      {/* Badge */}
      {wishlistItemCount > 0 && (
        <span className="absolute -top-0.5 -right-1 mt-3 bg-red-500 text-white rounded-full px-1 scroll-py-0.5 text-[10px] font-bold">
          {wishlistItemCount}
        </span>
      )}
    </Link>
  );
};

export default WishlistBadge;
