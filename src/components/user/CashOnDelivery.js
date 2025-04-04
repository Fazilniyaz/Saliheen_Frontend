import React, { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../cart/CheckoutSteps";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";

function CashOnDelivery() {
  const navigate = useNavigate();
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const [cartItemsFromDB, setCartItemsFromDB] = useState([]);
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
    let price = item.finalPrice;
    debugger;
    return {
      name: item.itemName,
      quantity: item.quantity,
      stock: item.stock,
      image: item.productId.images[0].image,
      price,
      product: item.productId._id,
    };
  });

  console.log(validOrderItemsFromDB);

  const order = {
    orderItems: validOrderItemsFromDB,
    shippingInfo,
  };

  if (orderInfo) {
    order.itemsPrice = orderInfo?.itemsPrice;
    order.shippingPrice = orderInfo?.shippingPrice + 100;
    order.taxPrice = orderInfo?.taxPrice;
    order.totalPrice = orderInfo?.totalPrice + 100;
  }

  order.paymentInfo = {
    id: generateObjectId(),
    status: "succeeded",
    type: "COD",
  };

  console.log(order);

  useEffect(() => {
    async function getItemsFromDB() {
      const { data } = await axios.get(
        `https://api.saliheenperfumes.com/api/v1/CartProductsOfSingleUser/${userId}`,
        { withCredentials: true }
      );
      console.log(data, "DDDDDDDAAAAAAAAATTTTTTTTTTAAAAAAAAAAA");
      setCartItemsFromDB(data.cartItems);
      setBoolean(true);
    }
    getItemsFromDB();
  }, [boolean]);

  const handlePayment = () => {
    // Logic to handle order confirmation
    console.log(order);

    try {
      dispatch(orderCompleted());
      dispatch(createOrder(order));

      navigate("/order/success");
      toast("Payment Success!", {
        type: "success",
        position: "bottom-center",
      });
    } catch (err) {
      toast(err, {
        type: "error",
        position: "bottom-center",
      });
    }

    // alert("Your order has been placed successfully!");
    // navigate("/order-success"); // Redirect to success page
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
            background: "#fff",
            padding: "20px",
            borderRadius: "10px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "400px",
            textAlign: "center",
          }}
        >
          <h2
            style={{ fontSize: "1.5rem", color: "#333", marginBottom: "20px" }}
          >
            Cash On Delivery
          </h2>
          <div style={{ textAlign: "left", marginBottom: "20px" }}>
            <h4
              style={{
                fontSize: "1.2rem",
                color: "#444",
                marginBottom: "10px",
              }}
            >
              Order Summary
            </h4>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}>
              <b>Items:</b> ${orderInfo?.itemsPrice}
            </p>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}>
              <b>Shipping:</b> ${orderInfo?.shippingPrice + 100}
            </p>
            <p style={{ margin: "5px 0", fontSize: "1rem", color: "#555" }}>
              <b>Tax:</b> ${orderInfo?.taxPrice}
            </p>
            <hr />
            <p
              style={{
                fontSize: "1.2rem",
                color: "#000",
                fontWeight: "bold",
                marginTop: "10px",
              }}
            >
              Total: $
              {Number(orderInfo?.itemsPrice) +
                Number(orderInfo?.shippingPrice + 100) +
                Number(orderInfo?.taxPrice)}
            </p>
          </div>
          <button
            onClick={handlePayment}
            style={{
              background: "#ff7e5f",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontSize: "1.2rem",
              borderRadius: "5px",
              cursor: "pointer",
              transition: "background 0.3s ease",
            }}
            onMouseOver={(e) => (e.target.style.background = "#feb47b")}
            onMouseOut={(e) => (e.target.style.background = "#ff7e5f")}
          >
            Pay Now
          </button>
        </div>
      </div>
    </Fragment>
  );
}

export default CashOnDelivery;
