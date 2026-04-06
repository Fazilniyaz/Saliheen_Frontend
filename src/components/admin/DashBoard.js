import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BASE_URL = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

const CouponTable = forwardRef(function CouponTable(props, ref) {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/admin/coupons`, {
        withCredentials: true,
      });
      setCoupons(data.coupons || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch coupons.");
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh method to parent via ref
  useImperativeHandle(ref, () => ({ refresh: fetchCoupons }));

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleDelete = async (couponId) => {
    if (!window.confirm("Are you sure you want to delete this coupon?")) return;
    try {
      await axios.delete(`${BASE_URL}/admin/coupon/${couponId}`, {
        withCredentials: true,
      });
      toast.success("Coupon deleted successfully.");
      setCoupons((prev) => prev.filter((c) => c._id !== couponId));
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete coupon.");
    }
  };

  const isExpired = (date) => new Date(date) < new Date();

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.05)",
        border: "1px solid rgba(212,175,55,0.3)",
        borderRadius: "12px",
        padding: "1.5rem",
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
        <i className="fas fa-list me-2"></i>
        All Coupons
      </h5>

      {loading ? (
        <div className="text-center py-4">
          <div
            className="spinner-border"
            style={{ color: "#d4af37" }}
            role="status"
          ></div>
          <p style={{ color: "#d4af37", marginTop: "0.5rem" }}>
            Loading coupons...
          </p>
        </div>
      ) : coupons.length === 0 ? (
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            textAlign: "center",
            padding: "2rem",
          }}
        >
          No coupons created yet.
        </p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  borderBottom: "1px solid rgba(212,175,55,0.4)",
                }}
              >
                {["Code", "Discount", "Expiry Date", "Status", "Action"].map(
                  (h) => (
                    <th
                      key={h}
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#d4af37",
                        fontWeight: "600",
                        textAlign: "left",
                        fontSize: "0.85rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.5px",
                      }}
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => {
                const expired = isExpired(coupon.expiryDate);
                return (
                  <tr
                    key={coupon._id}
                    style={{
                      borderBottom: "1px solid rgba(255,255,255,0.06)",
                      transition: "background 0.2s",
                    }}
                    onMouseEnter={(e) =>
                    (e.currentTarget.style.background =
                      "rgba(212,175,55,0.05)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.background = "transparent")
                    }
                  >
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#fff",
                        fontWeight: "bold",
                        fontFamily: "monospace",
                        letterSpacing: "1px",
                      }}
                    >
                      {coupon.code}
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: "#f5e27a",
                        fontWeight: "600",
                      }}
                    >
                      {coupon.discount}%
                    </td>
                    <td
                      style={{
                        padding: "0.75rem 1rem",
                        color: expired
                          ? "rgba(255,100,100,0.9)"
                          : "rgba(255,255,255,0.7)",
                      }}
                    >
                      {new Date(coupon.expiryDate).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <span
                        style={{
                          background: expired
                            ? "rgba(255,59,59,0.2)"
                            : "rgba(34,197,94,0.2)",
                          color: expired ? "#ff6b6b" : "#4ade80",
                          border: `1px solid ${expired ? "#ff6b6b" : "#4ade80"}`,
                          borderRadius: "20px",
                          padding: "2px 10px",
                          fontSize: "0.78rem",
                          fontWeight: "600",
                        }}
                      >
                        {expired ? "Expired" : "Active"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem" }}>
                      <button
                        onClick={() => handleDelete(coupon._id)}
                        style={{
                          background: "rgba(255,59,59,0.15)",
                          border: "1px solid rgba(255,59,59,0.5)",
                          color: "#ff6b6b",
                          borderRadius: "6px",
                          padding: "4px 12px",
                          cursor: "pointer",
                          fontSize: "0.82rem",
                          fontWeight: "600",
                          transition: "all 0.2s",
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = "rgba(255,59,59,0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = "rgba(255,59,59,0.15)";
                        }}
                      >
                        <i className="fas fa-trash-alt me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
});

export default CouponTable;