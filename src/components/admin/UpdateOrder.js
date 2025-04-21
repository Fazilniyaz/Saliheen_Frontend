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

export default function UpdateOrder() {
  const { loading, isOrderUpdated, error, orderDetail } = useSelector(
    (state) => state.orderState
  );

  const {
    orderItems = [],
    shippingInfo = {},
    totalPrice = 0,
    paymentInfo = {},
  } = orderDetail;

  const { user = {} } = useSelector((state) => state.authState);

  const isPaid = paymentInfo.status === "succeeded" ? true : false;
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

  return (
    <div className="row">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <Fragment>
          {/* Printable section */}
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
                src="/public/images/spimhd.png" // Replace with your actual logo path
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

            <h3>
              <b>Order Summary</b>
            </h3>
            <p>
              <b>Order ID:</b> {orderDetail._id}
            </p>

            <br></br>
            <hr></hr>
            <br></br>

            <h4>
              <b>Shipping Information</b>
            </h4>
            <p>
              <b>Name:</b> {user.name}
            </p>
            <p>
              <b>Phone:</b> {shippingInfo.phoneNo}
            </p>
            <p>
              <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
              {shippingInfo.postalCode}, {shippingInfo.state},{" "}
              {shippingInfo.country}
            </p>

            <h4>
              <b>Payment Status</b>
            </h4>
            <p>{isPaid ? "PAID" : "NOT PAID"}</p>
            <br></br>
            <hr></hr>
            <br></br>

            <h4>
              <b>Order Status</b>
            </h4>
            <p>{orderStatus}</p>

            <br></br>
            <hr></hr>
            <br></br>

            <h4>
              <b>Order Items</b>
            </h4>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "15px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    Product
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    Quantity
                  </th>
                  <th
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      backgroundColor: "#f0f0f0",
                    }}
                  >
                    Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item, index) => (
                  <tr key={index}>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "left",
                      }}
                    >
                      {item.name}
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "center",
                      }}
                    >
                      {item.quantity}ml
                    </td>
                    <td
                      style={{
                        border: "1px solid #000",
                        padding: "8px",
                        textAlign: "right",
                      }}
                    >
                      ₹{item.price}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    Total:
                  </td>
                  <td
                    style={{
                      border: "1px solid #000",
                      padding: "8px",
                      textAlign: "right",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{totalPrice}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Visible UI */}
          <div
            className="row d-flex justify-content-around"
            style={{
              padding: "20px",
              backgroundColor: "#000",
              color: "#FFFFFF",
              fontFamily: "Yantramanav",
            }}
          >
            <div className="col-12 col-lg-8 mt-5 order-details">
              <h1 className="my-5">Order # {orderDetail._id}</h1>

              <h4 className="mb-4">Shipping Info</h4>
              <p>
                <b>Name:</b> {user.name}
              </p>
              <p>
                <b>Phone:</b> {shippingInfo.phoneNo}
              </p>
              <p className="mb-4">
                <b>Address:</b> {shippingInfo.address}, {shippingInfo.city},{" "}
                {shippingInfo.postalCode}, {shippingInfo.state},{" "}
                {shippingInfo.country}
              </p>
              <p>
                <b>Amount:</b> ₹{totalPrice}
              </p>

              <hr />

              <h4 className="my-4">Payment</h4>
              <p className={isPaid ? "greenColor" : "redColor"}>
                <b>{isPaid ? "PAID" : "NOT PAID"}</b>
              </p>

              <h4 className="my-4">Order Status:</h4>
              <p
                className={
                  orderStatus.includes("Delivered") ? "greenColor" : "redColor"
                }
              >
                <b>{orderStatus}</b>
              </p>

              <h4 className="my-4">Order Items:</h4>
              <hr />
              <div className="cart-item my-1">
                {orderItems &&
                  orderItems.map((item, index) => (
                    <div className="row my-3" key={index}>
                      <div className="col-4 col-lg-2">
                        <img
                          src={item.image}
                          alt={item.name}
                          height="45"
                          width="65"
                        />
                      </div>
                      <div className="col-5 col-lg-5">
                        <Link
                          style={{ color: "#FFFFF" }}
                          to={`/product/${item.product}`}
                        >
                          {item.name}
                        </Link>
                      </div>
                      <div className="col-4 col-lg-2 mt-4 mt-lg-0">
                        <p>₹{item.price}</p>
                      </div>
                      <div className="col-4 col-lg-3 mt-4 mt-lg-0">
                        <p>{item.quantity} Piece(s)</p>
                      </div>
                    </div>
                  ))}
              </div>
              <hr />
            </div>

            <div className="col-12 col-lg-3 mt-5">
              <h4 className="my-4">Update Order Status</h4>
              <div className="form-group">
                <select
                  value={orderStatus}
                  className="form-control"
                  onChange={(e) => setOrderStatus(e.target.value)}
                  name="status"
                >
                  <option value="Processing">Processing</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Returned">Returned</option>
                </select>
              </div>
              <button
                disabled={loading}
                onClick={submitHandler}
                className="btn btn-primary btn-block mt-3"
              >
                Update Status
              </button>

              <button
                onClick={downloadPDF}
                className="btn btn-warning btn-block mt-3"
              >
                Print PDF
              </button>
            </div>
          </div>
        </Fragment>
      </div>
    </div>
  );
}
