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

const ORDER_LIST_ENTRIES_KEY = "orderListEntries";

export default function OrderList() {
  const {
    adminOrders = [],
    loading = true,
    error,
    isOrderDeleted,
  } = useSelector((state) => state.orderState);

  const dispatch = useDispatch();

  const [statusFilter, setStatusFilter] = useState("All");

  // Persist entries-per-page selection across navigation
  useEffect(() => {
    const savedEntries = localStorage.getItem(ORDER_LIST_ENTRIES_KEY);
    if (savedEntries) {
      // MDBDataTable renders its own select; we patch it after mount
      const applyEntries = () => {
        const select = document.querySelector(".dataTables_length select");
        if (select) {
          select.value = savedEntries;
          select.dispatchEvent(new Event("change", { bubbles: true }));
        }
      };
      // Retry a few times since table renders asynchronously
      const timers = [100, 300, 600].map((delay) =>
        setTimeout(applyEntries, delay)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [loading]);

  useEffect(() => {
    const handleEntriesChange = () => {
      const select = document.querySelector(".dataTables_length select");
      if (select) {
        const onChange = () => {
          localStorage.setItem(ORDER_LIST_ENTRIES_KEY, select.value);
        };
        select.addEventListener("change", onChange);
        return () => select.removeEventListener("change", onChange);
      }
    };
    if (!loading) {
      const timer = setTimeout(handleEntriesChange, 700);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  const setOrders = () => {
    const data = {
      columns: [
        {
          label: "ID",
          field: "id",
          sort: "asc",
        },
        {
          label: "User Name",
          field: "userName",
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
          order.orderStatus
            .toLowerCase()
            .includes(statusFilter.toLowerCase())
        );

    filteredOrders.forEach((order) => {
      data.rows.push({
        id: order._id,
        userName: order.user?.name || "Guest",
        noOfItems: order.orderItems.length,
        amount: `₹${order.totalPrice}`,
        status: (
          <span
            className={`order-status-badge ${order.orderStatus.includes("Processing")
                ? "status-processing"
                : "status-delivered"
              }`}
          >
            {order.orderStatus}
          </span>
        ),
        actions: (
          <Fragment>
            <Link
              to={`/admin/order/${order._id}`}
              className="btn btn-action-edit"
            >
              <i className="fa fa-pencil"></i>
            </Link>
            {/* <Button
              onClick={(e) => deleteHandler(e, order._id)}
              className="btn btn-action-delete py-1 px-2 ml-2"
            >
              <i className="fa fa-trash"></i>
            </Button> */}
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
        /* ─── Base ─────────────────────────────────────────────── */
        .orderlist-container {
          background-color: #0e0e0e;
          min-height: 100vh;
          padding: 20px;
          color: #e0e0e0;
        }

        /* ─── Page Title ────────────────────────────────────────── */
        .orderlist-heading {
          color: #ffffff;
          font-size: 28px;
          font-weight: 700;
          letter-spacing: 0.5px;
          font-family: 'Yantramanav', sans-serif;
          border-bottom: 1px solid #2a2a2a;
          padding-bottom: 12px;
        }

        /* ─── Status Filter ─────────────────────────────────────── */
        .status-filter {
          width: 200px;
          margin: 16px 0;
          background-color: #1c1c1c;
          border: 1px solid #333333;
          color: #e0e0e0;
          border-radius: 8px;
          padding: 8px 12px;
          font-size: 14px;
          appearance: none;
          -webkit-appearance: none;
          cursor: pointer;
          transition: border-color 0.2s ease;
        }
        .status-filter:focus {
          outline: none;
          border-color: #888888;
          box-shadow: 0 0 0 2px rgba(255,255,255,0.05);
        }
        .status-filter option {
          background-color: #1c1c1c;
          color: #e0e0e0;
        }

        /* ─── Table Wrapper ─────────────────────────────────────── */
        .orderlist-table-wrapper {
          background-color: #141414;
          padding: 24px;
          border-radius: 12px;
          border: 1px solid #222222;
          box-shadow: 0 2px 16px rgba(0, 0, 0, 0.5);
        }

        /* ─── MDB DataTable overrides ───────────────────────────── */

        /* Search input */
        .orderlist-table-wrapper .dataTables_filter input {
          background-color: #1c1c1c !important;
          border: 1px solid #333333 !important;
          color: #e0e0e0 !important;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
        }
        .orderlist-table-wrapper .dataTables_filter label {
          color: #888888 !important;
          font-size: 13px;
        }

        /* Entries-per-page select */
        .orderlist-table-wrapper .dataTables_length select {
          background-color: #1c1c1c !important;
          border: 1px solid #333333 !important;
          color: #e0e0e0 !important;
          border-radius: 6px;
          padding: 4px 8px;
          font-size: 13px;
        }
        .orderlist-table-wrapper .dataTables_length label {
          color: #888888 !important;
          font-size: 13px;
        }

        /* Info text ("Showing 1 to 10...") */
        .orderlist-table-wrapper .dataTables_info {
          color: #666666 !important;
          font-size: 12px;
        }

        /* Pagination */
        .orderlist-table-wrapper .dataTables_paginate .page-link {
          background-color: #1c1c1c !important;
          border-color: #333333 !important;
          color: #cccccc !important;
          font-size: 13px;
          transition: background-color 0.15s ease;
        }
        .orderlist-table-wrapper .dataTables_paginate .page-item.active .page-link {
          background-color: #2e2e2e !important;
          border-color: #555555 !important;
          color: #ffffff !important;
          font-weight: 600;
        }
        .orderlist-table-wrapper .dataTables_paginate .page-link:hover {
          background-color: #252525 !important;
          color: #ffffff !important;
        }

        /* Table */
        .orderlist-table-wrapper table.dataTable {
          border-collapse: collapse !important;
          width: 100% !important;
        }

        /* Header */
        .orderlist-table-wrapper table.dataTable thead th {
          background-color: #1a1a1a !important;
          color: #aaaaaa !important;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          border-bottom: 1px solid #2a2a2a !important;
          border-top: none !important;
          padding: 14px 16px !important;
        }
        .orderlist-table-wrapper table.dataTable thead th:after,
        .orderlist-table-wrapper table.dataTable thead th:before {
          color: #555555 !important;
        }

        /* Rows */
        .orderlist-table-wrapper table.dataTable tbody tr {
          background-color: #141414 !important;
          border-bottom: 1px solid #1e1e1e !important;
          transition: background-color 0.15s ease;
        }
        .orderlist-table-wrapper table.dataTable tbody tr:hover {
          background-color: #1c1c1c !important;
        }
        .orderlist-table-wrapper table.dataTable tbody td {
          color: #d0d0d0 !important;
          font-size: 13px;
          padding: 13px 16px !important;
          vertical-align: middle !important;
          border-top: none !important;
        }

        /* Striped rows (MDB striped prop) */
        .orderlist-table-wrapper table.dataTable tbody tr.odd {
          background-color: #161616 !important;
        }
        .orderlist-table-wrapper table.dataTable tbody tr.even {
          background-color: #141414 !important;
        }

        /* ─── Status Badge ──────────────────────────────────────── */
        .order-status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.3px;
        }
        .status-processing {
          background-color: rgba(255, 255, 255, 0.06);
          color: #ff6b6b;
          border: 1px solid rgba(255, 107, 107, 0.25);
        }
        .status-delivered {
          background-color: rgba(255, 255, 255, 0.06);
          color: #a0a0a0;
          border: 1px solid rgba(160, 160, 160, 0.2);
        }

        /* ─── Action Buttons ────────────────────────────────────── */
        .btn-action-edit {
          background-color: #2a2a2a;
          border: 1px solid #3a3a3a;
          color: #dddddd;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          transition: background-color 0.15s ease, color 0.15s ease;
          text-decoration: none;
        }
        .btn-action-edit:hover {
          background-color: #3a3a3a;
          color: #ffffff;
          border-color: #555555;
        }
        .btn-action-delete {
          background-color: #2a1a1a;
          border: 1px solid #4a2a2a;
          color: #ff6b6b;
          border-radius: 6px;
          padding: 6px 10px;
          font-size: 13px;
          transition: background-color 0.15s ease;
        }
        .btn-action-delete:hover {
          background-color: #3a1a1a;
          color: #ff4444;
        }

        /* ─── Responsive ────────────────────────────────────────── */
        @media screen and (max-width: 768px) {
          .orderlist-heading {
            font-size: 22px;
            text-align: center;
          }
          .orderlist-table-wrapper {
            padding: 12px;
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
        <h1 className="my-4 orderlist-heading">Order List</h1>

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