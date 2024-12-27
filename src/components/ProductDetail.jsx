import React, { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Label } from "./ui/label";
import Navbar from "./navbar";
import { useParams } from "react-router-dom";
import { useCart } from "@/context/CartContext";
import WishlistButton from "./WishlistButton";
import CartPopup from "./cart/CartPopup";
import { getImageUrl } from "@/utils/helpers";
import { axiosInstance } from "@/server/axios";
import Cookies from "js-cookie";
import { Footer } from "./Footer";
import { getUserRole } from "@/utils/getUserRole";
const ProductDetail = () => {
  const { id } = useParams(); // ID produk dari URL
  const [product, setProduct] = useState(null); // Menyimpan data produk
  const [quantity, setQuantity] = useState(1);
  const [duration, setDuration] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const { dispatch } = useCart();
  const userRole = getUserRole();
  // Fetch data produk dari API berdasarkan ID
  useEffect(() => {
    const fetchProductData = async () => {
      const token = Cookies.get("token");
      axiosInstance.defaults.headers.common["Authorization"] = token;

      try {
        const response = await axiosInstance.get(`/api/fields/${id}`);
        setProduct(response.data.data); // Simpan data produk ke state
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  if (!product) {
    return <div className="p-6">Product not found</div>; // Tampilkan jika produk tidak ditemukan
  }

  const handleAddToCart = () => {
    setShowCartPopup(true);
  };

  const handleConfirmAddToCart = () => {
    dispatch({
      type: "ADD_TO_CART",
      payload: { ...product, quantity, duration },
    });
    setShowCartPopup(false);
  };

  return (
    <>
      <Navbar />
      <div className="flex flex-col items-center mt-8 gap-8 mb-3">
        {/* Bagian gambar */}
        <div className="flex flex-col lg:flex-row justify-between gap-2 w-3/4 h-fit">
          <div className="bg-red-300 w-full lg:h-auto h-62 rounded-xl">
            <img
              className="rounded-xl w-full h-full object-cover"
              src={getImageUrl(product.image)}
              alt={product.name}
            />
          </div>
        </div>

        {/* Bagian detail produk */}
        <div className="flex w-3/4 justify-between gap-20 mb-10 clear-both mt-8">
          {/* Detail kiri */}
          <div className="flex flex-col gap-6 w-full bg-white rounded-lg px-4 py-2 shadow-lg">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold">{product.name}</h1>
              <p className="font-bold">Stock : {product.stock}</p>
            </div>
            {userRole === "seller" && (
              <h3 className="text-lg font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}{" "}
                <span>/ bulan</span>
              </h3>
            )}

            <p className="text-gray-600 font-bold">
              Owner: {product.seller.name}
            </p>

            <Separator />
            <p>{product.description}</p>
            <Separator />
            <div>
              <p>Address: {product.address}</p>
              <p>Type: {product.type}</p>
              <p>Width: {product.wide} m²</p>
              <p>City: {product.city}</p>
              <p>Type: {product.type}</p>
            </div>
          </div>
          {userRole === "buyer" && (
            <div className="flex flex-col gap-6 w-1/2 shadow-md p-6 bg-white rounded-md">
              <h1 className="text-lg font-bold">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                }).format(product.price)}{" "}
                <span>/ bulan</span>
              </h1>
              <div className="rounded-lg flex flex-col gap-2">
                {/* Duration */}
                <div className="flex items-center rounded">
                  <Label className="px-4 py-2">Duration:</Label>
                  <button
                    onClick={() => setDuration((d) => Math.max(1, d - 1))}
                    className="px-4 py-2 border-r bg-white rounded-md shadow-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{duration}</span>
                  <button
                    onClick={() => setDuration((d) => d + 1)}
                    className="px-4 py-2 border-l bg-white rounded-md shadow-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>

                {/* Quantity */}
                <div className="flex items-center rounded pt-3">
                  <Label className="px-4 py-2">Qty:</Label>
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-4 ml-8 py-2 border-r bg-white rounded-md shadow-md hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2">{quantity}</span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="px-4 py-2 border-l bg-white rounded-md shadow-md hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Tombol Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors text-lg font-medium"
              >
                Add to Cart
              </button>
            </div>
          )}
          {/* Detail kanan */}
        </div>

        {/* Popup Keranjang */}
        <CartPopup
          isOpen={showCartPopup}
          onClose={() => setShowCartPopup(false)}
          product={product}
          quantity={quantity}
          duration={duration}
          onConfirm={handleConfirmAddToCart}
        />
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;
