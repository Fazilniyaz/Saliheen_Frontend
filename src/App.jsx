import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "./App.css";
import Header from "./components/layouts/Header";
import { Footer } from "./components/layouts/Footer";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import store from "./store";
import { useEffect, useState, Suspense, lazy } from "react";
import { loadUser } from "./actions/userActions";
import ProtectedRoutes from "./components/route/ProtectedRoutes";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useSelector, useDispatch } from "react-redux";
import { fetchCartItemsForUser } from "./actions/cartActions";
import Loader from "./components/layouts/Loader";

// Lazy load components
const Home = lazy(() => import("./components/Home").then(module => ({ default: module.Home })));
const ProductDetails = lazy(() => import("./components/product/ProductDetails"));
const ProductSearch = lazy(() => import("./components/product/ProductSearch").then(module => ({ default: module.ProductSearch })));

// User Components
const Login = lazy(() => import("./components/user/Login"));
const Register = lazy(() => import("./components/user/Register"));
const Profile = lazy(() => import("./components/user/Profile"));
const UpdateProfile = lazy(() => import("./components/user/UpdateProfile"));
const UpdatePassword = lazy(() => import("./components/user/UpdatePassword"));
const ForgotPassword = lazy(() => import("./components/user/ForgotPassword"));
const ResetPassword = lazy(() => import("./components/user/ResetPassword"));
const OtpVerification = lazy(() => import("./components/user/OtpVerification"));
const CashOnDelivery = lazy(() => import("./components/user/CashOnDelivery"));
const WalletPage = lazy(() => import("./components/user/Wallet"));
const WishList = lazy(() => import("./components/user/WishList"));
const WalletPayment = lazy(() => import("./components/user/WalletPayment"));
const Paypal = lazy(() => import("./components/user/PayPal"));

// Cart Components
const CartPage = lazy(() => import("./components/cart/CartPage"));
const Shipping = lazy(() => import("./components/cart/Shipping"));
const ConfirmOrder = lazy(() => import("./components/cart/ConfirmOrder"));
const Payment = lazy(() => import("./components/cart/Payment"));
const OrderSuccess = lazy(() => import("./components/cart/OrderSuccess"));

// Order Components
const UserOrders = lazy(() => import("./components/order/UserOrders"));
const OrderDetail = lazy(() => import("./components/order/OrderDetail"));

// Admin Components
const Dashboard = lazy(() => import("./components/admin/DashBoard")); // Default export
const ProductList = lazy(() => import("./components/admin/ProductList"));
const NewProduct = lazy(() => import("./components/admin/NewProduct"));
const UserList = lazy(() => import("./components/admin/UserList"));
const UpdateProduct = lazy(() => import("./components/admin/UpdateProduct"));
const OrderList = lazy(() => import("./components/admin/OrderList"));
const UpdateOrder = lazy(() => import("./components/admin/UpdateOrder"));
const UpdateUser = lazy(() => import("./components/admin/UpdateUser"));
const Categories = lazy(() => import("./components/admin/Categories"));
const CouponForm = lazy(() => import("./components/admin/Coupon")); // Default export
const SalesReport = lazy(() => import("./components/admin/SalesReport"));
const OfferModule = lazy(() => import("./components/admin/OfferModule"));
const Stats = lazy(() => import("./components/admin/Stats"));

// Category Components
const CategoryPage = lazy(() => import("./components/user/CategoryPage"));
const CategoryPageForBrand = lazy(() => import("./components/user/CategoryPageForBrand"));
const CategoryProducts = lazy(() => import("./components/category/categoryProducts"));

// Privacy Policy & Static Pages
const About = lazy(() => import("./components/privacypolicy/About"));
const PrivacyPolicy = lazy(() => import("./components/privacypolicy/PrivacyPolicy"));
const RefundCancellation = lazy(() => import("./components/privacypolicy/RefundCancellation"));
const ShippingDelivery = lazy(() => import("./components/privacypolicy/ShippingDelivery"));
const TermsConditions = lazy(() => import("./components/privacypolicy/TermsConditions"));
const ContactUs = lazy(() => import("./components/privacypolicy/ContactUs"));

function App() {
  const [stripeApiKey, setstripeApiKey] = useState("");
  const dispatch = useDispatch();

  const { user = "" } = useSelector((state) => state.authState);
  const userId = user._id;

  useEffect(() => {
    if (user && user._id) {
      // Fetch cart items for the logged-in user
      dispatch(fetchCartItemsForUser(user._id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    store.dispatch(loadUser);
    async function getStripeApiKey() {
      try {
        const { data } = await axios.get(
          "https://saliheenperfumes-zd2i.onrender.com/api/v1/stripeapi",
          { withCredentials: true }
        );
        setstripeApiKey(data.stripeApiKey);
        return;
      } catch (err) {
        toast(err.response?.data?.message, {
          type: "error",
          position: "bottom-center",
        });
        return;
      }
      try {
        if (user && userId) {
          const { data } = await axios.get("/api/v1/stripeapi", {
            withCredentials: true,
          });
          setstripeApiKey(data.stripeApiKey);
        } else {
          return;
        }
      } catch (err) {
        console.log(err);
      }
    }
    getStripeApiKey();
  }, [stripeApiKey]);

  const Layout = ({ children }) => {
    const location = useLocation();

    const noHeaderFooterPaths = ["/login", "/admin-login", "/admin-dashboard"];
    const showHeaderFooter = !noHeaderFooterPaths.includes(location.pathname);

    return (
      <>
        {showHeaderFooter && <Header />}
        <div className="container container-fluid">
          <ToastContainer theme="dark" />
          {children}
        </div>
        {showHeaderFooter && <Footer />}
      </>
    );
  };

  return (
    <Router>
      <HelmetProvider>
        <Layout>
          <div className="container container-fluid">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/search/:keyword" element={<ProductSearch />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route
                  path={`/category/:category`}
                  element={<CategoryProducts />}
                />

                <Route path="/otp-verification" element={<OtpVerification />} />

                <Route
                  path="/myProfile"
                  element={
                    <ProtectedRoutes>
                      <Profile />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/myProfile/update"
                  element={
                    <ProtectedRoutes>
                      <UpdateProfile />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/myProfile/update/password"
                  element={
                    <ProtectedRoutes>
                      <UpdatePassword />
                    </ProtectedRoutes>
                  }
                />
                <Route path="/password/forgot" element={<ForgotPassword />} />
                <Route
                  path="/password/reset/:token"
                  element={<ResetPassword />}
                />

                <Route path="/cart" element={<CartPage />} />
                <Route path="/WishList" element={<WishList />} />
                <Route
                  path="/category/:categoryName"
                  element={<CategoryPage />}
                />
                <Route
                  path="/category/brand/:brandName"
                  element={<CategoryPageForBrand />}
                />
                <Route
                  path="/shipping"
                  element={
                    <ProtectedRoutes>
                      <Shipping />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/order/confirm"
                  element={
                    <ProtectedRoutes>
                      <ConfirmOrder />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/order/success"
                  element={
                    <ProtectedRoutes>
                      <OrderSuccess />
                    </ProtectedRoutes>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoutes>
                      <UserOrders />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/getWalletBalance"
                  element={
                    <ProtectedRoutes>
                      <WalletPage />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/order/:id"
                  element={
                    <ProtectedRoutes>
                      <OrderDetail />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/paymentViaCOD"
                  element={
                    <ProtectedRoutes>
                      <CashOnDelivery />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/paymentViaWallet"
                  element={
                    <ProtectedRoutes>
                      <WalletPayment />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/paymentViaPaypal"
                  element={
                    <ProtectedRoutes>
                      <Paypal />
                    </ProtectedRoutes>
                  }
                />
                <Route path="/about" element={<About />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                <Route path="/shipping-delivery" element={<ShippingDelivery />} />
                <Route
                  path="/refund-cancellation"
                  element={<RefundCancellation />}
                />
                <Route path="/terms-conditions" element={<TermsConditions />} />
                <Route path="/contactus" element={<ContactUs />} />
                {stripeApiKey && (
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoutes>
                        <Elements stripe={loadStripe(stripeApiKey)}>
                          {" "}
                          <Payment />
                        </Elements>
                      </ProtectedRoutes>
                    }
                  />
                )}
              </Routes>
            </Suspense>
          </div>
          <div className="container container-fluid">
            <Suspense fallback={<Loader />}>
              <Routes>
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <Dashboard />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/products"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <ProductList />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/coupon"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <CouponForm />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/products/create"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <NewProduct />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <UserList />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/stats"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <Stats />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/product/:id"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <UpdateProduct />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/order/:id"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <UpdateOrder />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/user/:id"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <UpdateUser />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/orders"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <OrderList />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/salesReport"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <SalesReport />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/OfferModule"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <OfferModule />
                    </ProtectedRoutes>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <ProtectedRoutes isAdmin={true}>
                      <Categories />
                    </ProtectedRoutes>
                  }
                />
              </Routes>
            </Suspense>
          </div>
        </Layout>
      </HelmetProvider>
    </Router>
  );
}

export default App;
