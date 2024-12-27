import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import CartItem from "./cart/CartItem";
import CartSummary from "./cart/CartSummary";
import { IoIosTrash } from "react-icons/io";
const Cart = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();

  // Fungsi untuk kembali ke halaman sebelumnya
  const goBack = () => {
    navigate(-1);
  };

  const toggleCheck = (id) => {
    dispatch({ type: "TOGGLE_ITEM_CHECK", payload: id });
  };

  const toggleCheckAll = () => {
    dispatch({ type: "TOGGLE_CHECK_ALL" });
  };

  const removeCheckedItems = () => {
    dispatch({ type: "REMOVE_CHECKED_ITEMS" });
  };

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
  };
  const updateDuration = (id, duration) => {
    if (duration < 1) return;
    dispatch({ type: "UPDATE_DURATION", payload: { id, duration } });
  };

  const removeItem = (id) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: id });
  };

  // Hitung total berdasarkan item yang dicentang
  const checkedItems = state.items.filter((item) => item.checked);
  const totalPrice = checkedItems.reduce(
    (sum, item) => sum + item.price * item.duration * item.quantity,
    0
  );

  const handleCheckout = () => {
    if (checkedItems.length === 0) {
      alert("Please select items to checkout");
      return;
    }
    navigate("/checkout");
  };

  if (state.items.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
        <p className="text-center text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  const allChecked = state.items.every((item) => item.checked);
  const someChecked = state.items.some((item) => item.checked);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-300 transition"
      >
        Back
      </button>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <input
            type="checkbox"
            checked={allChecked}
            onChange={toggleCheckAll}
            className="h-4 w-4"
          />
          <span>Select All</span>
        </div>
        {someChecked && (
          <button
            onClick={removeCheckedItems}
            className="text-red-500 hover:text-red-700"
          >
            <IoIosTrash className="text-3xl mr-0.5" />
          </button>
        )}
      </div>

      <div className="space-y-4">
        {state.items.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onToggleCheck={toggleCheck}
            onUpdateQuantity={updateQuantity}
            onUpdateDuration={updateDuration}
            onRemove={removeItem}
          />
        ))}
      </div>

      {/* Tampilkan total hanya jika ada item yang dicentang */}
      {checkedItems.length > 0 && (
        <CartSummary totalPrice={totalPrice} onCheckout={handleCheckout} />
      )}
    </div>
  );
};

export default Cart;
