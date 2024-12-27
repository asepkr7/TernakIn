import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import { FaShoppingCart } from "react-icons/fa";

const CartBadge = () => {
  const { state } = useCart();
  const CartItemCount = state.items.length;

  return (
    <Link
      to="/cart" // Pastikan ini mengarah ke halaman keranjang
      className="flex items-center relative group" // Tambahkan "relative" dan "group"
    >
      {/* Icon Wrapper with Hover Animation */}
      <div className="p-2 rounded-full bg-[#f0f0f0]  group-hover:bg-gray-200 transition-all duration-300 animate-on-hover">
        <FaShoppingCart className="h-6 w-6 group-hover:text-green-500 transition-all duration-300 shadow-inner" />
      </div>
      {/* Badge */}
      {CartItemCount > 0 && (
        <span className="absolute -top-0.5 -right-1 mt-3 bg-green-500 text-white rounded-full px-1 scroll-py-0.5 text-[10px] font-bold">
          {CartItemCount}
        </span>
      )}
    </Link>
  );
};

export default CartBadge;
