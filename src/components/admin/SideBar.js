import { Link, useNavigate, useLocation } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { useState, useEffect } from "react";
import "./Sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const isActive = (path) => {
    return location.pathname.includes(path);
  };

  useEffect(() => {
    const handleRouteChange = () => {
      if (isMobileMenuOpen) setIsMobileMenuOpen(false);
    };
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="sidebar-desktop d-none d-lg-flex flex-column">
        {/* Sidebar Header */}
        <div className="sidebar-header text-center py-4 border-bottom border-dark">
          <div className="logo-wrapper mb-3">
            <i className="fas fa-crown fs-1 text-gold glow-icon"></i>
          </div>
          <h4 className="brand-text gold-gradient-text fw-bold mb-1">
            Saliheen Perfumes
          </h4>
          <p className="brand-subtitle text-gold-muted mb-0">Admin Panel</p>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav flex-grow-1 py-3">
          <ul className="list-unstyled px-2">
            {/* Dashboard */}
            <li className="nav-item mb-2">
              <Link
                to="/admin/dashboard"
                className={`nav-link d-flex align-items-center px-3 py-3 rounded-3 ${isActive("/admin/dashboard") ? "active" : ""
                  }`}
              >
                <i className="fas fa-tachometer-alt me-3 fs-5"></i>
                <span className="fw-semibold">Dashboard</span>
              </Link>
            </li>

            {/* Products Dropdown */}
            <li className="nav-item mb-2">
              <NavDropdown
                title={
                  <div className="d-flex align-items-center w-100">
                    <i className="fa fa-product-hunt me-3 fs-5"></i>
                    <span className="fw-semibold">Products</span>
                  </div>
                }
                id="products-dropdown"
                className={`custom-dropdown ${isActive("/admin/products") ? "active" : ""
                  }`}
              >
                <NavDropdown.Item
                  onClick={() => navigate("/admin/products")}
                  className="dropdown-item-custom"
                >
                  <i className="fa fa-shopping-basket me-2"></i>
                  All Products
                </NavDropdown.Item>
                <NavDropdown.Item
                  onClick={() => navigate("/admin/products/create")}
                  className="dropdown-item-custom"
                >
                  <i className="fa fa-plus me-2"></i>
                  Create Product
                </NavDropdown.Item>
              </NavDropdown>
            </li>

            {/* Orders */}
            <li className="nav-item mb-2">
              <Link
                to="/admin/orders"
                className={`nav-link d-flex align-items-center px-3 py-3 rounded-3 ${isActive("/admin/orders") ? "active" : ""
                  }`}
              >
                <i className="fa fa-shopping-basket me-3 fs-5"></i>
                <span className="fw-semibold">Orders</span>
              </Link>
            </li>

            {/* Users */}
            <li className="nav-item mb-2">
              <Link
                to="/admin/users"
                className={`nav-link d-flex align-items-center px-3 py-3 rounded-3 ${isActive("/admin/users") ? "active" : ""
                  }`}
              >
                <i className="fa fa-users me-3 fs-5"></i>
                <span className="fw-semibold">Users</span>
              </Link>
            </li>

            {/* Categories */}
            <li className="nav-item mb-2">
              <Link
                to="/admin/categories"
                className={`nav-link d-flex align-items-center px-3 py-3 rounded-3 ${isActive("/admin/categories") ? "active" : ""
                  }`}
              >
                <i className="fa fa-tags me-3 fs-5"></i>
                <span className="fw-semibold">Categories</span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Mobile Bottom Navigation (Instagram Style) */}
      <nav className="bottom-nav d-lg-none">
        <div className="container-fluid">
          <div className="row g-0">
            {/* Dashboard */}
            <div className="col">
              <Link
                to="/admin/dashboard"
                className={`bottom-nav-item ${isActive("/admin/dashboard") ? "active" : ""
                  }`}
              >
                <i className="fas fa-tachometer-alt fs-5"></i>
                <span className="nav-label">Dashboard</span>
              </Link>
            </div>

            {/* Products */}
            <div className="col">
              <Link
                to="/admin/products"
                className={`bottom-nav-item ${isActive("/admin/products") ? "active" : ""
                  }`}
              >
                <i className="fa fa-product-hunt fs-5"></i>
                <span className="nav-label">Products</span>
              </Link>
            </div>

            {/* Orders */}
            <div className="col">
              <Link
                to="/admin/orders"
                className={`bottom-nav-item ${isActive("/admin/orders") ? "active" : ""
                  }`}
              >
                <i className="fa fa-shopping-basket fs-5"></i>
                <span className="nav-label">Orders</span>
              </Link>
            </div>

            {/* Users */}
            <div className="col">
              <Link
                to="/admin/users"
                className={`bottom-nav-item ${isActive("/admin/users") ? "active" : ""
                  }`}
              >
                <i className="fa fa-users fs-5"></i>
                <span className="nav-label">Users</span>
              </Link>
            </div>

            {/* Categories */}
            <div className="col">
              <Link
                to="/admin/categories"
                className={`bottom-nav-item ${isActive("/admin/categories") ? "active" : ""
                  }`}
              >
                <i className="fa fa-tags fs-5"></i>
                <span className="nav-label">Categories</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Header */}
      <header className="mobile-header d-lg-none">
        <div className="container-fluid">
          <div className="d-flex align-items-center justify-content-between py-3">
            <div className="d-flex align-items-center">
              <i className="fas fa-crown text-gold me-2 fs-4 glow-icon"></i>
              <h5 className="mb-0 gold-gradient-text fw-bold">
                Saliheen Admin
              </h5>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
