import { calculateTotalPrice } from "@/utils/calculations";
import { getImageUrl } from "@/utils/helpers";
const CartPopup = ({
  isOpen,
  onClose,
  product,
  quantity,
  duration,
  onConfirm,
}) => {
  if (!isOpen || !product) return null;

  const totalPrice = calculateTotalPrice({ ...product, quantity, duration });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold text-green-600">
            Confirm Add to Cart
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="flex items-center gap-4 mb-4">
          <img
            src={getImageUrl(product.image)}
            alt={product.name}
            className="w-20 h-20 object-cover rounded"
          />
          <div>
            <h4 className="font-medium">{product.name}</h4>
            <p className="text-gray-600">Quantity: {quantity}</p>
            <p className="text-gray-600">Duration: {duration} month</p>
          </div>
        </div>

        <div className="border-t pt-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Subtotal ({quantity} items):</span>
            {/* <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price * quantity)}
            </span> */}
          </div>
          <div className="flex justify-between text-sm">
            <span>Duration Cost ({duration} Month):</span>
            <span>
              {new Intl.NumberFormat("id-ID", {
                style: "currency",
                currency: "IDR",
              }).format(product.price * duration)}{" "}
              <span className="text-md">
                x{""}
                {quantity}
              </span>
            </span>
          </div>
          <div className="flex justify-between font-bold pt-2 border-t">
            <span>Total:</span>
            <span>Rp.{totalPrice.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartPopup;
