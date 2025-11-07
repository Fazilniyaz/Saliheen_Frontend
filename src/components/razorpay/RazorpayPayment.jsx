import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { orderCompleted } from "../../slices/cartSlice";
import { createOrder } from "../../actions/orderActions";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";
// console.log("localCart", localCart);

const RazorpayPayment = ({
  finalPrice,
  name,
  phone,
  itemsPrice,
  shippingPrice,
  taxPrice,
  totalPrice,
  shippingInfo,
  products,
}) => {
  const [amount] = useState(finalPrice);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localCart, addToLocalCart, removeFromLocalCart } =
    useContext(CartContext);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  // const { shippingInfo } = useSelector((state) => state.cartState);
  const { user = "" } = useSelector((state) => state.authState);

  const handlePayment = async (amt) => {
    try {
      const amtInPaise = amt;

      // Step 1: Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        "https://saliheenperfumes-zd2i.onrender.com/create-order",
        { amount: amtInPaise },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );

      const options = {
        key: "rzp_live_QNoqNSpHzqg5ox",
        amount: amtInPaise,
        currency: "INR",
        name: "Saliheen Perfumes",
        description: "Payment",
        order_id: razorpayOrder.orderId,
        handler: async function (response) {
          try {
            // Step 2: Verify Payment
            const { data: verificationResult } = await axios.post(
              "https://saliheenperfumes-zd2i.onrender.com/verify-payment",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              {
                headers: { "Content-Type": "application/json" },
                withCredentials: true,
              }
            );

            // Step 3: Build order items
            const validOrderItemsFromLocalCart = localCart.map((item) => {
              const price = item.finalPrice;
              return {
                name: item.itemName,
                quantity: item.quantity,
                stock: item.stock,
                noOfBottles: item?.noOfBottles,
                pricePerBottle: price / item?.noOfBottles,
                price,
                product: item.productId,
              };
            });

            // Step 4: Build Order Object
            const order = {
              orderItems: validOrderItemsFromLocalCart,
              shippingInfo,
              itemsPrice,
              shippingPrice: shippingPrice + 100,
              taxPrice,
              totalPrice: totalPrice,
              paymentInfo: {
                id: response.razorpay_payment_id,
                status: "succeeded",
                type: "RAZORPAY",
              },
            };

            // Step 5: CREATE ORDER AND WAIT FOR COMPLETION
            try {
              await dispatch(createOrder(order)); // Wait for this to complete!

              // Only proceed if order creation succeeded
              dispatch(orderCompleted());

              // Clear cart
              localCart.forEach((item) => {
                removeFromLocalCart(item.productId);
              });

              toast("Payment Success!", {
                type: "success",
                position: "bottom-center",
              });

              navigate("/order/success");
            } catch (orderError) {
              // Order creation failed even though payment succeeded
              console.error(
                "Order creation failed after successful payment:",
                orderError
              );
              toast(
                "Payment received but order creation failed. Please contact support with payment ID: " +
                  response.razorpay_payment_id,
                {
                  type: "error",
                  position: "bottom-center",
                  autoClose: false,
                }
              );
              // Don't navigate - let user see the error
            }
          } catch (err) {
            console.error("Payment verification failed", err);
            toast("Payment verification failed. Please contact support.", {
              type: "error",
              position: "bottom-center",
            });
          }
        },
        prefill: {
          name,
          email: "customer@example.com",
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Razorpay order creation failed", err);
      toast("Failed to initiate payment", {
        type: "error",
        position: "bottom-center",
      });
    }
  };

  return (
    <div>
      <Button
        id="checkout_btn"
        className="btn btn-primary btn-block"
        onClick={() => handlePayment(finalPrice)}
      >
        Pay with RazorPay
      </Button>
    </div>
  );
};

export default RazorpayPayment;
