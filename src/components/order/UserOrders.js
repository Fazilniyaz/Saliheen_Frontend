import { Fragment, useEffect } from "react";
import MetaData from "../layouts/MetaData";
import { MDBDataTable } from "mdbreact";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { userOrders as userOrdersAction } from "../../actions/orderActions";

export default function UserOrders() {
  const { userOrders = [] } = useSelector((state) => state.orderState);
  const dispatch = useDispatch();

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
        amount: `$${userOrder.totalPrice}`,
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
              backgroundColor: "#a2682a",
              color: "white",
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
          margin: "2rem auto",
          padding: "1rem",
          maxWidth: "90%",
          backgroundColor: "black",
          borderRadius: "10px",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            backgroundImage:
              "repeating-linear-gradient(to right, #a2682a 0%, #be8c3c 8%, #be8c3c 18%, #d3b15f 27%, #faf0a0 35%, #ffffc2 40%, #faf0a0 50%, #d3b15f 58%, #be8c3c 67%, #b17b32 77%, #bb8332 83%, #d4a245 88%, #e1b453 93%, #a4692a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontSize: "2.5rem",
            fontWeight: "bold",
            fontFamily: "Yantramanav",
            filter: "drop-shadow(0 0 1px rgba(255, 200, 0, .3))",
            animation: "MoveBackgroundPosition 6s ease-in-out infinite",
          }}
        >
          My Orders
        </h1>
        <div
          style={{
            overflowX: "auto", // Ensures horizontal scrolling for smaller screens
          }}
        >
          <MDBDataTable
            style={{
              color: "#fff",
              fontFamily: "Yantramanav, sans-serif",
              backgroundColor: "black",
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
