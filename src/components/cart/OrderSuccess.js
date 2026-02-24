import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OrderSuccess() {
  const location = useLocation();
  const orderId = location.state?.orderId;
  const { user } = useSelector((state) => state.authState);

  return (
    <div className="container container-fluid">
      <div className="row justify-content-center">
        <div className="col-6 mt-5 text-center">
          <img
            className="my-5 img-fluid d-block mx-auto"
            src="/images/success.png"
            alt="Order Success"
            width="200"
            height="200"
          />

          <h2>Your Order has been placed successfully.</h2>

          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            {orderId && (
              <Link to={`/order/track/${orderId}`}>Track your order</Link>
            )}
            {user && <Link to="/orders">Go to Orders</Link>}
            <Link to="/">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
