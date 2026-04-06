import React, { useState, useRef } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import CouponTable from "./CouponTable";
import Sidebar from "./SideBar";
import "./Dashboard.css";

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
    <div className="admin-page-wrapper">
      <Sidebar />
      <div className="admin-page-content">

        {/* Page Header */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fas fa-ticket-alt"></i>
              Coupons &amp; Offers
            </h1>
            <p className="page-subtitle">Manage discount coupons and promotional offers</p>
          </div>
        </div>

        {/* Create Coupon Card */}
        <div className="table-card" style={{ padding: "24px 28px" }}>
          <div className="module-header" style={{ padding: "0 0 18px 0", marginBottom: "20px" }}>
            <i className="fas fa-plus-circle"></i>
            <span className="module-title">Create New Coupon</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="coupon-form-grid">
              {/* Coupon Code */}
              <div className="coupon-field">
                <label className="coupon-label">Coupon Code</label>
                <input
                  type="text"
                  className="coupon-input"
                  name="code"
                  value={couponData.code}
                  onChange={handleChange}
                  placeholder="e.g. SAVE020"
                  required
                />
              </div>

              {/* Discount */}
              <div className="coupon-field">
                <label className="coupon-label">Discount (%)</label>
                <input
                  type="number"
                  className="coupon-input"
                  name="discount"
                  value={couponData.discount}
                  onChange={handleChange}
                  placeholder="e.g. 20"
                  required
                  min="1"
                  max="100"
                />
              </div>

              {/* Expiry Date */}
              <div className="coupon-field">
                <label className="coupon-label">Expiry Date</label>
                <input
                  type="date"
                  className="coupon-input"
                  name="expiryDate"
                  value={couponData.expiryDate}
                  onChange={handleChange}
                  required
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>

              {/* Submit */}
              <div className="coupon-field coupon-submit-field">
                <label className="coupon-label">&nbsp;</label>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary-action"
                  style={{ width: "100%", justifyContent: "center" }}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Creating...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-plus "></i>
                      <span className="text-white">Create Coupon</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Coupon Table */}
        <div className="table-card">
          <div className="module-header" style={{ padding: "18px 24px" }}>
            <i className="fas fa-list"></i>
            <span className="module-title">All Coupons</span>
          </div>
          <CouponTable ref={tableRef} />
        </div>

      </div>

      <style>{`
        .coupon-form-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr) auto;
          gap: 16px;
          align-items: end;
        }

        @media (max-width: 900px) {
          .coupon-form-grid {
            grid-template-columns: 1fr 1fr;
          }
          .coupon-submit-field { grid-column: span 2; }
        }

        @media (max-width: 550px) {
          .coupon-form-grid {
            grid-template-columns: 1fr;
          }
          .coupon-submit-field { grid-column: span 1; }
        }

        .coupon-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .coupon-label {
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: var(--gray-3);
          font-family: var(--font-mono);
        }

        .coupon-input {
          background: var(--black-3);
          border: 1px solid var(--gray-1);
          color: var(--white);
          border-radius: var(--radius-sm);
          padding: 10px 14px;
          font-size: 0.9rem;
          font-family: var(--font-body);
          transition: var(--transition);
          outline: none;
          width: 100%;
        }

        .coupon-input:focus {
          border-color: var(--gray-3);
          background: var(--black-4);
        }

        .coupon-input[type="date"] {
          color-scheme: dark;
        }

        .coupon-input::placeholder {
          color: var(--gray-2);
        }
      `}</style>
    </div>
  );
}