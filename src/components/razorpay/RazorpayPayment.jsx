import React, { useState } from "react";
import { Button } from "semantic-ui-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const RazorpayPayment = () => {
  const [amount, setAmount] = useState(500); // Default amount in INR
  const navigate = useNavigate();
  const handlePayment = async (amt) => {
    // Step 1: Create an order on your backend
    amt = amt * 100;
    const response = await fetch("http://localhost:8000/create-order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amt }),
    });
    const { orderId } = await response.json();

    // Step 2: Initialize Razorpay payment
    const options = {
      key: "rzp_test_x0DSx4zqJLuGm0", // Your Razorpay Key ID
      amount: amt, // Amount in paise
      currency: "INR",
      name: "Your Company Name",
      description: "Test Transaction",
      order_id: orderId,
      handler: async function (response) {
        // const verificationResponse = await fetch('http://localhost:8000/verify-payment', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({
        //     order_id: response.razorpay_order_id,
        //     payment_id: response.razorpay_payment_id,
        //     signature: response.razorpay_signature,
        //   }),
        // });
        // const verificationResult = await verificationResponse.json();
        // alert(verificationResult.message);
        toast("Payment Success!", {
          type: "success",
          position: "bottom-center",
        });

        navigate("/order/success");
      },
      prefill: {
        name: "Customer Name",
        email: "customer@example.com",
        contact: "9999999999",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div>
      <Button
        id="checkout_btn"
        className="btn btn-primary btn-block"
        onClick={() => {
          handlePayment(500);
        }}
      >
        Pay with RazorPay
      </Button>
    </div>
  );
};

export default RazorpayPayment;
