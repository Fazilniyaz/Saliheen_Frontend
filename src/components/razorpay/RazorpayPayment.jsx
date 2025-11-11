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
  console.log("RazorpayPayment finalPrice:", finalPrice);
  console.log("RazorpayPayment name:", name);
  console.log("RazorpayPayment phone:", phone);
  console.log("RazorpayPayment itemsPrice:", itemsPrice);
  console.log("RazorpayPayment shippingPrice:", shippingPrice);
  console.log("RazorpayPayment taxPrice:", taxPrice);
  console.log("RazorpayPayment totalPrice:", totalPrice);
  console.log("RazorpayPayment shippingInfo:", shippingInfo);
  console.log("RazorpayPayment products:", products);

  const [amount] = useState(finalPrice);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { localCart, addToLocalCart, removeFromLocalCart } =
    useContext(CartContext);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  const { user = "" } = useSelector((state) => state.authState);
  console.log("User in RazorpayPayment:", user);
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

      // Step 1: Create Razorpay Order with shipping info
      const { data: razorpayOrder } = await axios.post(
        "https://saliheenperfumes-zd2i.onrender.com/create-order",
        {
          amount: amtInPaise,
          shippingInfo: shippingInfo, // Include shipping info
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
        description: "Payment",
        order_id: razorpayOrder.orderId,
        handler: async function (response) {
          try {
            console.log("Payment successful, starting verification...");

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

            console.log("Payment verified, creating order...");

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

            console.log("Order object created:", order);

            // Step 5: CREATE ORDER - Use Promise to properly wait
            const orderResult = await new Promise((resolve, reject) => {
              dispatch(createOrder(order))
                .then((result) => {
                  console.log("Order created successfully:", result);
                  resolve(result);
                })
                .catch((error) => {
                  console.error("Order creation error:", error);
                  reject(error);
                });
            });

            // Only proceed if order creation succeeded
            console.log("Order creation completed, cleaning up...");
            dispatch(orderCompleted());

            // Clear cart
            localCart.forEach((item) => {
              removeFromLocalCart(item.productId);
            });

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

            // Determine error message
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
        },
        modal: {
          ondismiss: function () {
            console.log("Payment modal closed");
            setIsProcessing(false);
          },
        },
        prefill: {
          name: user.name,
          email:
            user.email +
            user.addresses.map((addr) => ({
              addressLine: addr.addressLine,
              city: addr.city,
              state: addr.state,
              pincode: addr.pincode,
            })),
          contact: phone,
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        console.log("Payment failed response:", response);
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
      >
        {isProcessing ? "Processing..." : "Pay with RazorPay"}
      </Button>
    </div>
  );
};

export default RazorpayPayment;
