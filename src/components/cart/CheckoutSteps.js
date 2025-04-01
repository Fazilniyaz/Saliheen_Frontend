import { Link } from "react-router-dom";

export default function CheckoutSteps({ shipping, confirmOrder, payment }) {
  return (
    <div
      className="checkout-progress d-flex justify-content-center mt-5"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "2rem",
        flexWrap: "wrap", // Ensures responsiveness
      }}
    >
      {shipping ? (
        <Link to="/shipping" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#a2682a",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Shipping Info
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      ) : (
        <Link to="/shipping" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#444",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Shipping Info
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      )}

      {confirmOrder ? (
        <Link to="/order/confirm" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#a2682a",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Confirm Order
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      ) : (
        <Link to="/order/confirm" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#444",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Confirm Order
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      )}

      {payment ? (
        <Link to="/payment" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#a2682a",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Payment
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #a2682a",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      ) : (
        <Link to="/payment" style={{ textDecoration: "none" }}>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderBottom: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
          <div
            style={{
              color: "#fff",
              backgroundColor: "#444",
              padding: "0.5rem 1rem",
              borderRadius: "5px",
              fontWeight: "bold",
              textAlign: "center",
              margin: "0.5rem 0",
            }}
          >
            Payment
          </div>
          <div
            style={{
              borderLeft: "15px solid transparent",
              borderRight: "15px solid transparent",
              borderTop: "15px solid #444",
              height: "0",
              width: "0",
              margin: "0 auto",
            }}
          ></div>
        </Link>
      )}
    </div>
  );
}
