import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../cart/CheckoutSteps";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import { useTheme } from "../../context";

function WalletPayment() {
  const navigate = useNavigate();
  const { colors } = useTheme();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [cartItemsFromDB, setCartItemsFromDB] = useState([]);
  const [walletbalance, setWalletBalance] = useState(0);
  const [total, setTotal] = useState(0);
  const [boolean, setBoolean] = useState(false);
  const { user = "" } = useSelector((state) => state.authState);
  const userId = user._id;
  const { shippingInfo } = useSelector((state) => state.cartState);

  const dispatch = useDispatch();

  function generateObjectId() {
    const timestamp = Math.floor(new Date().getTime() / 1000).toString(16); // 4 bytes for the timestamp
    const randomBytes = Array.from({ length: 16 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ) // 8 random bytes
      .join("")
      .slice(0, 16);
    return timestamp + randomBytes;
  }

  const validOrderItemsFromDB = cartItemsFromDB.map((item, i) => {
    return {
      name: item.itemName,
      quantity: item.quantity,
      stock: item.stock,
      image: item.productId.images[0].image,
      price: item.productId.price,
      product: item.productId._id,
    };
  });

  console.log(validOrderItemsFromDB);

  const order = {
    orderItems: validOrderItemsFromDB,
    shippingInfo,
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo.itemsPrice;
    order.shippingPrice = orderInfo.shippingPrice;
    order.taxPrice = orderInfo.taxPrice;
    order.totalPrice = orderInfo.totalPrice;
  }

  order.paymentInfo = {
    id: generateObjectId(),
    status: "succeeded",
  };

  console.log(order);

  useEffect(() => {
    async function getItemsFromDB() {
      const { data } = await axios.get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/CartProductsOfSingleUser/${userId}`,
        { withCredentials: true }
      );
      setCartItemsFromDB(data.cartItems);
      setBoolean(true);
    }
    getItemsFromDB();

    async function getWalletBalance() {
      const { data } = await axios.get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/getWalletBalance`,
        { withCredentials: true }
      );
      setWalletBalance(data);
    }

    getWalletBalance();
  }, [boolean]);

  console.log(walletbalance);

  const handlePayment = () => {
    async function handleWallet() {
      var total =
        Number(orderInfo?.itemsPrice) +
        Number(orderInfo?.shippingPrice) +
        Number(orderInfo?.taxPrice);
      console.log(total);
      const { data } = await axios.post(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/handleWallet`,
        {
          reducingAmountFromWallet: total,
        },
        { withCredentials: true }
      );
      if (data.success == true) {
        toast(`Rs.${total} deducted from your wallet`, {
          type: "success",
          position: "bottom-center",
        });
      } else {
        toast("Something went wrong", {
          type: "error",
          position: "bottom-center",
        });
      }
    }

    // Logic to handle order confirmation
    var total =
      Number(orderInfo?.itemsPrice) +
      Number(orderInfo?.shippingPrice) +
      Number(orderInfo?.taxPrice);
    if (Number(walletbalance?.wallet) > total) {
      try {
        dispatch(orderCompleted());
        dispatch(createOrder(order));
        handleWallet();
        navigate("/order/success");
        toast("Order Success!", {
          type: "success",
          position: "bottom-center",
        });
      } catch (err) {
        toast(err, {
          type: "error",
          position: "bottom-center",
        });
      }

      navigate("/order/success"); // Redirect to success page
    } else {
      console.log(Number(walletbalance?.wallet), total);
      toast("Insufficient Balance!", {
        type: "error",
        position: "bottom-center",
      });
    }
    // console.log(order);
  };

  return (
    <Fragment>
      <CheckoutSteps shipping confirmOrder payment />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",

          padding: "20px",
        }}
      >
        <div
          style={{
            background: colors.bgPage,
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "400px",
            textAlign: "center",
          }}
        >
          <h2
            style={{ fontSize: "1.5rem", color: colors.textSecondary, marginBottom: "20px" }}
          >
            Wallet
          </h2>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "1.2rem",
                color: colors.textSecondary,
                marginBottom: "10px",
              }}
            >
              Order Summary
            </h4>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: colors.textMuted }}>
              <b>Items:</b> ${orderInfo?.itemsPrice}
            </p>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: colors.textMuted }}>
              <b>Shipping:</b> ${orderInfo?.shippingPrice}
            </p>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: colors.textMuted }}>
              <b>Tax:</b> ${orderInfo?.taxPrice}
            </p>
            <hr />
            <p
              style={{
                fontSize: "1.2rem",
                color: colors.textPrimary,
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Total: $
              {Number(orderInfo?.itemsPrice) +
                Number(orderInfo?.shippingPrice) +
                Number(orderInfo?.taxPrice)}
            </p>
          </div>
          <button
            onClick={handlePayment}
            style={{
              background: colors.accent,
              color: colors.buttonText,
              border: "none",
              padding: "10px 20px",
              fontSize: "1.2rem",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = colors.accentHover)}
            onMouseOut={(e) => (e.target.style.background = colors.accent)}
          >
            Pay Now
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default WalletPayment;
