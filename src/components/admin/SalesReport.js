import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./SideBar";

export default function SalesReport() {
  const [orders, setOrders] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [filter, setFilter] = useState("monthly"); // Default filter
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    async function fetchSalesReport() {
      try {
        let url = `/api/v1/admin/salesReport?filterBy=${filter}`;

        if (filter === "custom" && startDate && endDate) {
          url += `&startDate=${startDate}&endDate=${endDate}`;
        }

        const { data } = await axios.get(url);
        setOrders(data.orders);
        setTotalSales(data.totalAmount);
      } catch (error) {
        console.error("Error fetching sales report:", error);
      }
    }
    fetchSalesReport();
  }, [filter, startDate, endDate]);

  return (
    <div className="row sales-page">
      <div className="col-12 col-md-2">
        <Sidebar />
      </div>
      <div className="col-12 col-md-10">
        <div className="sales-report-container">
          <h1 className="headings">📊 Sales Report</h1>
          <div className="filters">
            {["daily", "weekly", "monthly", "yearly", "all", "custom"].map(
              (type) => (
                <button
                  key={type}
                  className={filter === type ? "active" : ""}
                  onClick={() => setFilter(type)}
                >
                  {type.charAt(0).toUpperCase() + type.slice(1)}
                </button>
              )
            )}
          </div>

          {/* Custom Date Filter Inputs */}
          {filter === "custom" && (
            <div className="custom-date-filters">
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          <h2 className="total-sales">
            Total Sales: <span>${totalSales}</span>
          </h2>

          <div className="table-container">
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Product Name</th>
                  <th>Quantity</th>
                  <th>Total Price</th>
                  <th>Delivered At</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.orderItems[0].name}</td>
                    <td>{order.orderItems[0].quantity}</td>
                    <td>${order.totalPrice.toFixed(2)}</td>
                    <td>
                      {new Date(order.deliveredAt).toLocaleString() ===
                      "Invalid Date"
                        ? "Not delivered"
                        : new Date(order.deliveredAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Internal CSS Styling */}
      <style jsx>{`
        .sales-page {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          min-height: 100vh;
          color: #f8fafc;
        }

        .sales-report-container {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
          text-align: center;
        }

        .headings {
          font-size: 28px;
          margin-bottom: 20px;
          color: #facc15;
        }

        .filters {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .filters button {
          background: linear-gradient(135deg, #4f46e5, #9333ea);
          color: white;
          border: none;
          padding: 10px 15px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: bold;
          transition: all 0.3s ease-in-out;
        }

        .filters button:hover,
        .filters .active {
          background: #facc15;
          color: #1e293b;
          transform: scale(1.1);
        }

        .custom-date-filters {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 20px;
        }

        .custom-date-filters input {
          padding: 10px;
          font-size: 16px;
          border: 2px solid #facc15;
          border-radius: 8px;
          background: transparent;
          color: white;
          outline: none;
        }

        .total-sales {
          font-size: 22px;
          font-weight: bold;
          margin: 20px 0;
        }

        .total-sales span {
          color: #facc15;
          font-size: 26px;
        }

        .table-container {
          overflow-x: auto;
        }

        .sales-table {
          width: 100%;
          border-collapse: collapse;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          overflow: hidden;
        }

        .sales-table th,
        .sales-table td {
          padding: 12px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.3);
          text-align: center;
        }

        .sales-table th {
          background: rgba(255, 255, 255, 0.2);
          color: #facc15;
          font-size: 16px;
        }

        .sales-table tbody tr:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .sales-report-container {
            padding: 15px;
          }

          .filters {
            gap: 5px;
          }

          .filters button {
            padding: 8px;
            font-size: 14px;
          }

          .custom-date-filters {
            flex-direction: column;
          }

          .custom-date-filters input {
            width: 100%;
          }

          .sales-table th,
          .sales-table td {
            font-size: 14px;
            padding: 8px;
          }
        }
      `}</style>
    </div>
  );
}
