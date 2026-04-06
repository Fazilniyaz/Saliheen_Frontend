import React, { Fragment, useState, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { validateShipping } from "./Shipping";
import { Link } from "react-router-dom";
import Loader from "../layouts/Loader";
import CheckoutSteps from "./CheckoutSteps";
import axios from "axios";
import RazorpayPayment from "../razorpay/RazorpayPayment";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";
import { useTheme } from "../../context";

const BASE_URL = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(
    (state) => state.cartState,
  );
  const [localCarts, setlocalCarts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();
  const { colors } = useTheme();
  const { localCart, addToLocalCart, removeFromLocalCart } =
    useContext(CartContext);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponError, setCouponError] = useState("");
  const [couponSuccess, setCouponSuccess] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponApplied, setCouponApplied] = useState(false);

  const products = localCart.map((item) => ({
    _id: item.productId,
    quantity: item.quantity,
    stock: item.stock,
    noOfBottles: item?.noOfBottles,
    type: item?.type,
  }));

  const itemsPrice = localCart.reduce((acc, item) => acc + item.finalPrice, 0);
  const shippingPrice = 0;
  const taxPrice = Number((0 * itemsPrice).toFixed(2));
  const baseTotal = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2));
  const totalPrice = couponApplied
    ? Number((baseTotal - discountAmount).toFixed(2))
    : baseTotal;

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError("Please enter a coupon code.");
      return;
    }
    setCouponLoading(true);
    setCouponError("");
    setCouponSuccess("");
    setCouponApplied(false);
    setDiscountAmount(0);
    setDiscountPercent(0);
    try {
      const { data } = await axios.post(`${BASE_URL}/validateCoupon`, {
        couponCode: couponCode.trim(),
        totalPrice: baseTotal,
      });
      setDiscountAmount(data.discountAmount);
      setDiscountPercent(data.discountPercent);
      setCouponApplied(true);
      setCouponSuccess(data.message);
    } catch (error) {
      setCouponError(
        error.response?.data?.message || "Invalid or expired coupon."
      );
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponApplied(false);
    setDiscountAmount(0);
    setDiscountPercent(0);
    setCouponError("");
    setCouponSuccess("");
  };

  const processPayment = (method) => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
    navigate(`/paymentVia${method}`);
  };

  const processPaymentRazorPay = () => {
    const data = {
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
      products,
    };
    sessionStorage.setItem("orderInfo", JSON.stringify(data));
  };

  const userId = user?._id;
  const isGuest = !user;

  useEffect(() => {
    validateShipping({ shippingInfo, navigate });
    if (isGuest && (!shippingInfo?.fullName || !shippingInfo?.guestEmail)) {
      navigate("/shipping");
      return;
    }
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    async function getAllCartItemsOfTheParticularUser() {
      try {
        setIsLoading(true);
        const { data } = await axios.get(
          `${BASE_URL}/CartProductsOfSingleUser/${userId}`,
          { withCredentials: true },
        );
        setlocalCarts(data.cartItems || []);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false);
      }
    }
    getAllCartItemsOfTheParticularUser();
  }, [userId, navigate, shippingInfo, isGuest]);

  if (isLoading && !isGuest) {
    return <Loader />;
  }

  if (localCart.length === 0 && (localCarts.length === 0 || isGuest)) {
    navigate("/");
    return null;
  }

  return (
    <Fragment>
      <MetaData title={"Confirm Order"} />
      <CheckoutSteps shipping confirmOrder />
      <div
        style={{
          margin: "2rem auto",
          padding: "1rem",
          maxWidth: "90%",
          backgroundColor: colors.bgPage,
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
          border: `1px solid ${colors.borderLight}`,
        }}
      >
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-5 order-confirm">
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: colors.accent,
                marginBottom: "1rem",
              }}
            >
              Shipping Info
            </h4>
            <p style={{ color: colors.textPrimary }}>
              <b>Name: </b> {user?.name || shippingInfo?.fullName || ""}
            </p>
            <p style={{ color: colors.textPrimary }}>
              <b>Phone: </b>
              {shippingInfo.phoneNo}
            </p>
            <p style={{ color: colors.textPrimary }}>
              <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
              {shippingInfo.postalCode}, {shippingInfo.state},{" "}
              {shippingInfo.country}
            </p>

            <hr style={{ borderColor: colors.borderLight }} />
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: colors.accent,
                marginBottom: "1rem",
              }}
            >
              Your Cart Items:
            </h4>
            {localCart.length > 0 &&
              localCart.map((item) => (
                <Fragment key={item.productId}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginBottom: "1rem",
                      color: colors.textPrimary,
                    }}
                  >
                    <img
                      src={item?.productImage}
                      alt={item.itemName}
                      style={{
                        height: "45px",
                        width: "65px",
                        marginRight: "1rem",
                        borderRadius: "5px",
                      }}
                    />
                    <Link
                      to={`/product/${item.productId._id}`}
                      style={{
                        color: colors.accent,
                        fontWeight: "bold",
                        textDecoration: "none",
                        flex: 1,
                      }}
                    >
                      {item.itemName}
                    </Link>
                    <p style={{ margin: 0, color: colors.textSecondary }}>
                      <b>
                        {item.type} | {item.noOfBottles} Bottles | ₹
                        {item.finalPrice}{" "}
                      </b>
                    </p>
                  </div>
                  <hr style={{ borderColor: colors.borderLight }} />
                </Fragment>
              ))}
          </div>

          <div className="col-12 col-lg-3 my-4">
            <div
              style={{
                backgroundColor: colors.bgSubtle,
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.06)",
                border: `1px solid ${colors.borderLight}`,
              }}
            >
              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: colors.accent,
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </h4>
              <hr style={{ borderColor: colors.borderLight }} />
              <p style={{ color: colors.textPrimary }}>
                Subtotal: <span style={{ float: "right" }}>₹{itemsPrice}</span>
              </p>
              <p style={{ color: colors.textPrimary }}>
                Shipping:{" "}
                <span style={{ float: "right" }}>₹{shippingPrice}</span>
              </p>
              <p style={{ color: colors.textPrimary }}>
                Tax: <span style={{ float: "right" }}>₹{taxPrice}</span>
              </p>

              {/* Coupon Section */}
              <hr style={{ borderColor: colors.borderLight }} />
              <p
                style={{
                  color: colors.accent,
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                }}
              >
                <i className="fas fa-ticket-alt me-2"></i>
                Have a Coupon?
              </p>

              {!couponApplied ? (
                <div>
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => {
                        setCouponCode(e.target.value.toUpperCase());
                        setCouponError("");
                        setCouponSuccess("");
                      }}
                      placeholder="Enter coupon code"
                      disabled={couponLoading}
                      style={{
                        flex: 1,
                        padding: "0.45rem 0.6rem",
                        borderRadius: "6px",
                        border: `1px solid ${couponError ? "#e53e3e" : colors.borderLight}`,
                        background: colors.bgPage,
                        color: colors.textPrimary,
                        fontSize: "0.85rem",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                        outline: "none",
                      }}
                      onKeyDown={(e) =>
                        e.key === "Enter" && handleValidateCoupon()
                      }
                    />
                    <button
                      onClick={handleValidateCoupon}
                      disabled={couponLoading}
                      style={{
                        padding: "0 0.8rem",
                        borderRadius: "6px",
                        border: "none",
                        background: colors.accent,
                        color: "#fff",
                        fontWeight: "600",
                        fontSize: "0.8rem",
                        cursor: couponLoading ? "not-allowed" : "pointer",
                        whiteSpace: "nowrap",
                        minWidth: "80px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "4px",
                      }}
                    >
                      {couponLoading ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          style={{ width: "14px", height: "14px" }}
                        ></span>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {couponError && (
                    <p
                      style={{
                        color: "#e53e3e",
                        fontSize: "0.8rem",
                        marginTop: "0.4rem",
                        marginBottom: 0,
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <i className="fas fa-times-circle"></i> {couponError}
                    </p>
                  )}
                </div>
              ) : (
                <div
                  style={{
                    background: "rgba(72,187,120,0.1)",
                    border: "1px solid rgba(72,187,120,0.4)",
                    borderRadius: "8px",
                    padding: "0.6rem 0.8rem",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <span
                      style={{
                        color: "#38a169",
                        fontWeight: "700",
                        fontSize: "0.88rem",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                      }}
                    >
                      <i className="fas fa-check-circle me-1"></i>
                      {couponCode} ({discountPercent}% off)
                    </span>
                    <button
                      onClick={handleRemoveCoupon}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#e53e3e",
                        cursor: "pointer",
                        fontSize: "0.75rem",
                        padding: "0",
                        fontWeight: "600",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                  <p
                    style={{
                      color: "#38a169",
                      fontSize: "0.78rem",
                      margin: "0.25rem 0 0",
                    }}
                  >
                    {couponSuccess}
                  </p>
                </div>
              )}

              {/* Discount line */}
              {couponApplied && (
                <p
                  style={{
                    color: "#38a169",
                    fontWeight: "600",
                    marginTop: "0.6rem",
                    marginBottom: 0,
                  }}
                >
                  Discount ({discountPercent}%):
                  <span style={{ float: "right" }}>− ₹{discountAmount}</span>
                </p>
              )}

              <hr style={{ borderColor: colors.borderLight }} />
              <p style={{ color: colors.textPrimary, fontWeight: "bold" }}>
                Total:{" "}
                <span style={{ float: "right" }}>
                  {couponApplied && (
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: colors.textSecondary,
                        fontWeight: "normal",
                        fontSize: "0.85rem",
                        marginRight: "6px",
                      }}
                    >
                      ₹{baseTotal}
                    </span>
                  )}
                  ₹{totalPrice}
                </span>
              </p>
              <hr style={{ borderColor: colors.borderLight }} />

              <p style={{ color: colors.accent, textAlign: "center" }}>
                Proceed to Payment
              </p>
              <RazorpayPayment
                finalPrice={totalPrice}
                name={user?.name || shippingInfo?.fullName || ""}
                phone={shippingInfo.phoneNo}
                guestEmail={shippingInfo?.guestEmail}
                onClick={() => processPaymentRazorPay()}
                itemsPrice={itemsPrice}
                shippingPrice={shippingPrice}
                taxPrice={taxPrice}
                totalPrice={totalPrice}
                products={products}
                shippingInfo={shippingInfo}
              />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}

export default ConfirmOrder;