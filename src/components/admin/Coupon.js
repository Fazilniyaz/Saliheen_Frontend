import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CouponTable from "./CouponTable";

const BASE_URL = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

export default function CouponForm() {
  const [couponData, setCouponData] = useState({
    code: "",
    discount: "",
    expiryDate: "",
  });
  const [loading, setLoading] = useState(false);
  const tableRef = useRef(null);

  const handleChange = (e) => {
    setCouponData({ ...couponData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${BASE_URL}/admin/createCoupon`,
        couponData,
        { withCredentials: true }
      );
      toast.success(data.message || "Coupon created successfully!");
      setCouponData({ code: "", discount: "", expiryDate: "" });
      // Trigger table refresh
      if (tableRef.current?.refresh) tableRef.current.refresh();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create coupon. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #1a1200 0%, #2d1f00 50%, #1a1200 100%)",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            background: "linear-gradient(135deg, #d4af37, #f5e27a, #d4af37)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: "bold",
            fontSize: "1.8rem",
          }}
        >
          <i className="fas fa-ticket-alt me-2"></i>
          Coupons &amp; Offers
        </h2>

        {/* Create Coupon Form */}
        <div
          style={{
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(212,175,55,0.3)",
            borderRadius: "12px",
            padding: "1.5rem",
            marginBottom: "2rem",
            backdropFilter: "blur(10px)",
          }}
        >
          <h5
            style={{
              color: "#d4af37",
              fontWeight: "bold",
              marginBottom: "1.2rem",
            }}
          >
            <i className="fas fa-plus-circle me-2"></i>
            Create New Coupon
          </h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label style={{ color: "#d4af37", fontWeight: "600" }}>
                Coupon Code
              </label>
              <input
                type="text"
                className="form-control mt-1"
                name="code"
                value={couponData.code}
                onChange={handleChange}
                placeholder="e.g. SAVE20"
                required
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="mb-3">
              <label style={{ color: "#d4af37", fontWeight: "600" }}>
                Discount (%)
              </label>
              <input
                type="number"
                className="form-control mt-1"
                name="discount"
                value={couponData.discount}
                onChange={handleChange}
                placeholder="e.g. 20"
                required
                min="1"
                max="100"
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#fff",
                  borderRadius: "8px",
                }}
              />
            </div>
            <div className="mb-4">
              <label style={{ color: "#d4af37", fontWeight: "600" }}>
                Expiry Date
              </label>
              <input
                type="date"
                className="form-control mt-1"
                name="expiryDate"
                value={couponData.expiryDate}
                onChange={handleChange}
                required
                min={new Date().toISOString().split("T")[0]}
                style={{
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(212,175,55,0.4)",
                  color: "#fff",
                  borderRadius: "8px",
                  colorScheme: "dark",
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{
                background: "linear-gradient(135deg, #d4af37, #b8960c)",
                color: "#1a1200",
                border: "none",
                borderRadius: "8px",
                padding: "0.6rem 2rem",
                fontWeight: "bold",
                width: "100%",
                fontSize: "1rem",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                  ></span>
                  Creating...
                </>
              ) : (
                <>
                  <i className="fas fa-plus me-2"></i>
                  Create Coupon
                </>
              )}
            </button>
          </form>
        </div>

        {/* Coupon Table */}
        <CouponTable ref={tableRef} />
      </div>
    </div>
  );
}
