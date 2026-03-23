import { Fragment, useEffect, useState, useRef } from "react";
import Sidebar from "./SideBar";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams, Link } from "react-router-dom";
import {
  updateOrder,
  orderDetail as orderDetailAction,
} from "../../actions/orderActions";
import { clearError, clearOrderUpdated } from "../../slices/orderSlice";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

// Helper to format date
const formatDate = (dateString) => {
  if (!dateString) return "Not Paid Yet";
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

export default function UpdateOrder() {
  const { loading, isOrderUpdated, error, orderDetail } = useSelector(
    (state) => state.orderState
  );

  const {
    orderItems = [],
    shippingInfo = {},
    totalPrice = 0,
    paymentInfo = {},
    paidAt,
  } = orderDetail;

  const { user = {} } = orderDetail;
  const userName = user?.name || "Guest";

  const isPaid = paymentInfo.status === "succeeded" ? true : false;
  const formattedPaidAt = formatDate(paidAt);

  const [orderStatus, setOrderStatus] = useState("Processing");

  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const printRef = useRef();

  const submitHandler = (e) => {
    e.preventDefault();
    const orderData = { orderStatus };
    dispatch(updateOrder(orderId, orderData));
  };

  useEffect(() => {
    if (isOrderUpdated) {
      toast("Order Updated Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearOrderUpdated()),
      });
      return;
    }

    if (error) {
      toast(error, {
        position: "bottom-center",
        type: "error",
        onOpen: () => {
          dispatch(clearError());
        },
      });
      return;
    }

    dispatch(orderDetailAction(orderId));
  }, [isOrderUpdated, error, dispatch, orderId]);

  useEffect(() => {
    if (orderDetail && orderDetail._id) {
      setOrderStatus(orderDetail.orderStatus);
    }
  }, [orderDetail]);

  const downloadPDF = () => {
    const input = printRef.current;
    html2canvas(input, {
      scale: 2,
      backgroundColor: "#ffffff",
      useCORS: true,
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const width = pdf.internal.pageSize.getWidth();
        const height = (canvas.height * width) / canvas.width;
        pdf.addImage(imgData, "PNG", 0, 0, width, height);
        pdf.save(`order_${orderDetail._id}.pdf`);
      })
      .catch((error) => {
        console.error("PDF Generation Error:", error);
        toast("PDF generation failed", { type: "error" });
      });
  };

  // Derive a status color class for visible UI
  const getStatusClass = (status) => {
    if (!status) return "status-processing";
    if (status.includes("Delivered")) return "status-delivered";
    if (status.includes("Shipped")) return "status-shipped";
    if (status.includes("Cancelled") || status.includes("Returned"))
      return "status-cancelled";
    return "status-processing";
  };

  return (
    <div className="row update-order-page">
      <style>{`
        /* ─── Page Shell ─────────────────────────────────────────── */
        .update-order-page {
          background-color: #0e0e0e;
          min-height: 100vh;
          color: #e0e0e0;
          font-family: 'Yantramanav', sans-serif;
        }

        /* ─── Page Title ─────────────────────────────────────────── */
        .uo-page-title {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 1.2px;
          text-transform: uppercase;
          color: #555555;
          margin-bottom: 4px;
        }
        .uo-order-id {
          font-size: 22px;
          font-weight: 700;
          color: #ffffff;
          letter-spacing: 0.3px;
          word-break: break-all;
        }

        /* ─── Cards ──────────────────────────────────────────────── */
        .uo-card {
          background-color: #141414;
          border: 1px solid #222222;
          border-radius: 12px;
          padding: 24px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.4);
        }

        .uo-card-title {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1.4px;
          text-transform: uppercase;
          color: #555555;
          margin-bottom: 18px;
          padding-bottom: 12px;
          border-bottom: 1px solid #1e1e1e;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .uo-card-title i {
          font-size: 12px;
          color: #444444;
        }

        /* ─── Info Rows ──────────────────────────────────────────── */
        .uo-info-row {
          display: flex;
          align-items: flex-start;
          margin-bottom: 12px;
          gap: 10px;
        }
        .uo-info-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: #555555;
          min-width: 72px;
          padding-top: 2px;
          flex-shrink: 0;
        }
        .uo-info-value {
          font-size: 14px;
          color: #cccccc;
          line-height: 1.5;
        }
        .uo-amount-value {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }

        /* ─── Status Badges ──────────────────────────────────────── */
        .uo-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
        }
        .status-delivered {
          background-color: rgba(255,255,255,0.05);
          color: #aaaaaa;
          border: 1px solid rgba(180,180,180,0.2);
        }
        .status-processing {
          background-color: rgba(255,107,107,0.08);
          color: #ff6b6b;
          border: 1px solid rgba(255,107,107,0.2);
        }
        .status-shipped {
          background-color: rgba(100,160,255,0.08);
          color: #7eb8ff;
          border: 1px solid rgba(100,160,255,0.2);
        }
        .status-cancelled {
          background-color: rgba(255,255,255,0.04);
          color: #666666;
          border: 1px solid #2a2a2a;
        }
        .paid-badge {
          background-color: rgba(255,255,255,0.05);
          color: #aaaaaa;
          border: 1px solid rgba(180,180,180,0.2);
        }
        .unpaid-badge {
          background-color: rgba(255,107,107,0.08);
          color: #ff6b6b;
          border: 1px solid rgba(255,107,107,0.2);
        }

        /* ─── Order Items ────────────────────────────────────────── */
        .uo-item-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 0;
          border-bottom: 1px solid #1a1a1a;
          gap: 12px;
        }
        .uo-item-row:last-child {
          border-bottom: none;
        }
        .uo-item-name {
          font-size: 14px;
          color: #cccccc;
          text-decoration: none;
          transition: color 0.15s ease;
          flex: 1;
        }
        .uo-item-name:hover {
          color: #ffffff;
        }
        .uo-item-meta {
          font-size: 12px;
          color: #555555;
          white-space: nowrap;
        }
        .uo-item-price {
          font-size: 14px;
          font-weight: 600;
          color: #aaaaaa;
          white-space: nowrap;
        }

        /* ─── Total Row ──────────────────────────────────────────── */
        .uo-total-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 16px 0 0;
          margin-top: 4px;
          border-top: 1px solid #2a2a2a;
        }
        .uo-total-label {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          color: #555555;
        }
        .uo-total-value {
          font-size: 18px;
          font-weight: 700;
          color: #ffffff;
        }

        /* ─── Update Panel ───────────────────────────────────────── */
        .uo-update-panel {
          background-color: #141414;
          border: 1px solid #222222;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 2px 12px rgba(0,0,0,0.4);
          position: sticky;
          top: 24px;
        }
        .uo-update-panel .uo-card-title {
          margin-bottom: 20px;
        }

        /* ─── Status Select ──────────────────────────────────────── */
        .uo-select {
          width: 100%;
          background-color: #1a1a1a;
          border: 1px solid #2e2e2e;
          color: #e0e0e0;
          border-radius: 8px;
          padding: 10px 14px;
          font-size: 13px;
          font-family: 'Yantramanav', sans-serif;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: border-color 0.15s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='%23666' d='M1 1l5 5 5-5'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 12px center;
          padding-right: 32px;
          margin-bottom: 14px;
        }
        .uo-select:focus {
          outline: none;
          border-color: #555555;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.04);
        }
        .uo-select option {
          background-color: #1a1a1a;
          color: #e0e0e0;
        }

        /* ─── Buttons ────────────────────────────────────────────── */
        .uo-btn-primary {
          width: 100%;
          padding: 11px 16px;
          background-color: #ffffff;
          color: #0e0e0e;
          border: none;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          cursor: pointer;
          transition: background-color 0.15s ease, opacity 0.15s ease;
          margin-bottom: 10px;
          font-family: 'Yantramanav', sans-serif;
        }
        .uo-btn-primary:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        .uo-btn-primary:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .uo-btn-secondary {
          width: 100%;
          padding: 11px 16px;
          background-color: transparent;
          color: #888888;
          border: 1px solid #2e2e2e;
          border-radius: 8px;
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.6px;
          text-transform: uppercase;
          cursor: pointer;
          transition: border-color 0.15s ease, color 0.15s ease;
          font-family: 'Yantramanav', sans-serif;
        }
        .uo-btn-secondary:hover {
          border-color: #555555;
          color: #cccccc;
        }

        /* ─── Divider ────────────────────────────────────────────── */
        .uo-divider {
          border: none;
          border-top: 1px solid #1e1e1e;
          margin: 0 0 20px;
        }

        /* ─── Responsive ─────────────────────────────────────────── */
        @media (max-width: 768px) {
          .uo-order-id {
            font-size: 17px;
          }
          .uo-card {
            padding: 16px;
          }
          .uo-update-panel {
            position: static;
            margin-top: 8px;
          }
          .uo-item-row {
            flex-wrap: wrap;
          }
        }
      `}</style>

      {/* Sidebar column */}
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="col-12 col-md-10" style={{ padding: "28px 24px" }}>
        <Fragment>

          {/* ── Hidden printable section (unchanged) ───────────────── */}
          <div
            ref={printRef}
            style={{
              position: "absolute",
              top: "-9999px",
              left: "-9999px",
              backgroundColor: "#fff",
              color: "#000",
              padding: "30px",
              width: "210mm",
              fontFamily: "Arial, sans-serif",
            }}
          >
            <div style={{ textAlign: "center", marginBottom: "20px" }}>
              <img
                src="./spimhd.png"
                alt="Company Logo"
                style={{ width: "120px", marginBottom: "10px" }}
              />
              <h2 style={{ marginBottom: "0" }}>
                <b>Saliheen Perfumes</b>
              </h2>
              <small>
                <b>saliheenperfumes@gmail.com</b>
              </small>
            </div>
            <hr />
            <h3><b>Order Summary</b></h3>
            <p><b>Order ID:</b> {orderDetail._id}</p>
            <br /><hr /><br />
            <h4><b>Shipping Information</b></h4>
            <p><b>Name:</b> {userName}</p>
            <p><b>Phone:</b> {shippingInfo.phoneNo}</p>
            <p>
              <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
              {shippingInfo.postalCode}, {shippingInfo.state},{" "}
              {shippingInfo.country}
            </p>
            <h4><b>Payment Status</b></h4>
            <p>{isPaid ? "PAID" : "NOT PAID"}</p>
            {isPaid && (
              <p><b>Paid On:</b> {formattedPaidAt}</p>
            )}
            <br /><hr /><br />
            <h4><b>Order Status</b></h4>
            <p>{orderStatus}</p>
            <br /><hr /><br />
            <h4><b>Order Items</b></h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th style={{ border: "1px solid #000", padding: "8px", backgroundColor: "#f0f0f0" }}>Product</th>
                  <th style={{ border: "1px solid #000", padding: "8px", backgroundColor: "#f0f0f0" }}>Quantity</th>
                  <th style={{ border: "1px solid #000", padding: "8px", backgroundColor: "#f0f0f0" }}>Price</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "left" }}>{item.name}</td>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "center" }}>{item.quantity}ml</td>
                    <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right" }}>₹{item.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="2" style={{ border: "1px solid #000", padding: "8px", textAlign: "right", fontWeight: "bold" }}>Total:</td>
                  <td style={{ border: "1px solid #000", padding: "8px", textAlign: "right", fontWeight: "bold" }}>₹{totalPrice}</td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* ── Visible UI ─────────────────────────────────────────── */}

          {/* Page heading */}
          <div style={{ marginBottom: "28px" }}>
            <p className="uo-page-title">Order Detail</p>
            <p className="uo-order-id">#{orderDetail._id}</p>
          </div>

          <div className="row">

            {/* ── Left: order info ───────────────────────────────── */}
            <div className="col-12 col-lg-8">

              {/* Shipping Info card */}
              <div className="uo-card">
                <div className="uo-card-title">
                  <i className="fa fa-map-marker"></i>
                  Shipping Information
                </div>

                <div className="uo-info-row">
                  <span className="uo-info-label">Name</span>
                  <span className="uo-info-value">{userName}</span>
                </div>
                <div className="uo-info-row">
                  <span className="uo-info-label">Phone</span>
                  <span className="uo-info-value">{shippingInfo.phoneNo}</span>
                </div>
                <div className="uo-info-row">
                  <span className="uo-info-label">Address</span>
                  <span className="uo-info-value">
                    {shippingInfo.address}, {shippingInfo.city},{" "}
                    {shippingInfo.postalCode}, {shippingInfo.state},{" "}
                    {shippingInfo.country}
                  </span>
                </div>
                <div className="uo-info-row" style={{ marginTop: "6px" }}>
                  <span className="uo-info-label">Amount</span>
                  <span className="uo-amount-value">₹{totalPrice}</span>
                </div>
              </div>

              {/* Payment & Status card */}
              <div className="uo-card">
                <div className="uo-card-title">
                  <i className="fa fa-credit-card"></i>
                  Payment &amp; Status
                </div>

                <div className="uo-info-row">
                  <span className="uo-info-label">Payment</span>
                  <span className={`uo-badge ${isPaid ? "paid-badge" : "unpaid-badge"}`}>
                    {isPaid ? "Paid" : "Not Paid"}
                  </span>
                </div>
                {isPaid && (
                  <div className="uo-info-row">
                    <span className="uo-info-label">Paid On</span>
                    <span className="uo-info-value">{formattedPaidAt}</span>
                  </div>
                )}
                <div className="uo-info-row" style={{ marginTop: "4px" }}>
                  <span className="uo-info-label">Status</span>
                  <span className={`uo-badge ${getStatusClass(orderStatus)}`}>
                    {orderStatus}
                  </span>
                </div>
              </div>

              {/* Order Items card */}
              <div className="uo-card">
                <div className="uo-card-title">
                  <i className="fa fa-shopping-basket"></i>
                  Order Items
                </div>

                {orderItems && orderItems.map((item, index) => (
                  <div className="uo-item-row" key={index}>
                    <Link
                      to={`/product/${item.product}`}
                      className="uo-item-name"
                    >
                      {item.name}
                    </Link>
                    <span className="uo-item-meta">
                      {item.quantity}ml &nbsp;·&nbsp; {item.noOfBottles} {item.noOfBottles === 1 ? "Bottle" : "Bottles"}
                    </span>
                    <span className="uo-item-price">
                      ₹{item.pricePerBottle} / bottle
                    </span>
                  </div>
                ))}

                <div className="uo-total-row">
                  <span className="uo-total-label">Order Total</span>
                  <span className="uo-total-value">₹{totalPrice}</span>
                </div>
              </div>

            </div>

            {/* ── Right: update panel ────────────────────────────── */}
            <div className="col-12 col-lg-4">
              <div className="uo-update-panel">
                <div className="uo-card-title">
                  <i className="fa fa-pencil"></i>
                  Update Order Status
                </div>

                <select
                  value={orderStatus}
                  className="uo-select"
                  onChange={(e) => setOrderStatus(e.target.value)}
                  name="status"
                >
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>

                <button
                  disabled={loading}
                  onClick={submitHandler}
                  className="uo-btn-primary"
                >
                  {loading ? "Updating..." : "Update Status"}
                </button>

                <button
                  onClick={downloadPDF}
                  className="uo-btn-secondary"
                >
                  <i className="fa fa-download" style={{ marginRight: "8px" }}></i>
                  Print PDF
                </button>
              </div>
            </div>

          </div>
        </Fragment>
      </div>
    </div>
  );
}