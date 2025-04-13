import { useEffect, Fragment, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import Loader from "../../components/layouts/Loader";
import { MDBDataTable } from "mdbreact";
import Sidebar from "./SideBar";
import {
  deleteOrder,
  adminOrders as adminOrdersAction,
} from "../../actions/orderActions";
import { clearError, clearOrderDeleted } from "../../slices/orderSlice";

export default function OrderList() {
  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState("All");

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "Number of Items",
          field: "noOfItems",
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

    const filteredOrders =
      statusFilter === "All"
        ? adminOrders
        : adminOrders.filter((order) =>
            order.orderStatus.toLowerCase().includes(statusFilter.toLowerCase())
          );

    filteredOrders.forEach((order) => {
      data.rows.push({
        id: order._id,
        noOfItems: order.orderItems.length,
        amount: `$${order.totalPrice}`,
        status: (
          <p
            style={{
              color: order.orderStatus.includes("Processing")
                ? "red"
                : "#00ff88",
              fontWeight: "bold",
            }}
          >
            {order.orderStatus}
          </p>
        ),
        actions: (
          <Fragment>
            <Link to={`/admin/order/${order._id}`} className="btn btn-primary">
              <i className="fa fa-pencil"></i>
            </Link>
            <Button
              onClick={(e) => deleteHandler(e, order._id)}
              className="btn btn-danger py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button>
          </Fragment>
        ),
      });
    });

    return data;
  };

  const deleteHandler = (e, id) => {
    e.target.disabled = true;
    dispatch(deleteOrder(id));
  };

  useEffect(() => {
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

    if (isOrderDeleted) {
      toast("Order Deleted Successfully!", {
        type: "success",
        position: "bottom-center",
        onOpen: () => dispatch(clearOrderDeleted()),
      });
      return;
    }

    dispatch(adminOrdersAction);
  }, [dispatch, error, isOrderDeleted]);

  return (
    <div className="row orderlist-container">
      <style>{`
        .orderlist-container {
          background-color: #0e0e0e;
          min-height: 100vh;
          padding: 20px;
          color: #ffffff;
        }

        .orderlist-heading {
          background-image: repeating-linear-gradient(
            to right,
            #a2682a 0%,
            #be8c3c 8%,
            #be8c3c 18%,
            #d3b15f 27%,
            #faf0a0 35%,
            #ffffc2 40%,
            #faf0a0 50%,
            #d3b15f 58%,
            #be8c3c 67%,
            #b17b32 77%,
            #bb8332 83%,
            #d4a245 88%,
            #e1b453 93%,
            #a4692a 100%
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-size: 32px;
          font-weight: bold;
          font-family: 'Yantramanav', sans-serif;
          filter: drop-shadow(0 0 1px rgba(255, 200, 0, 0.3));
          animation: MoveBackgroundPosition 6s ease-in-out infinite;
        }

        @keyframes MoveBackgroundPosition {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        .orderlist-table-wrapper {
          background-color: #1c1c1c;
          padding: 20px;
          border-radius: 12px;
          box-shadow: 0 0 10px rgba(255, 215, 0, 0.2);
        }

        .orderlist-table-wrapper .table td,
        .orderlist-table-wrapper .table th {
          color: #ffffff;
          vertical-align: middle;
        }

        .btn-primary {
          background-color: #ffc107;
          border: none;
        }

        .btn-primary:hover {
          background-color: #ffb300;
        }

        .btn-danger {
          background-color: #ff4c4c;
          border: none;
        }

        .btn-danger:hover {
          background-color: #ff0000;
        }

        .status-filter {
          width: 200px;
          margin: 20px 0;
        }

        @media screen and (max-width: 768px) {
          .orderlist-heading {
            font-size: 24px;
            text-align: center;
          }

          .orderlist-table-wrapper {
            padding: 10px;
          }

          .status-filter {
            width: 100%;
          }
        }
      `}</style>

      <div className="col-12 col-md-2">
        <Sidebar />
      </div>

      <div className="col-12 col-md-10">
        <h1 className="my-4 text-center orderlist-heading">Order List</h1>

        <div className="d-flex justify-content-end">
          <Form.Control
            as="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="status-filter"
          >
            <option value="All">All Orders</option>
            <option value="Processing">Processing</option>
            <option value="Delivered">Delivered</option>
          </Form.Control>
        </div>

        <Fragment>
          {loading ? (
            <Loader />
          ) : (
            <div className="orderlist-table-wrapper">
              <MDBDataTable
                data={setOrders()}
                bordered
                striped
                hover
                responsive
              />
            </div>
          )}
        </Fragment>
      </div>
    </div>
  );
}
