import { useDispatch, useSelector } from "react-redux";
import SideBar from "./SideBar";
import { useEffect, useState, useMemo } from "react";
import { getAdminProducts } from "../../actions/productActions";
import axios from "axios";
import { Link } from "react-router-dom";
import { ThreeDots } from "react-loader-spinner";
import "./Dashboard.css";

const API = "https://saliheenperfumes-zd2i.onrender.com/api/v1";

export default function Dashboard() {
  const { products = [] } = useSelector((state) => state.productsState);
  const dispatch = useDispatch();
  const [stats, setStats] = useState({ orders: 0, users: 0, sales: 0, coupons: 0 });
  const [ready, setReady] = useState(false);

  const outOfStock = useMemo(
    () => products.filter((p) => p.stock === 0).length,
    [products]
  );

  useEffect(() => { dispatch(getAdminProducts); }, [dispatch]);

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const [ordersRes, usersRes, salesRes, couponsRes] = await Promise.all([
          axios.get(`${API}/admin/getAllOrdersCount`, { withCredentials: true, signal }),
          axios.get(`${API}/admin/GetCountOfUsers`, { withCredentials: true, signal }),
          axios.get(`${API}/admin/salesReport?filterBy=yearly`, { withCredentials: true, signal }),
          axios.get(`${API}/admin/coupons`, { withCredentials: true, signal }),
        ]);
        setStats({
          orders: ordersRes.data.orderCount,
          users: usersRes.data.userCount,
          sales: salesRes.data.totalAmount || 0,
          coupons: Array.isArray(couponsRes.data.coupons)
            ? couponsRes.data.coupons.length
            : (couponsRes.data.count || 0),
        });
      } catch (err) {
        if (!axios.isCancel(err)) console.error("Dashboard fetch error:", err);
      } finally {
        setReady(true);
      }
    })();

    return () => controller.abort();
  }, []);

  const now = new Date();
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

  if (!ready) {
    return (
      <div className="loading-wrapper">
        <ThreeDots height="48" width="48" radius="6" color="#ffffff" ariaLabel="loading" visible />
        <p className="loading-text">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      <SideBar />

      <main className="dashboard-content">
        {/* ── Page Header ── */}
        <div className="page-header">
          <div>
            <h1 className="page-title">
              <i className="fas fa-chart-line"></i>
              Dashboard
            </h1>
            <p className="page-subtitle">Store overview · Saliheen Perfumes</p>
          </div>
          <div className="date-chip">
            <strong>{dateStr}</strong>
            <span>{timeStr}</span>
          </div>
        </div>

        {/* ── Revenue Hero ── */}
        <div className="revenue-hero">
          <div>
            <div className="revenue-label">
              <i className="fas fa-dollar-sign" style={{ marginRight: 6 }}></i>
              Yearly Sales Report
            </div>
            <Link to="/admin/salesReport" className="revenue-amount">
              ${stats.sales.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Link>
            <p className="revenue-sub">Click to view detailed breakdown →</p>
          </div>
          <div className="revenue-badge">View Report</div>
        </div>

        {/* ── Stat Grid ── */}
        <div className="stats-grid">
          <StatCell
            icon="fas fa-boxes"
            value={products.length}
            label="Products"
            link="/admin/products"
            dot="ok"
          />
          <StatCell
            icon="fas fa-shopping-bag"
            value={stats.orders}
            label="Orders"
            link="/admin/orders"
            dot="ok"
          />
          <StatCell
            icon="fas fa-users"
            value={stats.users}
            label="Users"
            link="/admin/users"
            dot="ok"
          />
          <StatCell
            icon="fas fa-exclamation-triangle"
            value={outOfStock}
            label="Out of Stock"
            dot={outOfStock > 0 ? "warn" : "ok"}
            noLink
          />
        </div>

        {/* ── Coupons Module ── */}
        <div className="module-card">
          <div className="module-header">
            <i className="fas fa-ticket-alt"></i>
            <span className="module-title">Coupons &amp; Offers</span>
          </div>
          <div className="module-body">
            <div className="coupon-count-display">
              <div className="big-num">{stats.coupons}</div>
              <div className="count-label">Active<br />Coupons</div>
            </div>
            <div className="actions-grid" style={{ gridTemplateColumns: "repeat(2,1fr)" }}>
              <Link to="/admin/coupon" className="action-btn">
                <i className="fas fa-plus-circle"></i>
                Create Coupon
              </Link>
              <Link to="/admin/coupon" className="action-btn">
                <i className="fas fa-list"></i>
                View All
              </Link>
            </div>
          </div>
        </div>

        {/* ── Quick Actions (desktop) ── */}
        <div className="module-card d-lg-block d-none">
          <div className="module-header">
            <i className="fas fa-bolt"></i>
            <span className="module-title">Quick Actions</span>
          </div>
          <div className="module-body">
            <div className="actions-grid">
              <Link to="/admin/products/create" className="action-btn">
                <i className="fas fa-plus-circle"></i>Add Product
              </Link>
              <Link to="/admin/orders" className="action-btn">
                <i className="fas fa-list-alt"></i>View Orders
              </Link>
              <Link to="/admin/users" className="action-btn">
                <i className="fas fa-user-plus"></i>Manage Users
              </Link>
              <Link to="/admin/categories" className="action-btn">
                <i className="fas fa-tags"></i>Categories
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatCell({ icon, value, label, link, dot, noLink }) {
  const inner = (
    <>
      <div className="stat-icon-row">
        <div className="stat-icon"><i className={icon}></i></div>
        <div className={`stat-dot ${dot || ""}`}></div>
      </div>
      <div className="stat-value">{value}</div>
      <div className="stat-label">{label}</div>
      {!noLink && (
        <span className="stat-link">View <i className="fas fa-arrow-right"></i></span>
      )}
    </>
  );

  return noLink ? (
    <div className="stat-cell">{inner}</div>
  ) : (
    <Link to={link} className="stat-cell" style={{ textDecoration: "none" }}>{inner}</Link>
  );
}