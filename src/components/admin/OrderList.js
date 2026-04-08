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

function OrderDetailPopup({ orderId, currentUserId, onClose, onOrderUpdated }) {
  const dispatch = useDispatch();
  const { isOrderUpdated, error: updateError } = useSelector((state) => state.orderState);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [activeTab, setActiveTab] = useState("details");
  const [tabTransitioning, setTabTransitioning] = useState(false);

  const shippingInfo = order?.shippingInfo ?? {};
  const orderItems = order?.orderItems ?? [];
  const totalPrice = order?.totalPrice ?? 0;
  const orderStatus = order?.orderStatus ?? "";
  const paymentInfo = order?.paymentInfo ?? {};
  const user = order?.user ?? {};

  const paymentMethod = paymentInfo?.type === "COD" ? "Cash On Delivery" : "Online Payment";
  let paymentStatus = paymentInfo?.type === "COD" ? "NOT PAID YET" : "PAID";
  if (orderStatus === "Cancelled" || orderStatus === "Returned") paymentStatus = "PAYMENT REFUNDED ON WALLET";

  const isDelivered = orderStatus.includes("Delivered");
  const isProcessing = orderStatus.includes("Processing");
  const isShipped = orderStatus.includes("Shipped");
  const isTerminated = orderStatus.includes("Cancelled") || orderStatus.includes("Returned");

  const fetchOrder = useCallback(() => {
    setLoading(true);
    axios.get(`https://saliheenperfumes-zd2i.onrender.com/api/v1/order/${orderId}`, { withCredentials: true })
      .then(({ data }) => { setOrder(data.order); setSelectedStatus(data.order.orderStatus ?? ""); setLoading(false); })
      .catch(() => { toast("Failed to load order details", { type: "error", position: "bottom-center" }); setLoading(false); });
  }, [orderId]);

  useEffect(() => { fetchOrder(); }, [fetchOrder]);
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);

  useEffect(() => {
    if (isOrderUpdated) {
      toast("Order status updated!", { type: "success", position: "bottom-center", onOpen: () => dispatch(clearOrderUpdated()) });
      fetchOrder(); onOrderUpdated?.(); setActionLoading(false);
    }
    if (updateError) {
      toast(updateError, { type: "error", position: "bottom-center", onOpen: () => dispatch(clearError()) });
      setActionLoading(false);
    }
  }, [isOrderUpdated, updateError]);

  const handleStatusUpdate = (e) => {
    e.preventDefault();
    if (!selectedStatus || selectedStatus === orderStatus) { toast("Please select a different status", { type: "warning", position: "bottom-center" }); return; }
    setActionLoading(true);
    const formData = new FormData();
    formData.append("orderStatus", selectedStatus);
    dispatch(updateOrder(orderId, formData));
  };

  const handleCancelOrder = async () => {
    setActionLoading(true);
    try {
      await axios.post(`https://saliheenperfumes-zd2i.onrender.com/api/v1/ReturnOrCancelOrder`, { type: paymentMethod, decision: "Cancel", user: currentUserId, order: orderId }, { withCredentials: true });
      toast("Cancel request submitted!", { type: "success", position: "bottom-center" });
      fetchOrder(); onOrderUpdated?.();
    } catch (err) { toast(err?.response?.data?.message || "Error", { type: "error", position: "bottom-center" }); }
    finally { setActionLoading(false); }
  };

  const handleReturnOrder = async () => {
    setActionLoading(true);
    try {
      await axios.post(`https://saliheenperfumes-zd2i.onrender.com/api/v1/ReturnOrCancelOrder`, { type: paymentMethod, decision: "Return", user: currentUserId, order: orderId }, { withCredentials: true });
      toast("Return request submitted!", { type: "success", position: "bottom-center" });
      fetchOrder(); onOrderUpdated?.();
    } catch (err) { toast(err?.response?.data?.message || "Error", { type: "error", position: "bottom-center" }); }
    finally { setActionLoading(false); }
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18); doc.text("Order Invoice", 10, 10);
    doc.setFontSize(12);
    doc.text(`Order ID: ${orderId}`, 10, 20);
    doc.text(`Name: ${user?.name || ""}`, 10, 30);
    doc.text(`Phone: ${shippingInfo.phoneNo || ""}`, 10, 40);
    doc.text(`Address: ${[shippingInfo.address, shippingInfo.city, shippingInfo.postalCode, shippingInfo.state, shippingInfo.country].filter(Boolean).join(", ")}`, 10, 50);
    doc.text(`Amount Paid: Rs.${totalPrice}`, 10, 60);
    doc.text(`Payment Method: ${paymentMethod}`, 10, 70);
    doc.text("Ordered Items:", 10, 80);
    let y = 90;
    orderItems.forEach((item, i) => { doc.text(`${i + 1}. ${item.name} - Rs.${item.price} x ${item.quantity}`, 10, y); y += 10; });
    doc.save(`invoice_${orderId}.pdf`);
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    setTabTransitioning(true);
    setTimeout(() => { setActiveTab(tab); setTabTransitioning(false); }, 160);
  };

  const STATUS_OPTIONS = ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"];

  const statusColorClass = (s) =>
    s?.includes("Delivered") ? "delivered" :
      s?.includes("Processing") ? "processing" :
        s?.includes("Shipped") ? "shipped" :
          (s?.includes("Cancelled") || s?.includes("Returned")) ? "terminated" : "default";

  return (
    <>
      <div className="pod-backdrop" onClick={onClose} />
      <div className="pod-drawer">

        <div className="pod-head">
          <div className="pod-head-left">
            <div className="pod-head-label">Order</div>
            <div className="pod-head-id">#{orderId}</div>
          </div>
          {!loading && <span className={`pod-status-chip ${statusColorClass(orderStatus)}`}>{orderStatus}</span>}
          <button className="pod-close" onClick={onClose}><i className="fas fa-times" /></button>
        </div>

        {!loading && (
          <div className="pod-tabs">
            <button className={`pod-tab ${activeTab === "details" ? "active" : ""}`} onClick={() => switchTab("details")}>
              <i className="fas fa-info-circle" /> Details
            </button>
            <button className={`pod-tab ${activeTab === "update" ? "active" : ""}`} onClick={() => switchTab("update")}>
              <i className="fas fa-exchange-alt" /> Update Status
            </button>
          </div>
        )}

        <div className={`pod-body ${tabTransitioning ? "tab-exit" : "tab-enter"}`}>
          {loading ? (
            <div className="pod-loader">
              <div className="pod-loader-ring"><ThreeDots height="48" width="48" radius="8" color="#ffffff" visible /></div>
              <span className="pod-loader-text">Fetching order…</span>
            </div>

          ) : activeTab === "details" ? (
            <>
              <div className="pod-strip">
                <div className="pod-strip-item" style={{ animationDelay: "0ms" }}>
                  <span className="pod-strip-label">Payment Method</span>
                  <span className="pod-strip-val">{paymentMethod}</span>
                </div>
                <div className="pod-strip-sep" />
                <div className="pod-strip-item" style={{ animationDelay: "60ms" }}>
                  <span className="pod-strip-label">Payment Status</span>
                  <span className={`pod-pay-badge ${paymentStatus === "PAID" ? "paid" : paymentStatus === "NOT PAID YET" ? "unpaid" : "refunded"}`}>
                    {paymentStatus}
                  </span>
                </div>
                <div className="pod-strip-sep" />
                <div className="pod-strip-item" style={{ animationDelay: "120ms" }}>
                  <span className="pod-strip-label">Total Amount</span>
                  <span className="pod-strip-total">Rs.{totalPrice}</span>
                </div>
              </div>

              <div className="pod-section pod-section-anim" style={{ animationDelay: "80ms" }}>
                <div className="pod-section-title"><i className="fas fa-map-marker-alt" /> Shipping Info</div>
                <div className="pod-kv-grid">
                  <div className="pod-kv"><span className="pod-k">Name</span><span className="pod-v">{user?.name || "—"}</span></div>
                  <div className="pod-kv"><span className="pod-k">Phone</span><span className="pod-v">{shippingInfo.phoneNo || "—"}</span></div>
                  <div className="pod-kv pod-kv-full">
                    <span className="pod-k">Address</span>
                    <span className="pod-v">{[shippingInfo.address, shippingInfo.city, shippingInfo.postalCode, shippingInfo.state, shippingInfo.country].filter(Boolean).join(", ") || "—"}</span>
                  </div>
                </div>
              </div>

              <div className="pod-section pod-section-anim" style={{ animationDelay: "140ms" }}>
                <div className="pod-section-title">
                  <i className="fas fa-box-open" /> Ordered Items
                  <span className="pod-count-badge">{orderItems.length}</span>
                </div>
                <div className="pod-section-title">
                  <i className="fas fa-calendar-alt" /> Order Date
                  <span className="pod-count-badge">{new Date(order.createdAt).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</span>
                </div>
                <div className="pod-items-list">
                  {orderItems.map((item, idx) => (
                    <div className="pod-item" key={idx} style={{ animationDelay: `${160 + idx * 40}ms` }}>
                      <div className="pod-item-top">
                        <Link to={`/product/${item.product}`} className="pod-item-name" onClick={onClose}>{item.name}</Link>
                        <span className="pod-item-total">Rs.{item.price}</span>
                      </div>
                      <div className="pod-item-meta">
                        <span className="pod-meta-tag">{item.quantity} ml</span>
                        <span className="pod-meta-tag">{item.noOfBottles} Bottles</span>
                        <span className="pod-meta-tag">Rs.{item.pricePerBottle} / Bottle</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>

          ) : (
            <div className="pod-update-wrap">
              <div className="pod-current-status pod-section-anim" style={{ animationDelay: "0ms" }}>
                <span className="pod-cu-label">Current Status</span>
                <span className={`pod-status-chip large ${statusColorClass(orderStatus)}`}>{orderStatus}</span>
              </div>

              <form onSubmit={handleStatusUpdate} className="pod-status-form pod-section-anim" style={{ animationDelay: "60ms" }}>
                <div className="pod-section-title" style={{ marginBottom: "16px" }}>
                  <i className="fas fa-exchange-alt" /> Select New Status
                </div>
                <div className="pod-status-options">
                  {STATUS_OPTIONS.map((s, idx) => (
                    <label key={s} className={`pod-status-option ${selectedStatus === s ? "selected" : ""} ${s === orderStatus ? "current" : ""}`} style={{ animationDelay: `${80 + idx * 35}ms` }}>
                      <input type="radio" name="orderStatus" value={s} checked={selectedStatus === s} onChange={() => setSelectedStatus(s)} style={{ display: "none" }} />
                      <span className={`pod-status-dot ${statusColorClass(s)}`} />
                      <span className="pod-status-opt-label">{s}</span>
                      {s === orderStatus && <span className="pod-current-tag">current</span>}
                      {selectedStatus === s && s !== orderStatus && <i className="fas fa-check pod-check-icon" />}
                    </label>
                  ))}
                </div>
                <button type="submit" className="pod-update-btn" disabled={actionLoading || !selectedStatus || selectedStatus === orderStatus}>
                  {actionLoading ? <><ThreeDots height="16" width="28" radius="4" color="#000" visible />Updating…</> : <><i className="fas fa-save" /> Update Status</>}
                </button>
              </form>

              <div className="pod-divider pod-section-anim" style={{ animationDelay: "260ms" }}><span>Other Actions</span></div>

              <div className="pod-other-actions pod-section-anim" style={{ animationDelay: "300ms" }}>
                {isDelivered && <button className="pod-oa-btn danger" onClick={handleReturnOrder} disabled={actionLoading}><i className="fas fa-undo" /> Return Order</button>}
                {(isShipped || isProcessing) && <button className="pod-oa-btn danger" onClick={handleCancelOrder} disabled={actionLoading}><i className="fas fa-times-circle" /> Cancel Order</button>}
                {isTerminated && <div className="pod-terminated-note"><i className="fas fa-check-circle" />Order {orderStatus} successfully</div>}
                {!isDelivered && !isShipped && !isProcessing && !isTerminated && <div className="pod-no-actions">No additional actions available</div>}
              </div>
            </div>
          )}
        </div>

        {!loading && (
          <div className="pod-footer">
            {activeTab === "details" && (
              <>
                {isDelivered && <button className="pod-foot-btn primary" onClick={generatePDF} disabled={actionLoading}><i className="fas fa-file-download" /> Invoice PDF</button>}
                <button className="pod-foot-btn accent" onClick={() => switchTab("update")}><i className="fas fa-exchange-alt" /> Update Status</button>
              </>
            )}
            {activeTab === "update" && <button className="pod-foot-btn secondary" onClick={() => switchTab("details")}><i className="fas fa-arrow-left" /> Back to Details</button>}
            <button className="pod-foot-btn ghost" onClick={onClose}>Close</button>
          </div>
        )}
      </div>

      <style>{`
        .pod-backdrop {
          position:fixed; inset:0; background:rgba(0,0,0,0.82);
          backdrop-filter:blur(6px); -webkit-backdrop-filter:blur(6px);
          z-index:1200; animation:pod-fade 0.22s ease forwards;
        }
        @keyframes pod-fade { from{opacity:0;backdrop-filter:blur(0)} to{opacity:1;backdrop-filter:blur(6px)} }

        .pod-drawer {
          position:fixed; top:0; right:0; width:min(580px,100vw); height:100vh;
          background:var(--black-2,#111); border-left:1px solid var(--black-4,#2a2a2a);
          z-index:1201; display:flex; flex-direction:column;
          animation:pod-slide 0.32s cubic-bezier(0.22,1,0.36,1) forwards; overflow:hidden;
          box-shadow:-24px 0 80px rgba(0,0,0,0.6),-1px 0 0 rgba(255,255,255,0.03);
        }
        @keyframes pod-slide { from{transform:translateX(100%);opacity:0.6} to{transform:translateX(0);opacity:1} }
        .pod-drawer::before {
          content:""; position:absolute; top:0; left:0; right:0; height:1px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.08),transparent);
          animation:pod-shimmer-line 2.4s ease 0.3s both;
        }
        @keyframes pod-shimmer-line { from{transform:scaleX(0);opacity:0} to{transform:scaleX(1);opacity:1} }
        @media(max-width:500px){.pod-drawer{width:100vw;}}

        .pod-head {
          display:flex; align-items:center; gap:12px; padding:20px 24px;
          border-bottom:1px solid var(--black-4,#2a2a2a); flex-shrink:0;
          animation:pod-head-in 0.35s cubic-bezier(0.22,1,0.36,1) 0.08s both;
        }
        @keyframes pod-head-in { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        .pod-head-left{flex:1;min-width:0;}
        .pod-head-label{font-size:0.6rem;font-weight:700;letter-spacing:0.16em;text-transform:uppercase;color:var(--gray-3,#555);margin-bottom:3px;}
        .pod-head-id{font-size:0.78rem;font-weight:700;color:var(--pure-white,#fff);font-family:var(--font-mono,monospace);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
        .pod-close{background:none;border:1px solid var(--black-4,#2a2a2a);border-radius:6px;color:var(--gray-3,#666);width:32px;height:32px;display:flex;align-items:center;justify-content:center;cursor:pointer;transition:all 0.18s ease;flex-shrink:0;}
        .pod-close:hover{border-color:var(--gray-2,#888);color:var(--pure-white,#fff);transform:rotate(90deg);background:rgba(255,255,255,0.04);}

        .pod-status-chip{display:inline-flex;align-items:center;padding:4px 10px;border-radius:20px;font-size:0.65rem;font-weight:700;letter-spacing:0.09em;text-transform:uppercase;border:1px solid;white-space:nowrap;flex-shrink:0;transition:box-shadow 0.2s ease;}
        .pod-status-chip:hover{box-shadow:0 0 12px rgba(255,255,255,0.08);}
        .pod-status-chip.large{font-size:0.78rem;padding:6px 14px;}
        .pod-status-chip.delivered{color:#a8e6a3;border-color:rgba(168,230,163,.3);background:rgba(168,230,163,.07);}
        .pod-status-chip.processing{color:#f0c27f;border-color:rgba(240,194,127,.3);background:rgba(240,194,127,.07);animation:chip-pulse-amber 3s ease-in-out infinite;}
        .pod-status-chip.shipped{color:#7fb3f0;border-color:rgba(127,179,240,.3);background:rgba(127,179,240,.07);animation:chip-pulse-blue 3s ease-in-out infinite;}
        .pod-status-chip.terminated{color:#f07f7f;border-color:rgba(240,127,127,.3);background:rgba(240,127,127,.07);}
        .pod-status-chip.default{color:var(--gray-4,#999);border-color:var(--black-4,#333);background:transparent;}
        @keyframes chip-pulse-amber{0%,100%{box-shadow:0 0 0 0 rgba(240,194,127,0)}50%{box-shadow:0 0 0 4px rgba(240,194,127,0.12)}}
        @keyframes chip-pulse-blue{0%,100%{box-shadow:0 0 0 0 rgba(127,179,240,0)}50%{box-shadow:0 0 0 4px rgba(127,179,240,0.12)}}

        .pod-tabs{display:flex;border-bottom:1px solid var(--black-4,#2a2a2a);flex-shrink:0;animation:pod-head-in 0.35s cubic-bezier(0.22,1,0.36,1) 0.14s both;}
        .pod-tab{flex:1;padding:13px 16px;background:none;border:none;border-bottom:2px solid transparent;color:var(--gray-3,#666);font-family:var(--font-body,sans-serif);font-size:0.72rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:color 0.18s ease,border-color 0.18s ease;display:flex;align-items:center;justify-content:center;gap:7px;margin-bottom:-1px;position:relative;overflow:hidden;}
        .pod-tab::after{content:"";position:absolute;inset:0;background:rgba(255,255,255,0.03);transform:scaleX(0);transition:transform 0.2s ease;transform-origin:left;}
        .pod-tab:hover::after{transform:scaleX(1);}
        .pod-tab:hover{color:var(--gray-4,#999);}
        .pod-tab.active{color:var(--pure-white,#fff);border-bottom-color:var(--pure-white,#fff);}

        .pod-body{flex:1;overflow-y:auto;padding:20px 24px;display:flex;flex-direction:column;gap:16px;}
        .pod-body::-webkit-scrollbar{width:4px;}
        .pod-body::-webkit-scrollbar-track{background:transparent;}
        .pod-body::-webkit-scrollbar-thumb{background:var(--black-4,#333);border-radius:2px;}
        .pod-body::-webkit-scrollbar-thumb:hover{background:var(--gray-2,#555);}

        .tab-exit{animation:tab-out 0.16s ease forwards;}
        .tab-enter{animation:tab-in 0.22s cubic-bezier(0.22,1,0.36,1) forwards;}
        @keyframes tab-out{from{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(6px)}}
        @keyframes tab-in{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}

        .pod-loader{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;min-height:260px;animation:pod-head-in 0.3s ease both;}
        .pod-loader-ring{padding:16px;border:1px solid var(--black-4,#2a2a2a);border-radius:50%;background:var(--black-3,#1a1a1a);animation:loader-ring-pulse 2s ease-in-out infinite;}
        @keyframes loader-ring-pulse{0%,100%{box-shadow:0 0 0 0 rgba(255,255,255,0.04)}50%{box-shadow:0 0 0 8px rgba(255,255,255,0.04)}}
        .pod-loader-text{color:var(--gray-3,#666);font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;animation:text-blink 1.8s ease-in-out infinite;}
        @keyframes text-blink{0%,100%{opacity:0.5}50%{opacity:1}}

        .pod-section-anim{animation:section-in 0.3s cubic-bezier(0.22,1,0.36,1) both;}
        @keyframes section-in{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        .pod-strip{display:flex;align-items:center;background:var(--black-3,#1a1a1a);border:1px solid var(--black-4,#2a2a2a);border-radius:10px;overflow:hidden;animation:section-in 0.3s cubic-bezier(0.22,1,0.36,1) both;}
        .pod-strip-item{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:14px 12px;gap:5px;text-align:center;transition:background 0.15s ease;}
        .pod-strip-item:hover{background:rgba(255,255,255,0.025);}
        .pod-strip-sep{width:1px;height:40px;background:var(--black-4,#2a2a2a);flex-shrink:0;}
        .pod-strip-label{font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray-3,#555);}
        .pod-strip-val{font-size:0.8rem;color:var(--white-dim,#ccc);font-weight:600;}
        .pod-strip-total{font-size:1rem;font-weight:700;color:var(--pure-white,#fff);font-family:var(--font-mono,monospace);}

        .pod-pay-badge{display:inline-block;padding:2px 8px;border-radius:10px;font-size:0.62rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;border:1px solid;}
        .pod-pay-badge.paid{color:#a8e6a3;border-color:rgba(168,230,163,.3);background:rgba(168,230,163,.07);}
        .pod-pay-badge.unpaid{color:#f07f7f;border-color:rgba(240,127,127,.3);background:rgba(240,127,127,.07);}
        .pod-pay-badge.refunded{color:#c3a0f0;border-color:rgba(195,160,240,.3);background:rgba(195,160,240,.07);}

        .pod-section{background:var(--black-3,#1a1a1a);border:1px solid var(--black-4,#2a2a2a);border-radius:10px;overflow:hidden;transition:border-color 0.2s ease;}
        .pod-section:hover{border-color:rgba(255,255,255,0.06);}
        .pod-section-title{display:flex;align-items:center;gap:8px;padding:13px 16px;font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gray-3,#666);border-bottom:1px solid var(--black-4,#2a2a2a);}
        .pod-count-badge{margin-left:auto;background:var(--black-4,#2a2a2a);color:var(--gray-4,#888);font-size:0.65rem;padding:2px 7px;border-radius:8px;font-weight:700;transition:background 0.15s ease,color 0.15s ease;}
        .pod-section:hover .pod-count-badge{background:rgba(255,255,255,0.08);color:var(--white-dim,#ccc);}

        .pod-kv-grid{display:grid;grid-template-columns:1fr 1fr;gap:0;}
        .pod-kv{padding:12px 16px;border-right:1px solid var(--black-4,#2a2a2a);border-bottom:1px solid var(--black-4,#2a2a2a);display:flex;flex-direction:column;gap:4px;transition:background 0.15s ease;}
        .pod-kv:hover{background:rgba(255,255,255,0.02);}
        .pod-kv:nth-child(even){border-right:none;}
        .pod-kv-full{grid-column:1/-1;border-right:none;border-bottom:none;}
        .pod-kv:last-child{border-bottom:none;}
        .pod-k{font-size:0.62rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray-3,#555);}
        .pod-v{font-size:0.84rem;color:var(--white-dim,#ccc);line-height:1.4;}

        .pod-items-list{display:flex;flex-direction:column;}
        .pod-item{padding:13px 16px;border-bottom:1px solid var(--black-4,#2a2a2a);display:flex;flex-direction:column;gap:7px;transition:background 0.15s ease,padding-left 0.18s ease;position:relative;animation:section-in 0.3s cubic-bezier(0.22,1,0.36,1) both;}
        .pod-item::before{content:"";position:absolute;left:0;top:0;bottom:0;width:2px;background:var(--pure-white,#fff);transform:scaleY(0);transform-origin:bottom;transition:transform 0.18s ease;border-radius:0 1px 1px 0;}
        .pod-item:hover{background:rgba(255,255,255,0.025);padding-left:20px;}
        .pod-item:hover::before{transform:scaleY(1);}
        .pod-item:last-child{border-bottom:none;}
        .pod-item-top{display:flex;align-items:flex-start;justify-content:space-between;gap:12px;}
        .pod-item-name{font-size:0.88rem;font-weight:600;color:var(--white-dim,#ccc);text-decoration:none;transition:color 0.15s ease;position:relative;}
        .pod-item-name::after{content:"";position:absolute;bottom:-1px;left:0;right:0;height:1px;background:var(--pure-white,#fff);transform:scaleX(0);transform-origin:left;transition:transform 0.2s ease;}
        .pod-item-name:hover{color:var(--pure-white,#fff);}
        .pod-item-name:hover::after{transform:scaleX(1);}
        .pod-item-total{font-size:0.88rem;font-weight:700;color:var(--pure-white,#fff);font-family:var(--font-mono,monospace);white-space:nowrap;}
        .pod-item-meta{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
        .pod-meta-tag{font-size:0.7rem;color:var(--gray-3,#666);background:var(--black-4,#2a2a2a);padding:2px 8px;border-radius:4px;transition:background 0.15s ease,color 0.15s ease;}
        .pod-item:hover .pod-meta-tag{background:rgba(255,255,255,0.07);color:var(--gray-4,#888);}

        .pod-update-wrap{display:flex;flex-direction:column;gap:20px;}
        .pod-current-status{display:flex;align-items:center;justify-content:space-between;background:var(--black-3,#1a1a1a);border:1px solid var(--black-4,#2a2a2a);border-radius:10px;padding:16px 20px;transition:border-color 0.2s ease;}
        .pod-current-status:hover{border-color:rgba(255,255,255,0.07);}
        .pod-cu-label{font-size:0.65rem;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:var(--gray-3,#555);}

        .pod-status-form{background:var(--black-3,#1a1a1a);border:1px solid var(--black-4,#2a2a2a);border-radius:10px;padding:16px 20px;display:flex;flex-direction:column;}
        .pod-status-options{display:flex;flex-direction:column;gap:6px;margin-bottom:20px;}
        .pod-status-option{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--black-2,#111);border:1px solid var(--black-4,#2a2a2a);border-radius:8px;cursor:pointer;transition:border-color 0.18s ease,background 0.18s ease,transform 0.15s ease,box-shadow 0.18s ease;position:relative;overflow:hidden;animation:section-in 0.28s cubic-bezier(0.22,1,0.36,1) both;}
        .pod-status-option::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--pure-white,#fff);transform:scaleY(0);transition:transform 0.18s ease;border-radius:0 2px 2px 0;}
        .pod-status-option:hover:not(.current){border-color:var(--gray-2,#555);transform:translateX(2px);}
        .pod-status-option:hover:not(.current)::before{transform:scaleY(1);}
        .pod-status-option.selected{border-color:var(--pure-white,#fff);background:rgba(255,255,255,0.04);box-shadow:0 0 0 1px rgba(255,255,255,0.06) inset;transform:translateX(3px);}
        .pod-status-option.selected::before{transform:scaleY(1);}
        .pod-status-option.current{opacity:0.45;cursor:default;}
        .pod-status-opt-label{font-size:0.84rem;font-weight:600;color:var(--white-dim,#ccc);flex:1;transition:color 0.15s ease;}
        .pod-status-option:hover:not(.current) .pod-status-opt-label{color:var(--pure-white,#fff);}
        .pod-status-dot{width:8px;height:8px;border-radius:50%;flex-shrink:0;transition:transform 0.18s ease;}
        .pod-status-option:hover:not(.current) .pod-status-dot{transform:scale(1.35);}
        .pod-status-option.selected .pod-status-dot{transform:scale(1.35);}
        .pod-status-dot.delivered{background:#a8e6a3;box-shadow:0 0 6px rgba(168,230,163,0.4);}
        .pod-status-dot.processing{background:#f0c27f;box-shadow:0 0 6px rgba(240,194,127,0.4);}
        .pod-status-dot.shipped{background:#7fb3f0;box-shadow:0 0 6px rgba(127,179,240,0.4);}
        .pod-status-dot.terminated{background:#f07f7f;box-shadow:0 0 6px rgba(240,127,127,0.4);}
        .pod-status-dot.default{background:var(--gray-3,#666);}
        .pod-current-tag{font-size:0.6rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:var(--gray-3,#555);background:var(--black-4,#2a2a2a);padding:2px 7px;border-radius:6px;}
        .pod-check-icon{color:var(--pure-white,#fff);font-size:0.75rem;animation:check-pop 0.2s cubic-bezier(0.34,1.56,0.64,1) both;}
        @keyframes check-pop{from{transform:scale(0) rotate(-20deg);opacity:0}to{transform:scale(1) rotate(0deg);opacity:1}}

        .pod-update-btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;width:100%;padding:12px;background:var(--pure-white,#fff);border:none;border-radius:8px;color:var(--black,#000);font-family:var(--font-body,sans-serif);font-size:0.78rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;cursor:pointer;transition:background 0.15s ease,transform 0.15s ease,box-shadow 0.15s ease;position:relative;overflow:hidden;}
        .pod-update-btn::after{content:"";position:absolute;top:0;left:-100%;bottom:0;width:60%;background:linear-gradient(90deg,transparent,rgba(0,0,0,0.08),transparent);transform:skewX(-15deg);transition:left 0.5s ease;}
        .pod-update-btn:hover:not(:disabled){background:var(--gray-5,#ddd);transform:translateY(-1px);box-shadow:0 4px 20px rgba(255,255,255,0.12);}
        .pod-update-btn:hover:not(:disabled)::after{left:140%;}
        .pod-update-btn:active:not(:disabled){transform:translateY(0);box-shadow:none;}
        .pod-update-btn:disabled{opacity:0.4;cursor:not-allowed;}

        .pod-divider{display:flex;align-items:center;gap:12px;color:var(--gray-2,#444);font-size:0.65rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;}
        .pod-divider::before,.pod-divider::after{content:"";flex:1;height:1px;background:var(--black-4,#2a2a2a);}

        .pod-other-actions{display:flex;flex-direction:column;gap:8px;}
        .pod-oa-btn{display:inline-flex;align-items:center;gap:8px;width:100%;padding:11px 16px;border-radius:8px;font-family:var(--font-body,sans-serif);font-size:0.78rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;border:1px solid;justify-content:center;transition:background 0.18s ease,border-color 0.18s ease,transform 0.15s ease,box-shadow 0.18s ease;}
        .pod-oa-btn.danger{background:rgba(240,127,127,0.07);border-color:rgba(240,127,127,0.3);color:#f07f7f;}
        .pod-oa-btn.danger:hover:not(:disabled){background:rgba(240,127,127,0.14);border-color:#f07f7f;transform:translateY(-1px);box-shadow:0 4px 16px rgba(240,127,127,0.15);}
        .pod-oa-btn:active:not(:disabled){transform:translateY(0);box-shadow:none;}
        .pod-oa-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .pod-terminated-note{display:flex;align-items:center;gap:8px;padding:12px 16px;background:rgba(168,230,163,0.05);border:1px solid rgba(168,230,163,0.2);border-radius:8px;font-size:0.78rem;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#a8e6a3;animation:section-in 0.3s ease both;}
        .pod-no-actions{padding:16px;text-align:center;font-size:0.75rem;color:var(--gray-3,#555);letter-spacing:0.06em;text-transform:uppercase;background:var(--black-3,#1a1a1a);border:1px dashed var(--black-4,#2a2a2a);border-radius:8px;}

        .pod-footer{display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:14px 24px;border-top:1px solid var(--black-4,#2a2a2a);background:var(--black-3,#1a1a1a);flex-shrink:0;animation:pod-head-in 0.35s cubic-bezier(0.22,1,0.36,1) 0.1s both;}
        .pod-foot-btn{display:inline-flex;align-items:center;gap:6px;padding:9px 16px;border-radius:6px;font-family:var(--font-body,sans-serif);font-size:0.72rem;font-weight:700;letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;border:1px solid;transition:background 0.15s ease,border-color 0.15s ease,color 0.15s ease,transform 0.15s ease,box-shadow 0.15s ease;position:relative;overflow:hidden;}
        .pod-foot-btn::after{content:"";position:absolute;inset:0;background:rgba(255,255,255,0.04);opacity:0;transition:opacity 0.15s ease;}
        .pod-foot-btn:hover::after{opacity:1;}
        .pod-foot-btn:hover:not(:disabled){transform:translateY(-1px);}
        .pod-foot-btn:active:not(:disabled){transform:translateY(0);}
        .pod-foot-btn:disabled{opacity:0.4;cursor:not-allowed;}
        .pod-foot-btn.primary{background:var(--pure-white,#fff);border-color:var(--pure-white,#fff);color:var(--black,#000);}
        .pod-foot-btn.primary:hover:not(:disabled){background:var(--gray-5,#ddd);box-shadow:0 4px 20px rgba(255,255,255,0.15);}
        .pod-foot-btn.accent{background:transparent;border-color:var(--gray-2,#555);color:var(--gray-4,#999);}
        .pod-foot-btn.accent:hover:not(:disabled){border-color:var(--pure-white,#fff);color:var(--pure-white,#fff);}
        .pod-foot-btn.secondary{background:transparent;border-color:var(--gray-2,#555);color:var(--gray-4,#999);}
        .pod-foot-btn.secondary:hover:not(:disabled){border-color:var(--gray-4,#999);color:var(--pure-white,#fff);}
        .pod-foot-btn.ghost{background:transparent;border-color:var(--black-4,#2a2a2a);color:var(--gray-3,#666);margin-left:auto;}
        .pod-foot-btn.ghost:hover:not(:disabled){border-color:var(--gray-2,#555);color:var(--gray-4,#999);}
      `}</style>
    </>
  );
}

export default function OrderList() {
  const { adminOrders = [], loading = true, error, isOrderDeleted } = useSelector((state) => state.orderState);
  const { user: currentUser = {} } = useSelector((state) => state.authState);
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem(ORDER_LIST_ENTRIES_KEY);
    if (saved) {
      const apply = () => { const sel = document.querySelector(".dataTables_length select"); if (sel) { sel.value = saved; sel.dispatchEvent(new Event("change", { bubbles: true })); } };
      const timers = [100, 300, 600].map((d) => setTimeout(apply, d));
      return () => timers.forEach(clearTimeout);
    }
  }, [loading]);

  useEffect(() => {
    if (!loading) {
      const t = setTimeout(() => {
        const sel = document.querySelector(".dataTables_length select");
        if (sel) { const fn = () => localStorage.setItem(ORDER_LIST_ENTRIES_KEY, sel.value); sel.addEventListener("change", fn); return () => sel.removeEventListener("change", fn); }
      }, 700);
      return () => clearTimeout(t);
    }
  }, [loading]);

  const filteredOrders = statusFilter === "All" ? adminOrders : adminOrders.filter((o) => o.orderStatus.toLowerCase().includes(statusFilter.toLowerCase()));

  const statusClass = (s) =>
    s?.includes("Delivered") ? "active" :
      s?.includes("Processing") ? "processing" :
        s?.includes("Shipped") ? "shipped" : "disabled";

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
      id: (<span className="ord-id-link" onClick={() => setSelectedOrderId(order._id)} title="Click to view">{order._id}</span>),
      userName: order.user?.name || "Guest",
      noOfItems: order.orderItems.length,
      amount: `Rs.${order.totalPrice}`,
      status: (<span className={`status-pill ${statusClass(order.orderStatus)}`}>{order.orderStatus}</span>),
      actions: (
        <Fragment>
          <button className="tbl-btn tbl-btn-edit" onClick={() => setSelectedOrderId(order._id)}>
            <i className="fa fa-eye" /> View
          </button>
        </Fragment>
      ),
    })),
  };

  useEffect(() => {
    if (error) { toast(error, { position: "bottom-center", type: "error", onOpen: () => dispatch(clearError()) }); return; }
    if (isOrderDeleted) { toast("Order Deleted Successfully!", { type: "success", position: "bottom-center", onOpen: () => dispatch(clearOrderDeleted()) }); return; }
    dispatch(adminOrdersAction);
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="admin-page-wrapper">
      <Sidebar />
      <div className="admin-page-content">

        <div className="page-header ol-page-header-anim">
          <div>
            <h1 className="page-title"><i className="fas fa-receipt" /> Orders</h1>
            <p className="page-subtitle">
              <span className="count-badge"><span className="num">{adminOrders.length}</span> total</span>
            </p>
          </div>
          <div className="ol-filter-wrap">
            {["All", "Processing", "Shipped", "Delivered"].map((s, i) => (
              <button key={s} className={`ol-filter-btn ${statusFilter === s ? "active" : ""}`} onClick={() => setStatusFilter(s)} style={{ animationDelay: `${i * 55}ms` }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="table-card ol-table-anim">
          {loading ? <AdminLoader /> : (
            <MDBDataTable data={tableData} bordered={false} striped={false} hover className="admin-table" responsive entries={10} entriesOptions={[5, 10, 20, 50]} noBottomColumns />
          )}
        </div>
      </div>

      {selectedOrderId && (
        <OrderDetailPopup
          orderId={selectedOrderId}
          currentUserId={currentUser?._id}
          onClose={() => setSelectedOrderId(null)}
          onOrderUpdated={() => dispatch(adminOrdersAction)}
        />
      )}

      <style>{`
        .ol-page-header-anim{animation:ol-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) both;}
        .ol-table-anim{animation:ol-fade-up 0.4s cubic-bezier(0.22,1,0.36,1) 0.1s both;}
        @keyframes ol-fade-up{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}

        .ol-filter-wrap{display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
        .ol-filter-btn{
          padding:7px 14px;background:transparent;border:1px solid var(--black-4,#2a2a2a);border-radius:6px;
          color:var(--gray-3,#666);font-family:var(--font-body,sans-serif);font-size:0.72rem;font-weight:700;
          letter-spacing:0.07em;text-transform:uppercase;cursor:pointer;
          transition:border-color 0.18s ease,color 0.18s ease,background 0.18s ease,transform 0.15s ease,box-shadow 0.15s ease;
          position:relative;overflow:hidden;
          animation:ol-fade-up 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .ol-filter-btn::before{content:"";position:absolute;inset:0;background:var(--pure-white,#fff);transform:scaleX(0);transform-origin:left;transition:transform 0.22s cubic-bezier(0.22,1,0.36,1);z-index:0;}
        .ol-filter-btn.active::before{transform:scaleX(1);}
        .ol-filter-btn>*{position:relative;z-index:1;}
        .ol-filter-btn:hover:not(.active){border-color:var(--gray-2,#555);color:var(--gray-4,#999);transform:translateY(-1px);}
        .ol-filter-btn.active{border-color:var(--pure-white,#fff);color:var(--black,#000);box-shadow:0 2px 12px rgba(255,255,255,0.12);}

        .ord-id-link{color:var(--gray-4,#999);font-family:var(--font-mono,monospace);font-size:0.78rem;cursor:pointer;transition:color 0.15s ease;position:relative;}
        .ord-id-link::after{content:"";position:absolute;bottom:-2px;left:0;right:0;height:1px;background:var(--gray-3,#555);transform:scaleX(0);transform-origin:left;transition:transform 0.22s ease;}
        .ord-id-link:hover{color:var(--pure-white,#fff);}
        .ord-id-link:hover::after{transform:scaleX(1);}

        .status-pill.processing{background:rgba(240,194,127,.08);color:#f0c27f;border:1px solid rgba(240,194,127,.25);transition:box-shadow 0.2s ease,transform 0.15s ease;}
        .status-pill.processing:hover{box-shadow:0 0 10px rgba(240,194,127,0.2);transform:scale(1.03);}
        .status-pill.shipped{background:rgba(127,179,240,.08);color:#7fb3f0;border:1px solid rgba(127,179,240,.25);transition:box-shadow 0.2s ease,transform 0.15s ease;}
        .status-pill.shipped:hover{box-shadow:0 0 10px rgba(127,179,240,0.2);transform:scale(1.03);}
        .status-pill.active{transition:box-shadow 0.2s ease,transform 0.15s ease;}
        .status-pill.active:hover{box-shadow:0 0 10px rgba(168,230,163,0.15);transform:scale(1.03);}
        .status-pill.disabled{transition:box-shadow 0.2s ease,transform 0.15s ease;}
        .status-pill.disabled:hover{box-shadow:0 0 10px rgba(240,127,127,0.15);transform:scale(1.03);}

        .admin-table tbody tr{animation:ol-row-in 0.3s cubic-bezier(0.22,1,0.36,1) both;}
        .admin-table tbody tr:nth-child(1){animation-delay:0ms;}
        .admin-table tbody tr:nth-child(2){animation-delay:30ms;}
        .admin-table tbody tr:nth-child(3){animation-delay:55ms;}
        .admin-table tbody tr:nth-child(4){animation-delay:80ms;}
        .admin-table tbody tr:nth-child(5){animation-delay:100ms;}
        .admin-table tbody tr:nth-child(6){animation-delay:120ms;}
        .admin-table tbody tr:nth-child(7){animation-delay:140ms;}
        .admin-table tbody tr:nth-child(8){animation-delay:158ms;}
        .admin-table tbody tr:nth-child(9){animation-delay:175ms;}
        .admin-table tbody tr:nth-child(10){animation-delay:190ms;}
        @keyframes ol-row-in{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}

        @media(max-width:640px){.ol-filter-wrap{display:none;}}
      `}</style>
    </div>
  );
}