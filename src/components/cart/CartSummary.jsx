const CartSummary = ({ totalPrice, onCheckout }) => {
  return (
    <div className="mt-6 border-t pt-4">
      <div className="flex justify-between items-center mb-4">
        <span className="text-xl font-bold">Total:</span>
        <span className="text-xl">Rp.{totalPrice.toLocaleString()}</span>
      </div>
      <button
        onClick={onCheckout}
        className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        Proceed to Checkout
      </button>
    </div>
  );
};

export default CartSummary;
