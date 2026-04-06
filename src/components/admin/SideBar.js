import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { useEffect } from "react";
import "./Dashboard.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname.includes(path);

  // Close mobile concerns on route change are handled natively
  useEffect(() => { }, [location.pathname]);

  return (
    <>
      {/* ── Desktop Sidebar ── */}
      <aside className="sidebar-desktop d-lg-flex flex-column d-none">
        <div className="sidebar-header">
          <div className="logo-wrapper">
            <i className="fas fa-crown"></i>
          </div>
          <div className="brand-name">Saliheen</div>
          <div className="brand-sub">Admin Panel</div>
        </div>

        <nav className="sidebar-nav flex-grow-1">
          <ul>
            <li><span className="nav-section-label">Overview</span></li>

            <li>
              <Link
                to="/admin/dashboard"
                className={`nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
              >
                <i className="fas fa-tachometer-alt"></i>
                <span>Dashboard</span>
              </Link>
            </li>

            <li><span className="nav-section-label">Catalogue</span></li>

            <li>
              <NavDropdown
                title={
                  <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <i className="fa fa-product-hunt"></i>
                    <span>Products</span>
                  </span>
                }
                id="products-dropdown"
                className={`custom-dropdown ${isActive("/admin/products") ? "active" : ""}`}
              >
                <NavDropdown.Item
                  onClick={() => navigate("/admin/products")}
                  className="dropdown-item-custom"
                >
                  <i className="fa fa-shopping-basket me-2"></i>All Products
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => navigate("/admin/products/create")}
                  className="dropdown-item-custom"
                >
                  <i className="fa fa-plus me-2"></i>Create Product
                </NavDropdown.Item>
              </NavDropdown>
            </li>

            <li>
              <Link
                to="/admin/categories"
                className={`nav-link ${isActive("/admin/categories") ? "active" : ""}`}
              >
                <i className="fa fa-tags"></i>
                <span>Categories</span>
              </Link>
            </li>

            <li><span className="nav-section-label">Commerce</span></li>

            <li>
              <Link
                to="/admin/orders"
                className={`nav-link ${isActive("/admin/orders") ? "active" : ""}`}
              >
                <i className="fa fa-shopping-basket"></i>
                <span>Orders</span>
              </Link>
            </li>

            <li>
              <Link
                to="/admin/coupon"
                className={`nav-link ${isActive("/admin/coupon") ? "active" : ""}`}
              >
                <i className="fas fa-ticket-alt"></i>
                <span>Coupons &amp; Offers</span>
              </Link>
            </li>

            <li><span className="nav-section-label">People</span></li>

            <li>
              <Link
                to="/admin/users"
                className={`nav-link ${isActive("/admin/users") ? "active" : ""}`}
              >
                <i className="fa fa-users"></i>
                <span>Users</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* ── Mobile Header ── */}
      <header className="mobile-header d-lg-none">
        <i className="fas fa-crown" style={{ color: "#fff", marginRight: 10 }}></i>
        <span className="mobile-brand">Saliheen Admin</span>
      </header>

      {/* ── Mobile Bottom Nav ── */}
      <nav className="bottom-nav d-lg-none">
        <div className="row g-0" style={{ flex: 1 }}>
          {[
            { to: "/admin/dashboard", icon: "fas fa-tachometer-alt", label: "Home" },
            { to: "/admin/products", icon: "fa fa-product-hunt", label: "Products" },
            { to: "/admin/orders", icon: "fa fa-shopping-basket", label: "Orders" },
            { to: "/admin/users", icon: "fa fa-users", label: "Users" },
            { to: "/admin/categories", icon: "fa fa-tags", label: "Categories" },
            { to: "/admin/coupon", icon: "fas fa-ticket-alt", label: "Coupons" },
          ].map(({ to, icon, label }) => (
            <div key={to} className="col">
              <Link to={to} className={`bottom-nav-item ${isActive(to) ? "active" : ""}`}>
                <i className={icon}></i>
                <span className="nav-label">{label}</span>
              </Link>
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}