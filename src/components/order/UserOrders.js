import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userOrders as userOrdersAction } from "../../actions/orderActions";

export default function UserOrders() {
  const { userOrders = [] } = useSelector((state) => state.orderState);
  const dispatch = useDispatch();
  console.log("userOrders", userOrders);

  useEffect(() => {
    dispatch(userOrdersAction);
  }, []);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "Order ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "numOfItems",
          sort: "asc",
        },
        {
          label: "Amount",
          field: "amount",
          sort: "asc",
        },
        {
          label: "Status",
          field: "status",
          sort: "asc",
        },
        {
          label: "Actions",
          field: "actions",
          sort: "asc",
        },
      ],
      rows: [],
    };

    userOrders.forEach((userOrder) => {
      data.rows.push({
        id: userOrder._id,
        numOfItems: userOrder.orderItems.length,
        amount: `₹${userOrder.totalPrice}`,
        status:
          userOrder.orderStatus &&
          userOrder.orderStatus.includes("Delivered") ? (
            <p style={{ color: "green", fontWeight: "bold" }}>
              {userOrder.orderStatus}
            </p>
          ) : (
            <p style={{ color: "red", fontWeight: "bold" }}>
              {userOrder.orderStatus}
            </p>
          ),
        actions: (
          <Link
            to={`/order/${userOrder._id}`}
            style={{
              backgroundColor: "#1a1a1a",
              color: "#fff",
              fontWeight: "bold",
              padding: "0.4rem 0.8rem",
              borderRadius: "5px",
              textDecoration: "none",
              display: "inline-block",
              textAlign: "center",
            }}
          >
            <i className="fa fa-eye"></i>
          </Link>
        ),
      });
    });

    return data;
  };

  return (
    <Fragment>
      <MetaData title={"My Orders"} />
      <div
        style={{
          margin: "1.5rem auto",
          padding: "1.25rem",
          maxWidth: "90%",
          backgroundColor: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 2px 12px rgba(0, 0, 0, 0.06)",
          border: "1px solid #e5e5e5",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontSize: "2rem",
            fontWeight: "600",
            color: "#111111",
            fontFamily: "Yantramanav",
            marginBottom: "1rem",
          }}
        >
          My Orders
        </h1>
        <div
          style={{
            overflowX: "auto",
          }}
        >
          <MDBDataTable
            style={{
              color: "#111111",
              fontFamily: "Yantramanav, sans-serif",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              padding: "1rem",
            }}
            bordered
            striped
            hover
            data={setOrders()}
          />
        </div>
      </div>
      <style>
        {`
          @media (max-width: 768px) {
            h1 {
              font-size: 1.8rem; /* Adjust heading size for smaller screens */
            }
            .btn {
              padding: 0.3rem 0.6rem; /* Adjust button padding */
              font-size: 0.9rem; /* Adjust button font size */
            }
          }

          @media (max-width: 576px) {
            h1 {
              font-size: 1.5rem; /* Further reduce heading size */
            }
            .btn {
              padding: 0.2rem 0.5rem; /* Further adjust button padding */
              font-size: 0.8rem; /* Further adjust button font size */
            }
          }
        `}
      </style>
    </Fragment>
  );
}
