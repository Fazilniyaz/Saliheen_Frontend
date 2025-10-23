import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import { getAdminProducts } from "../../actions/productActions";
import axios from "axios";
import Loader from "../layouts/Loader";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.productsState);
  const dispatch = useDispatch();
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [boolean, setBoolean] = useState(false);

  let outOfStock = 0;

  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock = outOfStock + 1;
      }
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts);
  }, []);

  useEffect(() => {
    async function getOrdersCount() {
      const { data } = await axios.get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/getAllOrdersCount`,
        { withCredentials: true }
      );
      setOrdersCount(data.orderCount);
      setBoolean(true);
    }
    getOrdersCount();

    async function getUsersCount() {
      const { data } = await axios.get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/GetCountOfUsers`,
        { withCredentials: true }
      );
      setUsersCount(data.userCount);
      setBoolean(true);
    }
    getUsersCount();

    async function getTotalSales() {
      const { data } = await axios.get(
        `https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/salesReport?filterBy=yearly`,
        { withCredentials: true }
      );
      setTotalSales(data.totalAmount);
      setBoolean(true);
    }
    getTotalSales();
  }, [boolean]);

  return boolean ? (
    <div
      className="container-fluid admin-dashboard"
      style={{ padding: 0, margin: 0 }}
    >
      <div className="row g-0" style={{ margin: 0 }}>
        {/* Sidebar Column */}
        <div className="col-12 col-md-3 col-lg-2" style={{ padding: 0 }}>
          <SideBar />
        </div>

        {/* Main Content Column - Full Width */}
        <div
          className="col-12 col-md-9 col-lg-10 dashboard-main"
          style={{ padding: "20px", minHeight: "100vh" }}
        >
          {/* Dashboard Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h1 className="gold-gradient-text mb-0">Dashboard</h1>
            <div className="dashboard-date">
              <span className="text-gold">
                {new Date().toLocaleDateString()}
              </span>
              <span className="text-gold ms-3">
                {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>

          {/* Total Sales Card - Full Width */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="gold-card h-100">
                <div className="card-body text-center py-4">
                  <i className="fas fa-dollar-sign stats-icon-large text-gold mb-3"></i>
                  <div className="card-title-gold mb-2">Total Amount</div>
                  <Link
                    to="/admin/salesReport"
                    className="gold-amount text-decoration-none"
                  >
                    <b>${totalSales?.toLocaleString() || 0}</b>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="row g-3">
            {/* Products Card */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stats-card products-card h-100">
                <div className="card-body text-center py-4">
                  <i className="fas fa-boxes stats-icon text-gold mb-3"></i>
                  <div className="stats-value gold-gradient-text">
                    {products.length}
                  </div>
                  <div className="stats-label text-light mb-3">Products</div>
                  <Link
                    className="card-footer-btn w-100 text-decoration-none d-flex justify-content-between align-items-center py-2 px-3"
                    to="/admin/products"
                  >
                    <span className="text-gold">View Details</span>
                    <span className="text-gold">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stats-card orders-card h-100">
                <div className="card-body text-center py-4">
                  <i className="fas fa-shopping-bag stats-icon text-gold mb-3"></i>
                  <div className="stats-value gold-gradient-text">
                    {ordersCount}
                  </div>
                  <div className="stats-label text-light mb-3">Orders</div>
                  <Link
                    className="card-footer-btn w-100 text-decoration-none d-flex justify-content-between align-items-center py-2 px-3"
                    to="/admin/orders"
                  >
                    <span className="text-gold">View Details</span>
                    <span className="text-gold">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stats-card users-card h-100">
                <div className="card-body text-center py-4">
                  <i className="fas fa-users stats-icon text-gold mb-3"></i>
                  <div className="stats-value gold-gradient-text">
                    {usersCount}
                  </div>
                  <div className="stats-label text-light mb-3">Users</div>
                  <Link
                    className="card-footer-btn w-100 text-decoration-none d-flex justify-content-between align-items-center py-2 px-3"
                    to="/admin/users"
                  >
                    <span className="text-gold">View Details</span>
                    <span className="text-gold">
                      <i className="fas fa-arrow-right"></i>
                    </span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Out of Stock Card */}
            <div className="col-12 col-sm-6 col-xl-3">
              <div className="stats-card stock-card h-100">
                <div className="card-body text-center py-4">
                  <i className="fas fa-exclamation-triangle stats-icon text-gold mb-3"></i>
                  <div className="stats-value gold-gradient-text">
                    {outOfStock}
                  </div>
                  <div className="stats-label text-light">Out of Stock</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .admin-dashboard {
          background: linear-gradient(
            135deg,
            #0c0c0c 0%,
            #1a1a1a 50%,
            #0c0c0c 100%
          );
          min-height: 100vh;
          color: white;
          font-family: "Yantramanav", sans-serif;
        }

        .dashboard-main {
          background: transparent;
          width: 100%;
        }

        .gold-gradient-text {
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
          background-size: 200% auto;
          font-weight: bold;
          filter: drop-shadow(0 0 2px rgba(255, 200, 0, 0.5));
          animation: MoveBackgroundPosition 6s ease-in-out infinite;
        }

        @keyframes MoveBackgroundPosition {
          0% {
            background-position: 0% center;
          }
          50% {
            background-position: 100% center;
          }
          100% {
            background-position: 0% center;
          }
        }

        .text-gold {
          color: #d4af37 !important;
        }

        .gold-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid #d4af37;
          border-radius: 15px;
          box-shadow: 0 8px 32px rgba(212, 175, 55, 0.2);
          position: relative;
          overflow: hidden;
        }

        .gold-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(
            90deg,
            #a2682a,
            #be8c3c,
            #d3b15f,
            #faf0a0,
            #d3b15f,
            #be8c3c,
            #a2682a
          );
        }

        .card-title-gold {
          font-size: 1.5rem;
          color: #d4af37;
          font-weight: 600;
          margin-bottom: 1rem;
        }

        .gold-amount {
          font-size: 3rem;
          background-image: repeating-linear-gradient(
            to right,
            #a2682a,
            #be8c3c,
            #d3b15f,
            #faf0a0,
            #d3b15f,
            #be8c3c,
            #a2682a
          );
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          text-decoration: none;
          font-weight: bold;
          display: block;
        }

        .stats-card {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid #333;
          border-radius: 12px;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
          height: 100%;
        }

        .stats-card::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(
            90deg,
            #a2682a,
            #be8c3c,
            #d3b15f,
            #faf0a0,
            #d3b15f,
            #be8c3c,
            #a2682a
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .stats-card:hover {
          transform: translateY(-5px);
          border-color: #d4af37;
          box-shadow: 0 10px 30px rgba(212, 175, 55, 0.3);
        }

        .stats-card:hover::before {
          opacity: 1;
        }

        .stats-icon {
          font-size: 2.5rem;
          margin-bottom: 1rem;
        }

        .stats-icon-large {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .stats-value {
          font-size: 2.5rem;
          font-weight: bold;
          margin: 1rem 0;
          line-height: 1;
        }

        .stats-label {
          font-size: 1.1rem;
          color: #ccc;
          font-weight: 500;
          margin-bottom: 1.5rem;
        }

        .card-footer-btn {
          background: rgba(212, 175, 55, 0.1);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 8px;
          transition: all 0.3s ease;
          margin-top: auto;
        }

        .card-footer-btn:hover {
          background: rgba(212, 175, 55, 0.2);
          transform: translateY(-2px);
        }

        .dashboard-date {
          font-size: 0.9rem;
          color: #d4af37;
        }

        /* Mobile Responsive */
        @media (max-width: 768px) {
          .dashboard-main {
            padding: 15px;
          }

          .gold-amount {
            font-size: 2.2rem;
          }

          .stats-value {
            font-size: 2rem;
          }

          .stats-icon {
            font-size: 2rem;
          }

          .stats-icon-large {
            font-size: 2.5rem;
          }
        }

        @media (max-width: 576px) {
          .gold-amount {
            font-size: 1.8rem;
          }

          .stats-value {
            font-size: 1.8rem;
          }
        }
      `}</style>
    </div>
  ) : (
    <Loader />
  );
}
