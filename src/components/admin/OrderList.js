import { useEffect, Fragment, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import AdminLoader from "./AdminLoader";
import { MDBDataTable } from "mdbreact";
import Sidebar from "./SideBar";
import {
  deleteOrder,
  adminOrders as adminOrdersAction,
  updateOrder,
} from "../../actions/orderActions";
import { clearError, clearOrderDeleted, clearOrderUpdated } from "../../slices/orderSlice";
import axios from "axios";
import { jsPDF } from "jspdf";
import { ThreeDots } from "react-loader-spinner";
import "./Dashboard.css";

const ORDER_LIST_ENTRIES_KEY = "orderListEntries";

/* ─────────────────────────────────────────────────────────────
   ORDER DETAIL POPUP
───────────────────────────────────────────────────────────── */
function OrderDetailPopup({ orderId, currentUserId, onClose, onOrderUpdated }) {
  const dispatch = useDispatch();

  const { isOrderUpdated, error: updateError } = useSelector(
    (state) => state.orderState
  );

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("details"); // "details" | "update"

  /* ── Derived ── */
  const shippingInfo = order?.shippingInfo ?? {};
  const orderItems = order?.orderItems ?? [];
  const totalPrice = order?.totalPrice ?? 0;
  const orderStatus = order?.orderStatus ?? "";
  const paymentInfo = order?.paymentInfo ?? {};
  const user = order?.user ?? {};

  const paymentMethod =
    paymentInfo?.type === "COD" ? "Cash On Delivery" : "Online Payment";

  let paymentStatus =
    paymentInfo?.type === "COD" ? "NOT PAID YET" : "PAID";
  if (orderStatus === "Cancelled" || orderStatus === "Returned") {
    paymentStatus = "PAYMENT REFUNDED ON WALLET";
  }

  const isDelivered = orderStatus.includes("Delivered");
  const isProcessing = orderStatus.includes("Processing");
  const isShipped = orderStatus.includes("Shipped");
  const isTerminated =
    orderStatus.includes("Cancelled") || orderStatus.includes("Returned");

  /* ── Fetch order ── */
  const fetchOrder = useCallback(() => {
    setLoading(true);
    axios
      .get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/order/${orderId}`,
        { withCredentials: true }
      )
      .then(({ data }) => {
        setOrder(data.order);
        setSelectedStatus(data.order.orderStatus ?? "");
        setLoading(false);
      })
      .catch(() => {
        toast("Failed to load order details", {
          type: "error",
          position: "bottom-center",
        });
        setLoading(false);
      });
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);

  /* ── Lock body scroll ── */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  /* ── Handle Redux status update response ── */
  useEffect(() => {
    if (isOrderUpdated) {
      toast("Order status updated!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearOrderUpdated()),
      });
      fetchOrder();
      onOrderUpdated?.();
      setActionLoading(false);
    }
    if (updateError) {
      toast(updateError, {
        type: "error",
        position: "bottom-center",
        onOpen: () => dispatch(clearError()),
      });
      setActionLoading(false);
    }
  }, [isOrderUpdated, updateError]);

  /* ── Submit status update ── */
  const handleStatusUpdate = (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === orderStatus) {
      toast("Please select a different status", {
        type: "warning",
        position: "bottom-center",
      });
      return;
    }
    setActionLoading(true);
    const formData = new FormData();
    formData.append("orderStatus", selectedStatus);
    dispatch(updateOrder(orderId, formData));
  };

  /* ── Cancel order ── */
  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/ReturnOrCancelOrder`,
        { type: paymentMethod, decision: "Cancel", user: currentUserId, order: orderId },
        { withCredentials: true }
      );
      toast("Cancel request submitted!", { type: "success", position: "bottom-center" });
      fetchOrder();
      onOrderUpdated?.();
    } catch (err) {
      toast(err?.response?.data?.message || "Error", { type: "error", position: "bottom-center" });
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Return order ── */
  const handleReturnOrder = async () => {
    setActionLoading(true);
    try {
      await axios.post(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/ReturnOrCancelOrder`,
        { type: paymentMethod, decision: "Return", user: currentUserId, order: orderId },
        { withCredentials: true }
      );
      toast("Return request submitted!", { type: "success", position: "bottom-center" });
      fetchOrder();
      onOrderUpdated?.();
    } catch (err) {
      toast(err?.response?.data?.message || "Error", { type: "error", position: "bottom-center" });
    } finally {
      setActionLoading(false);
    }
  };

  /* ── Generate PDF ── */
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text("Order Invoice", 10, 10);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 10, 20);
    doc.text(`Name: ${user?.name || ""}`, 10, 30);
    doc.text(`Phone: ${shippingInfo.phoneNo || ""}`, 10, 40);
    doc.text(
      `Address: ${[shippingInfo.address, shippingInfo.city, shippingInfo.postalCode, shippingInfo.state, shippingInfo.country].filter(Boolean).join(", ")}`,
      10, 50
    );
    doc.text(`Amount Paid: ₹${totalPrice}`, 10, 60);
    doc.text(`Payment Method: ${paymentMethod}`, 10, 70);
    doc.text("Ordered Items:", 10, 80);
    let y = 90;
    orderItems.forEach((item, i) => {
      doc.text(`${i + 1}. ${item.name} — ₹${item.price} x ${item.quantity}`, 10, y);
      y += 10;
    });
    doc.save(`invoice_${orderId}.pdf`);
  };

  /* ── Helpers ── */
  const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  const statusColorClass = (s) =>
    s?.includes("Delivered") ? "delivered" :
      s?.includes("Processing") ? "processing" :
        s?.includes("Shipped") ? "shipped" :
          s?.includes("Cancelled") || s?.includes("Returned") ? "terminated" :
            "default";

  /* ─────────────────── RENDER ─────────────────── */
  return (
    <>
      {/* Backdrop */}
      <div className="pod-backdrop" onClick={onClose} />

      {/* Drawer */}
      <div className="pod-drawer">

        {/* ── HEAD ── */}
        <div className="pod-head">
          <div className="pod-head-left">
            <div className="pod-head-label">Order</div>
            <div className="pod-head-id">#{orderId}</div>
          </div>
          {!loading && (
            <span className={`pod-status-chip ${statusColorClass(orderStatus)}`}>
              {orderStatus}
            </span>
          )}
          <button className="pod-close" onClick={onClose}>
            <i className="fas fa-times" />
          </button>
        </div>

        {/* ── TABS ── */}
        {!loading && (
          <div className="pod-tabs">
            <button
              className={`pod-tab ${activeTab === "details" ? "active" : ""}`}
              onClick={() => setActiveTab("details")}
            >
              <i className="fas fa-info-circle" /> Details
            </button>
            <button
              className={`pod-tab ${activeTab === "update" ? "active" : ""}`}
              onClick={() => setActiveTab("update")}
            >
              <i className="fas fa-exchange-alt" /> Update Status
            </button>
          </div>
        )}

        {/* ── BODY ── */}
        <div className="pod-body">
          {loading ? (
            <div className="pod-loader">
              <ThreeDots height="48" width="48" radius="8" color="#ffffff" visible />
              <span>Fetching order…</span>
            </div>

          ) : activeTab === "details" ? (

            /* ════════ DETAILS TAB ════════ */
            <>
              {/* Payment strip */}
              <div className="pod-strip">
                <div className="pod-strip-item">
                  <span className="pod-strip-label">Payment Method</span>
                  <span className="pod-strip-val">{paymentMethod}</span>
                </div>
                <div className="pod-strip-sep" />
                <div className="pod-strip-item">
                  <span className="pod-strip-label">Payment Status</span>
                  <span className={`pod-pay-badge ${paymentStatus === "PAID" ? "paid" :
                    paymentStatus === "NOT PAID YET" ? "unpaid" : "refunded"
                    }`}>
                    {paymentStatus}
                  </span>
                </div>
                <div className="pod-strip-sep" />
                <div className="pod-strip-item">
                  <span className="pod-strip-label">Total Amount</span>
                  <span className="pod-strip-total">₹{totalPrice}</span>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="pod-section">
                <div className="pod-section-title">
                  <i className="fas fa-map-marker-alt" /> Shipping Info
                </div>
                <div className="pod-kv-grid">
                  <div className="pod-kv">
                    <span className="pod-k">Name</span>
                    <span className="pod-v">{user?.name || "—"}</span>
                  </div>
                  <div className="pod-kv">
                    <span className="pod-k">Phone</span>
                    <span className="pod-v">{shippingInfo.phoneNo || "—"}</span>
                  </div>
                  <div className="pod-kv pod-kv-full">
                    <span className="pod-k">Address</span>
                    <span className="pod-v">
                      {[shippingInfo.address, shippingInfo.city, shippingInfo.postalCode, shippingInfo.state, shippingInfo.country].filter(Boolean).join(", ") || "—"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Ordered Items */}
              <div className="pod-section">
                <div className="pod-section-title">
                  <i className="fas fa-box-open" />
                  Ordered Items
                  <span className="pod-count-badge">{orderItems.length}</span>
                </div>
                <div className="pod-items-list">
                  {orderItems.map((item, idx) => (
                    <div className="pod-item" key={idx}>
                      <div className="pod-item-top">
                        <Link
                          to={`/product/${item.product}`}
                          className="pod-item-name"
                          onClick={onClose}
                        >
                          {item.name}
                        </Link>
                        <span className="pod-item-total">₹{item.price}</span>
                      </div>
                      <div className="pod-item-meta">
                        <span className="pod-meta-tag">{item.quantity} ml</span>
                        <span className="pod-meta-tag">{item.noOfBottles} Bottles</span>
                        <span className="pod-meta-tag">₹{item.pricePerBottle} / Bottle</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>

          ) : (

            /* ════════ UPDATE STATUS TAB ════════ */
            <div className="pod-update-wrap">

              {/* Current status */}
              <div className="pod-current-status">
                <span className="pod-cu-label">Current Status</span>
                <span className={`pod-status-chip large ${statusColorClass(orderStatus)}`}>
                  {orderStatus}
                </span>
              </div>

              {/* Status selector */}
              <form onSubmit={handleStatusUpdate} className="pod-status-form">
                <div className="pod-section-title" style={{ marginBottom: "16px" }}>
                  <i className="fas fa-exchange-alt" /> Select New Status
                </div>

                <div className="pod-status-options">
                  {STATUS_OPTIONS.map((s) => (
                    <label
                      key={s}
                      className={`pod-status-option ${selectedStatus === s ? "selected" : ""} ${s === orderStatus ? "current" : ""}`}
                    >
                      <input
                        type="radio"
                        name="orderStatus"
                        value={s}
                        checked={selectedStatus === s}
                        onChange={() => setSelectedStatus(s)}
                        style={{ display: "none" }}
                      />
                      <span className={`pod-status-dot ${statusColorClass(s)}`} />
                      <span className="pod-status-opt-label">{s}</span>
                      {s === orderStatus && (
                        <span className="pod-current-tag">current</span>
                      )}
                      {selectedStatus === s && s !== orderStatus && (
                        <i className="fas fa-check pod-check-icon" />
                      )}
                    </label>
                  ))}
                </div>

                <button
                  type="submit"
                  className="pod-update-btn"
                  disabled={actionLoading || !selectedStatus || selectedStatus === orderStatus}
                >
                  {actionLoading ? (
                    <>
                      <ThreeDots height="16" width="28" radius="4" color="#000" visible />
                      Updating…
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save" /> Update Status
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="pod-divider"><span>Other Actions</span></div>

              {/* Cancel / Return */}
              <div className="pod-other-actions">
                {isDelivered && (
                  <button
                    className="pod-oa-btn danger"
                    onClick={handleReturnOrder}
                    disabled={actionLoading}
                  >
                    <i className="fas fa-undo" /> Return Order
                  </button>
                )}
                {(isShipped || isProcessing) && (
                  <button
                    className="pod-oa-btn danger"
                    onClick={handleCancelOrder}
                    disabled={actionLoading}
                  >
                    <i className="fas fa-times-circle" /> Cancel Order
                  </button>
                )}
                {isTerminated && (
                  <div className="pod-terminated-note">
                    <i className="fas fa-check-circle" />
                    Order {orderStatus} successfully
                  </div>
                )}
                {!isDelivered && !isShipped && !isProcessing && !isTerminated && (
                  <div className="pod-no-actions">No additional actions available</div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ── FOOTER ── */}
        {!loading && (
          <div className="pod-footer">
            {activeTab === "details" && (
              <>
                {isDelivered && (
                  <button
                    className="pod-foot-btn primary"
                    onClick={generatePDF}
                    disabled={actionLoading}
                  >
                    <i className="fas fa-file-download" /> Invoice PDF
                  </button>
                )}
                <button
                  className="pod-foot-btn accent"
                  onClick={() => setActiveTab("update")}
                >
                  <i className="fas fa-exchange-alt" /> Update Status
                </button>
              </>
            )}
            {activeTab === "update" && (
              <button
                className="pod-foot-btn secondary"
                onClick={() => setActiveTab("details")}
              >
                <i className="fas fa-arrow-left" /> Back to Details
              </button>
            )}
            <button className="pod-foot-btn ghost" onClick={onClose}>
              Close
            </button>
          </div>
        )}
      </div>

      {/* ═══════════ POPUP STYLES ═══════════ */}
      <style>{`
        .pod-backdrop {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.8);
          backdrop-filter: blur(4px);
          z-index: 1200;
          animation: pod-fade 0.2s ease;
        }
        @keyframes pod-fade { from{opacity:0} to{opacity:1} }

        .pod-drawer {
          position: fixed; top:0; right:0;
          width: min(580px, 100vw);
          height: 100vh;
          background: var(--black-2, #111);
          border-left: 1px solid var(--black-4, #2a2a2a);
          z-index: 1201;
          display: flex; flex-direction: column;
          animation: pod-slide 0.28s cubic-bezier(0.22,1,0.36,1);
          overflow: hidden;
        }
        @keyframes pod-slide { from{transform:translateX(100%)} to{transform:translateX(0)} }
        @media(max-width:500px){ .pod-drawer{width:100vw;} }

        /* Head */
        .pod-head {
          display:flex; align-items:center; gap:12px;
          padding:20px 24px;
          border-bottom:1px solid var(--black-4,#2a2a2a);
          flex-shrink:0;
        }
        .pod-head-left { flex:1; min-width:0; }
        .pod-head-label {
          font-size:0.6rem; font-weight:700; letter-spacing:0.16em;
          text-transform:uppercase; color:var(--gray-3,#555); margin-bottom:3px;
        }
        .pod-head-id {
          font-size:0.78rem; font-weight:700;
          color:var(--pure-white,#fff); font-family:var(--font-mono,monospace);
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
        }
        .pod-close {
          background:none; border:1px solid var(--black-4,#2a2a2a);
          border-radius:6px; color:var(--gray-3,#666);
          width:32px; height:32px;
          display:flex; align-items:center; justify-content:center;
          cursor:pointer; transition:all 0.15s ease; flex-shrink:0;
        }
        .pod-close:hover { border-color:var(--gray-2,#888); color:var(--pure-white,#fff); }

        /* Status chip */
        .pod-status-chip {
          display:inline-flex; align-items:center;
          padding:4px 10px; border-radius:20px;
          font-size:0.65rem; font-weight:700; letter-spacing:0.09em;
          text-transform:uppercase; border:1px solid;
          white-space:nowrap; flex-shrink:0;
        }
        .pod-status-chip.large { font-size:0.78rem; padding:6px 14px; }
        .pod-status-chip.delivered  { color:#a8e6a3; border-color:rgba(168,230,163,.3); background:rgba(168,230,163,.07); }
        .pod-status-chip.processing { color:#f0c27f; border-color:rgba(240,194,127,.3); background:rgba(240,194,127,.07); }
        .pod-status-chip.shipped    { color:#7fb3f0; border-color:rgba(127,179,240,.3); background:rgba(127,179,240,.07); }
        .pod-status-chip.terminated { color:#f07f7f; border-color:rgba(240,127,127,.3); background:rgba(240,127,127,.07); }
        .pod-status-chip.default    { color:var(--gray-4,#999); border-color:var(--black-4,#333); background:transparent; }

        /* Tabs */
        .pod-tabs {
          display:flex; border-bottom:1px solid var(--black-4,#2a2a2a); flex-shrink:0;
        }
        .pod-tab {
          flex:1; padding:13px 16px;
          background:none; border:none;
          border-bottom:2px solid transparent;
          color:var(--gray-3,#666);
          font-family:var(--font-body,sans-serif);
          font-size:0.72rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
          cursor:pointer; transition:all 0.15s ease;
          display:flex; align-items:center; justify-content:center; gap:7px;
          margin-bottom:-1px;
        }
        .pod-tab:hover { color:var(--gray-4,#999); }
        .pod-tab.active { color:var(--pure-white,#fff); border-bottom-color:var(--pure-white,#fff); }

        /* Body */
        .pod-body {
          flex:1; overflow-y:auto;
          padding:20px 24px;
          display:flex; flex-direction:column; gap:16px;
        }
        .pod-body::-webkit-scrollbar{width:4px;}
        .pod-body::-webkit-scrollbar-track{background:transparent;}
        .pod-body::-webkit-scrollbar-thumb{background:var(--black-4,#333);border-radius:2px;}

        /* Loader */
        .pod-loader {
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          gap:14px; min-height:260px;
          color:var(--gray-3,#666);
          font-size:0.72rem; letter-spacing:0.08em; text-transform:uppercase;
        }

        /* Payment strip */
        .pod-strip {
          display:flex; align-items:center;
          background:var(--black-3,#1a1a1a);
          border:1px solid var(--black-4,#2a2a2a);
          border-radius:10px; overflow:hidden;
        }
        .pod-strip-item {
          flex:1; display:flex; flex-direction:column;
          align-items:center; justify-content:center;
          padding:14px 12px; gap:5px; text-align:center;
        }
        .pod-strip-sep { width:1px; height:40px; background:var(--black-4,#2a2a2a); flex-shrink:0; }
        .pod-strip-label { font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray-3,#555); }
        .pod-strip-val { font-size:0.8rem; color:var(--white-dim,#ccc); font-weight:600; }
        .pod-strip-total { font-size:1rem; font-weight:700; color:var(--pure-white,#fff); font-family:var(--font-mono,monospace); }

        .pod-pay-badge {
          display:inline-block; padding:2px 8px; border-radius:10px;
          font-size:0.62rem; font-weight:700; letter-spacing:0.07em;
          text-transform:uppercase; border:1px solid;
        }
        .pod-pay-badge.paid     { color:#a8e6a3; border-color:rgba(168,230,163,.3); background:rgba(168,230,163,.07); }
        .pod-pay-badge.unpaid   { color:#f07f7f; border-color:rgba(240,127,127,.3); background:rgba(240,127,127,.07); }
        .pod-pay-badge.refunded { color:#c3a0f0; border-color:rgba(195,160,240,.3); background:rgba(195,160,240,.07); }

        /* Sections */
        .pod-section {
          background:var(--black-3,#1a1a1a);
          border:1px solid var(--black-4,#2a2a2a);
          border-radius:10px; overflow:hidden;
        }
        .pod-section-title {
          display:flex; align-items:center; gap:8px;
          padding:13px 16px;
          font-size:0.65rem; font-weight:700; letter-spacing:0.12em; text-transform:uppercase;
          color:var(--gray-3,#666);
          border-bottom:1px solid var(--black-4,#2a2a2a);
        }
        .pod-count-badge {
          margin-left:auto;
          background:var(--black-4,#2a2a2a); color:var(--gray-4,#888);
          font-size:0.65rem; padding:2px 7px; border-radius:8px; font-weight:700;
        }

        /* KV grid */
        .pod-kv-grid { display:grid; grid-template-columns:1fr 1fr; gap:0; }
        .pod-kv {
          padding:12px 16px;
          border-right:1px solid var(--black-4,#2a2a2a);
          border-bottom:1px solid var(--black-4,#2a2a2a);
          display:flex; flex-direction:column; gap:4px;
        }
        .pod-kv:nth-child(even) { border-right:none; }
        .pod-kv-full { grid-column:1/-1; border-right:none; border-bottom:none; }
        .pod-kv:last-child { border-bottom:none; }
        .pod-k { font-size:0.62rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:var(--gray-3,#555); }
        .pod-v { font-size:0.84rem; color:var(--white-dim,#ccc); line-height:1.4; }

        /* Items */
        .pod-items-list { display:flex; flex-direction:column; }
        .pod-item {
          padding:13px 16px;
          border-bottom:1px solid var(--black-4,#2a2a2a);
          display:flex; flex-direction:column; gap:7px;
          transition:background 0.12s ease;
        }
        .pod-item:last-child { border-bottom:none; }
        .pod-item:hover { background:rgba(255,255,255,0.02); }
        .pod-item-top { display:flex; align-items:flex-start; justify-content:space-between; gap:12px; }
        .pod-item-name {
          font-size:0.88rem; font-weight:600; color:var(--white-dim,#ccc);
          text-decoration:none; transition:color 0.12s ease;
        }
        .pod-item-name:hover { color:var(--pure-white,#fff); }
        .pod-item-total {
          font-size:0.88rem; font-weight:700;
          color:var(--pure-white,#fff); font-family:var(--font-mono,monospace); white-space:nowrap;
        }
        .pod-item-meta { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .pod-meta-tag {
          font-size:0.7rem; color:var(--gray-3,#666);
          background:var(--black-4,#2a2a2a); padding:2px 8px; border-radius:4px;
        }

        /* Update tab */
        .pod-update-wrap { display:flex; flex-direction:column; gap:20px; }
        .pod-current-status {
          display:flex; align-items:center; justify-content:space-between;
          background:var(--black-3,#1a1a1a);
          border:1px solid var(--black-4,#2a2a2a); border-radius:10px; padding:16px 20px;
        }
        .pod-cu-label {
          font-size:0.65rem; font-weight:700; letter-spacing:0.12em;
          text-transform:uppercase; color:var(--gray-3,#555);
        }

        .pod-status-form {
          background:var(--black-3,#1a1a1a);
          border:1px solid var(--black-4,#2a2a2a); border-radius:10px;
          padding:16px 20px; display:flex; flex-direction:column;
        }
        .pod-status-options { display:flex; flex-direction:column; gap:6px; margin-bottom:20px; }
        .pod-status-option {
          display:flex; align-items:center; gap:12px;
          padding:12px 14px;
          background:var(--black-2,#111);
          border:1px solid var(--black-4,#2a2a2a); border-radius:8px;
          cursor:pointer; transition:all 0.15s ease;
        }
        .pod-status-option:hover { border-color:var(--gray-2,#555); }
        .pod-status-option.selected { border-color:var(--pure-white,#fff); background:rgba(255,255,255,0.04); }
        .pod-status-option.current { opacity:0.45; cursor:default; }
        .pod-status-opt-label { font-size:0.84rem; font-weight:600; color:var(--white-dim,#ccc); flex:1; }
        .pod-status-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
        .pod-status-dot.delivered  { background:#a8e6a3; }
        .pod-status-dot.processing { background:#f0c27f; }
        .pod-status-dot.shipped    { background:#7fb3f0; }
        .pod-status-dot.terminated { background:#f07f7f; }
        .pod-status-dot.default    { background:var(--gray-3,#666); }
        .pod-current-tag {
          font-size:0.6rem; font-weight:700; letter-spacing:0.1em; text-transform:uppercase;
          color:var(--gray-3,#555); background:var(--black-4,#2a2a2a); padding:2px 7px; border-radius:6px;
        }
        .pod-check-icon { color:var(--pure-white,#fff); font-size:0.75rem; }

        .pod-update-btn {
          display:inline-flex; align-items:center; justify-content:center; gap:8px;
          width:100%; padding:12px;
          background:var(--pure-white,#fff); border:none; border-radius:8px;
          color:var(--black,#000);
          font-family:var(--font-body,sans-serif);
          font-size:0.78rem; font-weight:700; letter-spacing:0.08em; text-transform:uppercase;
          cursor:pointer; transition:all 0.15s ease;
        }
        .pod-update-btn:hover:not(:disabled) { background:var(--gray-5,#ddd); }
        .pod-update-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .pod-divider {
          display:flex; align-items:center; gap:12px;
          color:var(--gray-2,#444); font-size:0.65rem; font-weight:700;
          letter-spacing:0.1em; text-transform:uppercase;
        }
        .pod-divider::before,.pod-divider::after {
          content:""; flex:1; height:1px; background:var(--black-4,#2a2a2a);
        }

        .pod-other-actions { display:flex; flex-direction:column; gap:8px; }
        .pod-oa-btn {
          display:inline-flex; align-items:center; gap:8px;
          width:100%; padding:11px 16px; border-radius:8px;
          font-family:var(--font-body,sans-serif);
          font-size:0.78rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
          cursor:pointer; transition:all 0.15s ease; border:1px solid; justify-content:center;
        }
        .pod-oa-btn.danger {
          background:rgba(240,127,127,0.07); border-color:rgba(240,127,127,0.3); color:#f07f7f;
        }
        .pod-oa-btn.danger:hover:not(:disabled) { background:rgba(240,127,127,0.14); border-color:#f07f7f; }
        .pod-oa-btn:disabled { opacity:0.4; cursor:not-allowed; }

        .pod-terminated-note {
          display:flex; align-items:center; gap:8px; padding:12px 16px;
          background:rgba(168,230,163,0.05); border:1px solid rgba(168,230,163,0.2); border-radius:8px;
          font-size:0.78rem; font-weight:600; letter-spacing:0.06em; text-transform:uppercase; color:#a8e6a3;
        }
        .pod-no-actions {
          padding:16px; text-align:center; font-size:0.75rem; color:var(--gray-3,#555);
          letter-spacing:0.06em; text-transform:uppercase;
          background:var(--black-3,#1a1a1a); border:1px dashed var(--black-4,#2a2a2a); border-radius:8px;
        }

        /* Footer */
        .pod-footer {
          display:flex; align-items:center; gap:8px; flex-wrap:wrap;
          padding:14px 24px;
          border-top:1px solid var(--black-4,#2a2a2a);
          background:var(--black-3,#1a1a1a); flex-shrink:0;
        }
        .pod-foot-btn {
          display:inline-flex; align-items:center; gap:6px;
          padding:9px 16px; border-radius:6px;
          font-family:var(--font-body,sans-serif);
          font-size:0.72rem; font-weight:700; letter-spacing:0.07em; text-transform:uppercase;
          cursor:pointer; transition:all 0.15s ease; border:1px solid;
        }
        .pod-foot-btn:disabled { opacity:0.4; cursor:not-allowed; }
        .pod-foot-btn.primary { background:var(--pure-white,#fff); border-color:var(--pure-white,#fff); color:var(--black,#000); }
        .pod-foot-btn.primary:hover:not(:disabled) { background:var(--gray-5,#ddd); }
        .pod-foot-btn.accent  { background:transparent; border-color:var(--gray-2,#555); color:var(--gray-4,#999); }
        .pod-foot-btn.accent:hover:not(:disabled)  { border-color:var(--pure-white,#fff); color:var(--pure-white,#fff); }
        .pod-foot-btn.secondary { background:transparent; border-color:var(--gray-2,#555); color:var(--gray-4,#999); }
        .pod-foot-btn.secondary:hover:not(:disabled) { border-color:var(--gray-4,#999); color:var(--pure-white,#fff); }
        .pod-foot-btn.ghost { background:transparent; border-color:var(--black-4,#2a2a2a); color:var(--gray-3,#666); margin-left:auto; }
        .pod-foot-btn.ghost:hover:not(:disabled) { border-color:var(--gray-2,#555); color:var(--gray-4,#999); }
      `}</style>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   ORDER LIST
───────────────────────────────────────────────────────────── */
export default function OrderList() {
  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const { user: currentUser = {} } = useSelector((state) => state.authState);
  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  /* ── Persist entries-per-page ── */
  useEffect(() => {
    const saved = localStorage.getItem(ORDER_LIST_ENTRIES_KEY);
    if (saved) {
      const apply = () => {
        const sel = document.querySelector(".dataTables_length select");
        if (sel) { sel.value = saved; sel.dispatchEvent(new Event("change", { bubbles: true })); }
      };
      const timers = [100, 300, 600].map((d) => setTimeout(apply, d));
      return () => timers.forEach(clearTimeout);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        const sel = document.querySelector(".dataTables_length select");
        if (sel) {
          const fn = () => localStorage.setItem(ORDER_LIST_ENTRIES_KEY, sel.value);
          sel.addEventListener("change", fn);
          return () => sel.removeEventListener("change", fn);
        }
      }, 700);
      return () => clearTimeout(t);
    }
  }, [loading]);

  /* ── Filter ── */
  const filteredOrders =
    statusFilter === "All"
      ? adminOrders
      : adminOrders.filter((o) =>
        o.orderStatus.toLowerCase().includes(statusFilter.toLowerCase())
      );

  /* ── Status class helper ── */
  const statusClass = (s) =>
    s?.includes("Delivered") ? "active" :
      s?.includes("Processing") ? "processing" :
        s?.includes("Shipped") ? "shipped" :
          "disabled";

  /* ── Table data ── */
  const tableData = {
    columns: [
      { label: "ID", field: "id", sort: "asc" },
      { label: "Customer", field: "userName", sort: "asc" },
      { label: "Items", field: "noOfItems", sort: "asc" },
      { label: "Amount", field: "amount", sort: "asc" },
      { label: "Status", field: "status", sort: "asc" },
      { label: "Actions", field: "actions", sort: "disabled" },
    ],
    rows: filteredOrders.map((order) => ({
      id: (
        <span
          className="ord-id-link"
          onClick={() => setSelectedOrderId(order._id)}
          title="Click to view"
        >
          {order._id}
        </span>
      ),
      userName: order.user?.name || "Guest",
      noOfItems: order.orderItems.length,
      amount: `₹${order.totalPrice}`,
      status: (
        <span className={`status-pill ${statusClass(order.orderStatus)}`}>
          {order.orderStatus}
        </span>
      ),
      actions: (
        <Fragment>
          <button
            className="tbl-btn tbl-btn-edit"
            onClick={() => setSelectedOrderId(order._id)}
          >
            <i className="fa fa-eye" /> View
          </button>
        </Fragment>
      ),
    })),
  };

  /* ── Effects ── */
  useEffect(() => {
    if (error) {
      toast(error, { position: "bottom-center", type: "error", onOpen: () => dispatch(clearError()) });
      return;
    }
    if (isOrderDeleted) {
      toast("Order Deleted Successfully!", {
        type: "success", position: "bottom-center",
        onOpen: () => dispatch(clearOrderDeleted()),
      });
      return;
    }
    dispatch(adminOrdersAction);
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="admin-page-wrapper">
      <Sidebar />

      <div className="admin-page-content">

        {/* ── Header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fas fa-receipt" />
              Orders
            </h1>
            <p className="page-subtitle">
              <span className="count-badge">
                <span className="num">{adminOrders.length}</span> total
              </span>
            </p>
          </div>

          {/* Filter pills */}
          <div className="ol-filter-wrap">
            {["All", "Processing", "Shipped", "Delivered"].map((s) => (
              <button
                key={s}
                className={`ol-filter-btn ${statusFilter === s ? "active" : ""}`}
                onClick={() => setStatusFilter(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* ── Table ── */}
        <div className="table-card">
          {loading ? (
            <AdminLoader />
          ) : (
            <MDBDataTable
              data={tableData}
              bordered={false}
              striped={false}
              hover
              className="admin-table"
              responsive
              entries={10}
              entriesOptions={[5, 10, 20, 50]}
              noBottomColumns
            />
          )}
        </div>
      </div>

      {/* ── Popup ── */}
      {selectedOrderId && (
        <OrderDetailPopup
          orderId={selectedOrderId}
          currentUserId={currentUser?._id}
          onClose={() => setSelectedOrderId(null)}
          onOrderUpdated={() => dispatch(adminOrdersAction)}
        />
      )}

      <style>{`
        .ol-filter-wrap { display:flex; align-items:center; gap:6px; flex-wrap:wrap; }
        .ol-filter-btn {
          padding:7px 14px; background:transparent;
          border:1px solid var(--black-4,#2a2a2a); border-radius:6px;
          color:var(--gray-3,#666);
          font-family:var(--font-body,sans-serif); font-size:0.72rem; font-weight:700;
          letter-spacing:0.07em; text-transform:uppercase; cursor:pointer; transition:all 0.15s ease;
        }
        .ol-filter-btn:hover { border-color:var(--gray-2,#555); color:var(--gray-4,#999); }
        .ol-filter-btn.active { background:var(--pure-white,#fff); border-color:var(--pure-white,#fff); color:var(--black,#000); }

        .ord-id-link {
          color:var(--gray-4,#999); font-family:var(--font-mono,monospace); font-size:0.78rem;
          cursor:pointer; transition:color 0.15s ease;
          text-decoration:underline; text-underline-offset:3px; text-decoration-color:transparent;
        }
        .ord-id-link:hover { color:var(--pure-white,#fff); text-decoration-color:var(--gray-3,#555); }

        .status-pill.processing { background:rgba(240,194,127,.08); color:#f0c27f; border:1px solid rgba(240,194,127,.25); }
        .status-pill.shipped    { background:rgba(127,179,240,.08); color:#7fb3f0; border:1px solid rgba(127,179,240,.25); }

        @media(max-width:640px){ .ol-filter-wrap{display:none;} }
      `}</style>
    </div>
  );
}