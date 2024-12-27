import { Toaster } from "sonner";
import AppRoutes from "./routes";
import { CartProvider } from "./context/CartContext";
import { WishlistProvider } from "./context/WishlistContext";

function App() {
  return (
    <>
      <Toaster position="top-left" />
      <CartProvider>
        <WishlistProvider>
          <AppRoutes />
        </WishlistProvider>
      </CartProvider>
    </>
  );
}

export default App;
