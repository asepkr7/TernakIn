import { useCart } from "@/context/CartContext";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getImageUrl } from "@/utils/helpers";
import Cookies from "js-cookie";
import axiosInstance from "@/server/axios";
const Checkout = () => {
  const { state, dispatch } = useCart();
  const navigate = useNavigate();
  const [validationErrors, setValidationErrors] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("credit_card");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });
  const goBack = () => {
    navigate(-1);
  };
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Ambil data user dari cookies
    const userData = Cookies.get("user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      const fetchProfile = async () => {
        const token = Cookies.get("token");
        axiosInstance.defaults.headers.common["Authorization"] = token;
        try {
          const response = await axiosInstance.get(`api/profiles/${user.id}`);
          const profile = response.data.data;
          setShippingAddress({
            name: profile.name,
            address: profile.address,
            postalCode: profile.postalCode,
            city: profile.city,
            phoneNumber: profile.phoneNumber,
          });
        } catch (error) {
          console.error("Failed to fetch profile:", error);
        }
      };
      fetchProfile();
    }
  }, [user]);
  const checkedItems = state.items.filter((item) => item.checked);
  const totalPrice = checkedItems.reduce(
    (sum, item) => sum + item.price * item.duration * item.quantity,
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    const transaction = checkedItems.map((item) => ({
      fieldId: item.id,
      qty: item.quantity,
      duration: item.duration,
      totalPrice: item.price * item.duration * item.quantity,
      name: item.name,
      sellerName: item.sellerName,
      image: item.image,
      paymentMethod,
    }));

    // Generate payment code (e.g., 6-digit random number)
    const paymentCode = Math.floor(100000 + Math.random() * 900000);

    const payload = {
      items: transaction,
      paymentMethod,
      paymentCode, // Include the generated payment code
    };

    const token = Cookies.get("token");
    axiosInstance.defaults.headers.common["Authorization"] = token;

    try {
      const response = await axiosInstance.post("api/transactions", payload);
      alert("Order placed successfully!");
      dispatch({ type: "CLEAR_CART" });
      console.log(response.data.data[0].id);
      // Navigate to Invoice with transaction data and payment code
      navigate("/invoice", {
        state: {
          items: transaction,
          totalPrice: transaction.reduce(
            (sum, item) => sum + item.totalPrice,
            0
          ),
          paymentMethod,
          paymentCode, // Send the generated payment code
          transactionId: response.data.data[0].id, // From the API response
        },
      });
    } catch (error) {
      console.log(error.response.data);
      if (error.response) {
        const { data } = error.response;
        setValidationErrors(data.errors || []);
        alert(data.message || "Validation failed");
      } else {
        alert("Something went wrong. Please try again");
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button
        onClick={goBack}
        className="mb-4 px-4 py-2  text-white bg-green-600 rounded-lg hover:bg-green-300 transition"
      >
        Back
      </button>
      <h2 className="text-2xl font-bold mb-6">Checkout</h2>

      <div className="grid grid-cols-1 bg-white rounded-lg px-3 py-3 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Shipping Information</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* {checkedItems.map((item, index) => ( */}
            {validationErrors.length > 0 && (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-4">
                <ul>
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error.msg}</li>
                  ))}
                </ul>
              </div>
            )}
            <div key={user?.id} className="border-b pb-4 mb-4">
              <h4 className="text-lg font-semibold mb-2"></h4>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2"
                  value={user?.name}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Address
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2"
                  value={shippingAddress?.address}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">City</label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2"
                  value={shippingAddress?.city}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Postal Code
                </label>
                <input
                  type="text"
                  required
                  className="w-full border rounded-lg p-2"
                  value={shippingAddress?.postalCode}
                  disabled
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full border rounded-lg p-2"
                  value={shippingAddress.phoneNumber}
                  disabled
                />
              </div>
            </div>
            {/* ))} */}
          </form>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3>
          <div className="border rounded-lg p-4 mb-4">
            {checkedItems.map((item) => (
              <div key={item.id} className="flex justify-between mb-2">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded mr-1"
                />
                <span>
                  {item.name} x {item.quantity}
                  <p>{item.city}</p>
                  <p>{item.type}</p>
                </span>
                <span>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t mt-4 pt-4">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>Rp.{totalPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-4">Payment Method</h3>
          <div className="space-y-2 mb-6">
            <div>
              <input
                type="radio"
                id="credit_card"
                name="payment"
                value="credit_card"
                checked={paymentMethod === "credit_card"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="credit_card">Credit Card</label>
            </div>
            <div>
              <input
                type="radio"
                id="bank_transfer"
                name="payment"
                value="bank_transfer"
                checked={paymentMethod === "bank_transfer"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="bank_transfer">Bank Transfer</label>
            </div>
            <div>
              <input
                type="radio"
                id="ewallet"
                name="payment"
                value="ewallet"
                checked={paymentMethod === "ewallet"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="mr-2"
              />
              <label htmlFor="ewallet">E-Wallet</label>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
          >
            Place Order
          </button>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
