import { Navigate, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useContext } from "react";
import { AuthContext } from "@/context/AuthContext";
import ProductPages from "@/pages/ProductPages";
import DashboardPage from "@/pages/Dashboard";
import Report from "@/pages/Report";
import Loader from "@/components/Loader";
import NotFound from "@/components/NotFound";
import RoleBasedRoute from "./RoleBasedRoute";
import Unauthorized from "@/components/Unauthorized";
import ProfilePages from "@/pages/ProfilePages";
import ProductBuyer from "@/pages/ProductBuyer";
import TransactionList from "@/pages/TransactionList";
import Invoice from "@/components/Invoice";

const HomePage = lazy(() => import("@/layout/Home"));
const RegisterPage = lazy(() => import("@/auth/Register"));
const LoginPage = lazy(() => import("@/auth/Login"));
const CartPage = lazy(() => import("@/components/Cart"));
const WishlistPage = lazy(() => import("@/components/Wishlist"));
const ProductDetailPage = lazy(() => import("@/components/ProductDetail"));
const LandingPage = lazy(() => import("@/layout/LandingPage"));
const CheckoutPage = lazy(() => import("@/components/Checkout"));
const AppRoutes = () => {
  const { isAuthenticated } = useContext(AuthContext);
  return (
    <Routes>
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to="/home" />
          ) : (
            <Suspense fallback={<Loader />}>
              <RegisterPage />
            </Suspense>
          )
        }
      />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to="/home" />
          ) : (
            <Suspense fallback={<Loader />}>
              <LoginPage />
            </Suspense>
          )
        }
      />
      <Route
        path="/home"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : (
            <Suspense fallback={<Loader />}>
              <HomePage />
            </Suspense>
          )
        }
      />

      {/* <Route
        path="/wishlist"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : (
            <Suspense>
              <WishlistPage />
            </Suspense>
          )
        }
      /> */}
      <Route
        path="/"
        element={
          <Suspense fallback={<Loader />}>
            <LandingPage />
          </Suspense>
        }
      />
      <Route element={<RoleBasedRoute allowedRoles={["seller"]} />}>
        <Route
          path="/dashboard-seller/product"
          element={
            <Suspense fallback={<Loader />}>
              <ProductPages />
            </Suspense>
          }
        />
        <Route
          path="/dashboard-seller/report"
          element={
            <Suspense fallback={<Loader />}>
              <Report />
            </Suspense>
          }
        />
        <Route
          path="/dashboard-seller"
          element={
            <Suspense fallback={<Loader />}>
              <DashboardPage />
            </Suspense>
          }
        />
      </Route>

      <Route
        path="/product-detail/:id"
        element={
          !isAuthenticated ? (
            <Navigate to="/login" />
          ) : (
            <Suspense fallback={<Loader />}>
              <ProductDetailPage />
            </Suspense>
          )
        }
      />

      <Route element={<RoleBasedRoute allowedRoles={["buyer"]} />}>
        <Route path="/invoice" element={<Invoice />} />

        <Route path="/dashboard-buyer/history" element={<TransactionList />} />
        <Route path="/dashboard-buyer" element={<ProductBuyer />} />
        <Route path="/dashboard-buyer/profile" element={<ProfilePages />} />
        <Route
          path="/checkout"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <Suspense fallback={<Loader />}>
                <CheckoutPage />
              </Suspense>
            )
          }
        />
        <Route
          path="/cart"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" />
            ) : (
              <Suspense fallback={<Loader />}>
                <CartPage />
              </Suspense>
            )
          }
        />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
