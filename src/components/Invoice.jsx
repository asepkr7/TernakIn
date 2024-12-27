import { Link, useLocation, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { formatPrice } from "@/utils/priceFormatter";
import { Separator } from "./ui/separator";
import Cookies from "js-cookie";
import axiosInstance from "@/server/axios";
import { getImageUrl } from "@/utils/helpers";
const Invoice = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  // Data yang diterima dari Checkout
  const {
    items = [],
    totalPrice = 0,
    paymentMethod = "",
    transactionId = "",
    paymentCode = "",
  } = state || {};

  const handleCancelTransaction = async () => {
    try {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      // Cancel transaction via API
      const response = await axiosInstance.put(
        `/api/transactions/${transactionId}/cancel`
      );
      console.log("Transaction ID:", transactionId);

      alert("Transaction successfully canceled!");
      navigate("/home");
    } catch (error) {
      console.log(error.response.data);
      console.error("Failed to cancel transaction:", error);
      alert("Failed to cancel transaction. Please try again.");
    }
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto p-6 gap-6">
      {/* Header */}
      <div className="flex bg-white px-6 py-4 rounded-lg justify-between">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <Badge className="bg-green-400">Pending</Badge>
      </div>

      {/* Payment Code & Total */}
      <div className="flex px-6 py-4 flex-col gap-2 bg-white rounded-lg">
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Payment Code</h1>
          <h1 className="text-2xl font-bold">{paymentCode}</h1>
        </div>
        <Separator />
        <div className="flex justify-between">
          <h1 className="text-2xl font-bold">Total</h1>
          <h1 className="text-2xl font-bold">Rp. {formatPrice(totalPrice)}</h1>
        </div>
      </div>

      {/* Detail Items */}
      <div className="flex flex-col gap-4">
        {items.length > 0 ? (
          items.map((item, i) => (
            <div
              className="flex flex-col bg-white px-6 py-6 rounded-lg"
              key={i}
            >
              <div className="flex align-middle justify-between">
                <h1 className="text-xl font-bold mb-4">{item.name}</h1>
                <h1 className="text-lg font-bold mb-4">{item.sellerName}</h1>
              </div>
              <div className="flex gap-6 items-center">
                <Avatar className="size-14">
                  <AvatarImage
                    src={getImageUrl(item.image)}
                    alt={item.name}
                    className="rounded-full"
                  />
                  <AvatarFallback />
                </Avatar>
                <div className="flex justify-between w-full">
                  <div>
                    <p>Animal Qty: {item.qty}</p>
                    <p>Rent Duration (month): {item.duration}</p>
                  </div>
                  <p>Rp {formatPrice(item.totalPrice)}</p>
                </div>
              </div>
              <h1 className="text-md font-bold mt-10 mb-2">
                Rincian Pembelian
              </h1>
              <div className="flex justify-between">
                <div>
                  <h3>Metode Pembayaran</h3>
                  <h3>Sub Total Harga Barang</h3>
                </div>
                <div>
                  <h3 className="text-right">{paymentMethod}</h3>
                  <h3>Rp. {formatPrice(item.totalPrice)}</h3>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No items to display.</p>
        )}
      </div>

      {/* Cancel Button */}
      <div className="flex justify-between">
        <Link to={"/home"}>
          <button className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600">
            Home
          </button>
        </Link>

        <button
          onClick={handleCancelTransaction}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
        >
          Cancel Transaction
        </button>
      </div>
    </div>
  );
};

export default Invoice;
