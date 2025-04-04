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

function ConfirmOrder() {
  const { shippingInfo, items: cartItems } = useSelector(
    (state) => state.cartState
  );
  const [cartItemsFromDB, setCartItemsFromDB] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loader state
  const { user } = useSelector((state) => state.authState);
  const navigate = useNavigate();

  const products = cartItemsFromDB.map((item) => ({
    _id: item.productId._id,
    quantity: item.quantity,
    stock: item.stock,
  }));

  const itemsPrice = cartItemsFromDB.reduce(
    (acc, item) => acc + item.finalPrice,
    0
  );
  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0 * itemsPrice).toFixed(2)); // Ensure taxPrice is a number
  const totalPrice = Number((itemsPrice + shippingPrice + taxPrice).toFixed(2)); // Ensure totalPrice is calculated correctly

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

  const userId = user._id;

  useEffect(() => {
    validateShipping({ shippingInfo, navigate });
    async function getAllCartItemsOfTheParticularUser() {
      try {
        setIsLoading(true); // Start loader
        const { data } = await axios.get(
          `https://api.saliheenperfumes.com/api/v1/CartProductsOfSingleUser/${userId}`,
          { withCredentials: true }
        );
        setCartItemsFromDB(data.cartItems);
      } catch (error) {
        console.error("Error fetching cart items:", error);
      } finally {
        setIsLoading(false); // Stop loader after fetching data
      }
    }
    getAllCartItemsOfTheParticularUser();
  }, [userId, navigate, shippingInfo]);

  if (isLoading) {
    return <Loader />; // Show loader while data is being fetched
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
          backgroundColor: "black",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <div className="row d-flex justify-content-between">
          <div className="col-12 col-lg-8 mt-5 order-confirm">
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#a2682a",
                marginBottom: "1rem",
              }}
            >
              Shipping Info
            </h4>
            <p style={{ color: "#fff" }}>
              <b>Name: </b> {user.name}
            </p>
            <p style={{ color: "#fff" }}>
              <b>Phone: </b>
              {shippingInfo.phoneNo}
            </p>
            <p style={{ color: "#fff" }}>
              <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
              {shippingInfo.postalCode}, {shippingInfo.state},{" "}
              {shippingInfo.country}
            </p>

            <hr style={{ borderColor: "#a2682a" }} />
            <h4
              style={{
                fontSize: "1.8rem",
                fontWeight: "bold",
                color: "#a2682a",
                marginBottom: "1rem",
              }}
            >
              Your Cart Items:
            </h4>
            {cartItemsFromDB.map((item) => (
              <Fragment key={item._id}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "1rem",
                    color: "#fff",
                  }}
                >
                  <img
                    src={item.productId?.images[0]?.image}
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
                      color: "#a2682a",
                      fontWeight: "bold",
                      textDecoration: "none",
                      flex: 1,
                    }}
                  >
                    {item.itemName}
                  </Link>
                  <p style={{ margin: 0 }}>
                    {item.quantity} x ${item.finalPrice} ={" "}
                    <b>${item.finalPrice}</b>
                  </p>
                </div>
                <hr style={{ borderColor: "#444" }} />
              </Fragment>
            ))}
          </div>

          <div className="col-12 col-lg-3 my-4">
            <div
              style={{
                backgroundColor: "#222",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
              }}
            >
              <h4
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#a2682a",
                  marginBottom: "1rem",
                }}
              >
                Order Summary
              </h4>
              <hr style={{ borderColor: "#444" }} />
              <p style={{ color: "#fff" }}>
                Subtotal: <span style={{ float: "right" }}>${itemsPrice}</span>
              </p>
              <p style={{ color: "#fff" }}>
                Shipping:{" "}
                <span style={{ float: "right" }}>${shippingPrice}</span>
              </p>
              <p style={{ color: "#fff" }}>
                Tax: <span style={{ float: "right" }}>${taxPrice}</span>
              </p>
              <hr style={{ borderColor: "#444" }} />
              <p style={{ color: "#fff", fontWeight: "bold" }}>
                Total: <span style={{ float: "right" }}>${totalPrice}</span>
              </p>
              <hr style={{ borderColor: "#444" }} />

              <p style={{ color: "#a2682a", textAlign: "center" }}>
                Proceed to Payment
              </p>
              <button
                style={{
                  backgroundColor: totalPrice > 500 ? "#444" : "#a2682a",
                  color: "white",
                  fontWeight: "bold",
                  padding: "0.5rem 1rem",
                  borderRadius: "5px",
                  border: "none",
                  width: "100%",
                  marginBottom: "0.5rem",
                }}
                onClick={() => processPayment("COD")}
                disabled={totalPrice < 500}
              >
                Cash On Delivery
              </button>
              <RazorpayPayment />
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
//ConfirmOrder

export default ConfirmOrder;
