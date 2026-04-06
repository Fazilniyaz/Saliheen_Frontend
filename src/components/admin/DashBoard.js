import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { useEffect, useState } from "react";
import { getAdminProducts } from "../../actions/productActions";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "./Dashboard.css";

export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.productsState);
  const dispatch = useDispatch();
  const [ordersCount, setOrdersCount] = useState(0);
  const [usersCount, setUsersCount] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [couponsCount, setCouponsCount] = useState(0);
  const [boolean, setBoolean] = useState(false);

  let outOfStock = 0;
  if (products.length > 0) {
    products.forEach((product) => {
      if (product.stock === 0) {
        outOfStock += 1;
      }
    });
  }

  useEffect(() => {
    dispatch(getAdminProducts);
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, usersRes, salesRes, couponsRes] = await Promise.all([
          axios.get(
            "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/getAllOrdersCount",
            { withCredentials: true }
          ),
          axios.get(
            "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/GetCountOfUsers",
            { withCredentials: true }
          ),
          axios.get(
            "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/salesReport?filterBy=yearly",
            { withCredentials: true }
          ),
          axios.get(
            "https://saliheenperfumes-zd2i.onrender.com/api/v1/admin/coupons",
            { withCredentials: true }
          ),
        ]);

        setOrdersCount(ordersRes.data.orderCount);
        setUsersCount(usersRes.data.userCount);
        setTotalSales(salesRes.data.totalAmount);
        setCouponsCount(couponsRes.data.coupons?.length || 0);
        setBoolean(true);
      } catch (err) {
        console.error("Dashboard data fetch failed:", err);
        setBoolean(true);
      }
    };

    fetchData();
  }, []);

  return boolean ? (
    <div className="dashboard-wrapper">
      <SideBar />

      <main className="dashboard-content">
        <div className="container-fluid px-3 px-md-4 py-4">
          {/* Header Section */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="dashboard-header d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center">
                <div className="mb-3 mb-md-0">
                  <h1 className="dashboard-title gold-gradient-text mb-2">
                    <i className="fas fa-chart-line me-2"></i>
                    Dashboard Overview
                  </h1>
                  <p className="text-muted mb-0 d-none d-md-block">
                    Welcome back! Here's what's happening with your store today.
                  </p>
                </div>
                <div className="dashboard-date-badge">
                  <div className="d-flex flex-column align-items-end">
                    <span className="date-value">
                      <i className="fas fa-calendar-alt me-2"></i>
                      {new Date().toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="time-value">
                      <i className="fas fa-clock me-2"></i>
                      {new Date().toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Total Sales - Featured Card */}
          <div className="row mb-4">
            <div className="col-12">
              <div className="featured-card gold-card position-relative overflow-hidden">
                <div className="card-body p-4 p-md-5">
                  <div className="row align-items-center">
                    <div className="col-md-8">
                      <div className="d-flex align-items-center mb-3">
                        <div className="featured-icon-wrapper me-3">
                          <i className="fas fa-dollar-sign"></i>
                        </div>
                        <div>
                          <h5 className="card-subtitle text-gold-muted mb-1">
                            Total Revenue
                          </h5>
                          <h2 className="card-title gold-gradient-text mb-0 fw-bold">
                            Yearly Sales Report
                          </h2>
                        </div>
                      </div>
                      <div className="featured-amount-wrapper">
                        <Link
                          to="/admin/salesReport"
                          className="featured-amount text-decoration-none d-inline-block"
                        >
                          $
                          {(totalSales || 0).toLocaleString("en-US", {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </Link>
                      </div>
                      <p className="text-muted mt-3 mb-0 d-none d-md-block">
                        <i className="fas fa-info-circle me-2"></i>
                        Click to view detailed sales report
                      </p>
                    </div>
                    <div className="col-md-4 d-none d-md-flex justify-content-center">
                      <div className="sales-icon-large">
                        <i className="fas fa-chart-line"></i>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-glow-effect"></div>
              </div>
            </div>
          </div>

          {/* Stats Cards Grid */}
          <div className="row g-3 g-md-4">
            {/* Products */}
            <div className="col-6 col-lg-3">
              <StatsCard
                icon="fas fa-boxes"
                value={products.length}
                label="Total Products"
                link="/admin/products"
                color="primary"
              />
            </div>

            {/* Orders */}
            <div className="col-6 col-lg-3">
              <StatsCard
                icon="fas fa-shopping-bag"
                value={ordersCount}
                label="Total Orders"
                link="/admin/orders"
                color="success"
              />
            </div>

            {/* Users */}
            <div className="col-6 col-lg-3">
              <StatsCard
                icon="fas fa-users"
                value={usersCount}
                label="Total Users"
                link="/admin/users"
                color="info"
              />
            </div>

            {/* Out of Stock */}
            <div className="col-6 col-lg-3">
              <StatsCard
                icon="fas fa-exclamation-triangle"
                value={outOfStock}
                label="Out of Stock"
                link="/admin/products"
                color="warning"
                noLink
              />
            </div>
          </div>

          {/* Coupons & Offers Module */}
          <div className="row mt-4">
            <div className="col-12">
              <div className="quick-actions-card">
                <div className="card-body p-4">
                  <h5 className="mb-4 gold-gradient-text fw-bold">
                    <i className="fas fa-ticket-alt me-2"></i>
                    Coupons &amp; Offers
                  </h5>
                  <div className="row g-3 align-items-center">
                    <div className="col-12 col-md-4">
                      <div className="stats-card stats-card-primary h-100" style={{ cursor: "default" }}>
                        <div className="card-body p-3 p-md-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="stats-icon-wrapper icon-primary me-3">
                              <i className="fas fa-tag"></i>
                            </div>
                            <div>
                              <div className="stats-value gold-gradient-text" style={{ fontSize: "2rem" }}>{couponsCount}</div>
                              <div className="stats-label">Active Coupons</div>
                            </div>
                          </div>
                        </div>
                        <div className="card-shine-effect"></div>
                      </div>
                    </div>
                    <div className="col-12 col-md-8">
                      <div className="row g-3">
                        <div className="col-6">
                          <Link to="/admin/coupon" className="quick-action-btn">
                            <i className="fas fa-plus-circle mb-2"></i>
                            <span>Create Coupon</span>
                          </Link>
                        </div>
                        <div className="col-6">
                          <Link to="/admin/coupon" className="quick-action-btn">
                            <i className="fas fa-list mb-2"></i>
                            <span>View All Coupons</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="row mt-4 d-none d-lg-flex">
            <div className="col-12">
              <div className="quick-actions-card">
                <div className="card-body p-4">
                  <h5 className="mb-4 gold-gradient-text fw-bold">
                    <i className="fas fa-bolt me-2"></i>
                    Quick Actions
                  </h5>
                  <div className="row g-3">
                    <div className="col-md-3">
                      <Link
                        to="/admin/products/create"
                        className="quick-action-btn"
                      >
                        <i className="fas fa-plus-circle mb-2"></i>
                        <span>Add Product</span>
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/orders" className="quick-action-btn">
                        <i className="fas fa-list-alt mb-2"></i>
                        <span>View Orders</span>
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/users" className="quick-action-btn">
                        <i className="fas fa-user-plus mb-2"></i>
                        <span>Manage Users</span>
                      </Link>
                    </div>
                    <div className="col-md-3">
                      <Link to="/admin/categories" className="quick-action-btn">
                        <i className="fas fa-tags mb-2"></i>
                        <span>Categories</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  ) : (
    <div className="loading-wrapper">
      <div className="loading-content">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#d4af37"
          ariaLabel="three-dots-loading"
          visible={true}
        />
        <p className="loading-text mt-3">Loading dashboard...</p>
      </div>
    </div>
  );
}

// Reusable Stats Card Component
function StatsCard({ icon, value, label, link, color, noLink }) {
  const colorClasses = {
    primary: "stats-card-primary",
    success: "stats-card-success",
    info: "stats-card-info",
    warning: "stats-card-warning",
  };

  return (
    <div className={`stats-card ${colorClasses[color] || ""} h-100`}>
      <div className="card-body p-3 p-md-4">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div className={`stats-icon-wrapper icon-${color}`}>
            <i className={icon}></i>
          </div>
          <div className="stats-badge">
            <i className="fas fa-arrow-up me-1"></i>
          </div>
        </div>
        <div className="stats-value gold-gradient-text mb-2">{value}</div>
        <div className="stats-label mb-3">{label}</div>
        {!noLink && (
          <Link to={link} className="stats-link">
            View Details
            <i className="fas fa-arrow-right ms-2"></i>
          </Link>
        )}
        {noLink && (
          <div className="stats-link disabled">
            <i className="fas fa-info-circle me-2"></i>
            Check inventory
          </div>
        )}
      </div>
      <div className="card-shine-effect"></div>
    </div>
  );
}