import { calculateTotalPrice, formatPrice } from "@/utils/calculations";
import { getImageUrl } from "@/utils/helpers";
const CartItem = ({
  item,
  onToggleCheck,
  onUpdateQuantity,
  onUpdateDuration,
  onRemove,
}) => {
  const totalPrice = calculateTotalPrice({ ...item });
  return (
    <div className="flex items-center border p-4 rounded bg-white">
      <input
        type="checkbox"
        checked={item.checked}
        onChange={() => onToggleCheck(item.id)}
        className="mr-4 h-4 w-4"
      />
      <img
        src={getImageUrl(item.image)}
        alt={item.name}
        className="w-20 h-20 object-cover rounded mr-4"
      />
      <div className="flex-grow">
        <h3 className="font-semibold">{item.name}</h3>
        <p className="text-gray-600">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(item.price)}
          /Month
        </p>

        <div className="mt-2 space-y-2">
          <div className="flex items-center gap-4">
            <label className="text-sm">Quantity:</label>
            <div className="flex items-center border rounded">
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                className="px-2 py-1 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{item.quantity}</span>
              <button
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="px-2 py-1 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="text-sm">Duration:</label>
            <div className="flex items-center border rounded">
              <button
                onClick={() => onUpdateDuration(item.id, item.duration - 1)}
                className="px-2 py-1 border-r hover:bg-gray-100"
              >
                -
              </button>
              <span className="px-4 py-1">{item.duration} month</span>
              <button
                onClick={() => onUpdateDuration(item.id, item.duration + 1)}
                className="px-2 py-1 border-l hover:bg-gray-100"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="text-right ml-4">
        <p className="font-bold">Rp.{totalPrice.toLocaleString()}</p>
        <button
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 text-sm mt-2"
        >
          Remove
        </button>
      </div>
    </div>
  );
};

export default CartItem;
