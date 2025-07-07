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
  console.log("localCart", localCart);
  const orderInfo = JSON.parse(sessionStorage.getItem("orderInfo"));
  console.log("orderInfo", orderInfo);
  // const { shippingInfo } = useSelector((state) => state.cartState);
  console.log(shippingInfo);
  const { user = "" } = useSelector((state) => state.authState);
  console.log(products);

  const handlePayment = async (amt) => {
    try {
      const amtInPaise = amt;

      // Step 1: Create Razorpay Order
      const { data: razorpayOrder } = await axios.post(
        "https://api.saliheenperfumes.com/create-order",
        { amount: amtInPaise },
        { headers: { "Content-Type": "application/json" } }
      );

      const options = {
        key: "rzp_test_x0DSx4zqJLuGm0",
        amount: amtInPaise,
        currency: "INR",
        name: "Saliheen Perfumes",
        description: "Payment",
        order_id: razorpayOrder.orderId,
        handler: async function (response) {
          try {
            // Step 2: Verify Payment
            const { data: verificationResult } = await axios.post(
              "https://api.saliheenperfumes.com/verify-payment",
              {
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              },
              { headers: { "Content-Type": "application/json" } }
            );

            // Step 3: Get Cart Items from DB

            const validOrderItemsFromLocalCart = localCart.map((item) => {
              const price = item.finalPrice;
              return {
                name: item.itemName,
                quantity: item.quantity,
                stock: item.stock,
                // image: item?.productId?.images[0]?.image,
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

            console.log("Order to be created:", order);

            // Step 5: Dispatch Redux Actions
            dispatch(orderCompleted());
            dispatch(createOrder(order));

            toast("Payment Success!", {
              type: "success",
              position: "bottom-center",
            });
            localCart.map((item) => {
              removeFromLocalCart(item.productId); // Remove item from local cart
            });
            navigate("/order/success");
          } catch (err) {
            console.error("Payment verification or order creation failed", err);
            toast("Something went wrong while creating the order.", {
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
