import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import MetaData from "../layouts/MetaData";
import { toast } from "react-toastify";

const API_BASE = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

export default function TrackOrder() {
  const { orderId: paramOrderId } = useParams();
  const navigate = useNavigate();
  const [orderIdInput, setOrderIdInput] = useState(paramOrderId || "");
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(!!paramOrderId);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (paramOrderId) {
      fetchOrderStatus(paramOrderId);
    }
  }, [paramOrderId]);

  const fetchOrderStatus = async (id) => {
    if (!id || !id.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        `${API_BASE}/order/status/${id.trim()}`
      );
      setOrder(data.order);
    } catch (err) {
      setOrder(null);
      setError(err.response?.data?.message || "Order not found");
      toast.error(err.response?.data?.message || "Order not found");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = orderIdInput.trim();
    if (!id) {
      toast.error("Please enter your Order ID");
      return;
    }
    navigate(`/order/track/${id}`, { replace: true });
  };

  return (
    <>
      <MetaData title="Track Order" />
      <div className="container container-fluid" style={{ maxWidth: 700, margin: "2rem auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#1a1a1a" }}>
          Track your order
        </h1>

        {!paramOrderId && (
          <form
            onSubmit={handleSubmit}
            style={{
              background: "#fafafa",
              padding: "1.5rem",
              borderRadius: 10,
              marginBottom: "2rem",
            }}
          >
            <label style={{ display: "block", marginBottom: "0.5rem", fontWeight: 600 }}>
              Order ID
            </label>
            <input
              type="text"
              value={orderIdInput}
              onChange={(e) => setOrderIdInput(e.target.value)}
              placeholder="Paste your order ID here"
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 6,
                border: "1px solid #ddd",
                marginBottom: "1rem",
              }}
            />
            <button
              type="submit"
              style={{
                background: "#1a1a1a",
                color: "#fff",
                padding: "0.6rem 1.2rem",
                border: "none",
                borderRadius: 6,
                fontWeight: 600,
              }}
            >
              Track
            </button>
          </form>
        )}

        {loading && (
          <p style={{ textAlign: "center", color: "#666" }}>Loading order details...</p>
        )}

        {error && !loading && paramOrderId && (
          <div
            style={{
              padding: "1rem",
              background: "#fff5f5",
              borderRadius: 8,
              color: "#c53030",
              marginBottom: "1rem",
            }}
          >
            {error}
          </div>
        )}

        {order && !loading && (
          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e5e5",
              borderRadius: 10,
              padding: "1.5rem",
              boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
            }}
          >
            <p style={{ marginBottom: "0.5rem", color: "#666" }}>
              <strong>Order ID:</strong> {order._id}
            </p>
            <p style={{ marginBottom: "0.5rem" }}>
              <strong>Status:</strong>{" "}
              <span
                style={{
                  color:
                    order.orderStatus === "Delivered"
                      ? "#16a34a"
                      : order.orderStatus === "Cancelled" || order.orderStatus === "Returned"
                      ? "#dc2626"
                      : "#1a1a1a",
                  fontWeight: 600,
                }}
              >
                {order.orderStatus}
              </span>
            </p>
            <p style={{ marginBottom: "0.5rem", color: "#666" }}>
              <strong>Placed on:</strong>{" "}
              {order.createdAt
                ? new Date(order.createdAt).toLocaleString()
                : "-"}
            </p>
            <p style={{ marginBottom: "1rem" }}>
              <strong>Total:</strong> ₹{order.totalPrice}
            </p>
            {order.shippingInfo && (
              <div style={{ marginBottom: "1rem", color: "#555" }}>
                <strong>Shipping to:</strong>
                <br />
                {order.guestName && `${order.guestName}${order.guestEmail ? ` (${order.guestEmail})` : ""}`}
                {order.shippingInfo.address}, {order.shippingInfo.city},{" "}
                {order.shippingInfo.state} {order.shippingInfo.postalCode},{" "}
                {order.shippingInfo.country}
                <br />
                Phone: {order.shippingInfo.phoneNo}
              </div>
            )}
            {order.orderItems && order.orderItems.length > 0 && (
              <div>
                <strong>Items:</strong>
                <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
                  {order.orderItems.map((item, i) => (
                    <li key={i}>
                      {item.name} × {item.quantity} — ₹{item.price}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          {paramOrderId && (
            <Link to="/order/track" style={{ color: "#a2682a", fontWeight: 600, marginRight: "1rem" }}>
              Track another order
            </Link>
          )}
          <Link to="/" style={{ color: "#a2682a", fontWeight: 600 }}>
            Continue shopping
          </Link>
        </p>
      </div>
    </>
  );
}
