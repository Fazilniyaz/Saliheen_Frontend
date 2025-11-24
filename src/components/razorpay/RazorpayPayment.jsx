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
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localCart, removeFromLocalCart } = useContext(CartContext);
  const { user = "" } = useSelector((state) => state.authState);

  const handlePayment = async (amt) => {
    if (isProcessing) {
      toast("Payment is already being processed", {
        type: "warning",
        position: "bottom-center",
      });
      return;
    }

    try {
      setIsProcessing(true);
      const amtInPaise = amt;

      // SAVE ORDER DATA BEFORE OPENING RAZORPAY
      const orderData = {
        orderItems: localCart.map((item) => ({
          name: item.itemName,
          quantity: item.quantity,
          stock: item.stock,
          noOfBottles: item?.noOfBottles,
          pricePerBottle: item.finalPrice / item?.noOfBottles,
          price: item.finalPrice,
          product: item.productId,
        })),
        shippingInfo,
        itemsPrice,
        shippingPrice: shippingPrice + 100,
        taxPrice,
        totalPrice: totalPrice,
        userEmail: user.email,
        userName: user.name,
        timestamp: Date.now(),
      };

      // Save to sessionStorage
      sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));
      sessionStorage.setItem("cartItems", JSON.stringify(localCart));

      // Step 1: Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        "https://saliheenperfumes-zd2i.onrender.com/create-order",
        {
          amount: amtInPaise,
          shippingInfo: shippingInfo,
          customerName: name,
          customerPhone: phone,
        },
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
        description: "Payment for Premium Perfumes",
        order_id: razorpayOrder.orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful, verifying...");

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

            if (verificationResult.status !== "success") {
              throw new Error("Payment verification failed");
            }

            console.log("Payment verified successfully");

            // Step 3: REFRESH USER SESSION BEFORE CREATING ORDER
            try {
              await axios.get(
                "https://saliheenperfumes-zd2i.onrender.com/api/v1/myProfile",
                {
                  withCredentials: true,
                }
              );
              console.log("Session refreshed successfully");
            } catch (sessionError) {
              console.error("Session refresh failed:", sessionError);
              // Continue anyway - will be caught by order creation
            }

            // Step 4: Retrieve saved order data
            const savedOrderData = JSON.parse(
              sessionStorage.getItem("pendingOrder")
            );
            const savedCartItems = JSON.parse(
              sessionStorage.getItem("cartItems")
            );

            // Step 5: Build Order Object with payment info
            const order = {
              ...savedOrderData,
              paymentInfo: {
                id: response.razorpay_payment_id,
                status: "succeeded",
                type: "RAZORPAY",
              },
            };

            console.log("Creating order with data:", order);

            // Step 6: CREATE ORDER
            await dispatch(createOrder(order));

            console.log("Order created successfully");

            // Step 7: Clear cart and session storage
            dispatch(orderCompleted());
            savedCartItems.forEach((item) => {
              removeFromLocalCart(item.productId);
            });

            sessionStorage.removeItem("pendingOrder");
            sessionStorage.removeItem("cartItems");
            sessionStorage.removeItem("orderInfo");

            toast("Payment Success! Your order has been placed.", {
              type: "success",
              position: "bottom-center",
              autoClose: 3000,
            });

            setIsProcessing(false);
            navigate("/order/success");
          } catch (err) {
            console.error("Post-payment processing failed:", err);
            setIsProcessing(false);

            // Save payment details for support
            sessionStorage.setItem(
              "failedPayment",
              JSON.stringify({
                paymentId: response.razorpay_payment_id,
                orderId: response.razorpay_order_id,
                error: err.response?.data?.message || err.message,
                timestamp: Date.now(),
              })
            );

            // Check if it's a session error
            if (
              err.response?.status === 401 ||
              err.response?.data?.message?.includes("Session") ||
              err.response?.data?.message?.includes("Expired")
            ) {
              toast(
                "Session expired! Payment received. Please login again to complete your order.",
                {
                  type: "warning",
                  position: "bottom-center",
                  autoClose: false,
                }
              );

              // Redirect to login after 3 seconds
              setTimeout(() => {
                navigate("/login?redirect=complete-order");
              }, 3000);
            } else {
              let errorMessage = "Payment received but order creation failed.";
              if (err.response?.data?.message) {
                errorMessage += " Error: " + err.response.data.message;
              }
              errorMessage +=
                " Please contact support with payment ID: " +
                response.razorpay_payment_id;

              toast(errorMessage, {
                type: "error",
                position: "bottom-center",
                autoClose: false,
              });
            }
          }
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed by user");
            setIsProcessing(false);
          },
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: phone,
        },
        notes: {
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
        },
        theme: {
          color: "#FFD700",
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        setIsProcessing(false);
        toast(
          "Payment failed: " +
            (response.error.description || "Please try again"),
          {
            type: "error",
            position: "bottom-center",
          }
        );
      });

      rzp.open();
    } catch (err) {
      console.error("Razorpay order creation failed", err);
      setIsProcessing(false);
      toast(
        "Failed to initiate payment: " +
          (err.response?.data?.message || err.message),
        {
          type: "error",
          position: "bottom-center",
        }
      );
    }
  };

  return (
    <div>
      <Button
        id="checkout_btn"
        className="btn btn-primary btn-block"
        onClick={() => handlePayment(finalPrice)}
        disabled={isProcessing}
        loading={isProcessing}
        style={{
          backgroundColor: "#FFD700",
          color: "#000",
          fontWeight: "bold",
        }}
      >
        {isProcessing
          ? "Processing Payment..."
          : "Pay ₹" + finalPrice + " with Razorpay"}
      </Button>
    </div>
  );
};

export default RazorpayPayment;
