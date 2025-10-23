import { Link, useNavigate } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import { useState } from "react";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="sidebar-wrapper">
      {/* Mobile Menu Toggle Button */}
      <button
        className="gold-menu-toggle btn d-md-none"
        type="button"
        onClick={toggleMobileMenu}
      >
        <i className="fas fa-bars"></i>
        <span className="ms-2">Menu</span>
      </button>

      {/* Overlay for mobile */}
      {isMobileMenuOpen && (
        <div
          className="mobile-overlay d-md-none"
          onClick={toggleMobileMenu}
        ></div>
      )}

      {/* Sidebar Navigation */}
      <nav
        id="gold-sidebar"
        className={`${isMobileMenuOpen ? "mobile-open" : ""}`}
      >
        {/* Sidebar Header */}
        <div className="sidebar-header">
          <div className="brand-logo">
            <div className="logo-icon">
              <i className="fas fa-crown text-gold"></i>
            </div>
            <h4 className="brand-text gold-gradient-text">Saliheen Perfumes</h4>
            <p className="brand-subtitle">Admin Panel</p>
          </div>
        </div>

        {/* Navigation Menu */}
        <ul className="sidebar-components">
          {/* Dashboard */}
          <li className="nav-item">
            <Link
              to="/admin/dashboard"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fas fa-tachometer-alt nav-icon"></i>
              <span className="nav-text">Dashboard</span>
            </Link>
          </li>

          {/* Products Dropdown */}
          <li className="nav-item dropdown-item">
            <NavDropdown
              title={
                <div className="nav-link">
                  <i className="fa fa-product-hunt nav-icon"></i>
                  <span className="nav-text">Products</span>
                  <i className="fas fa-chevron-down dropdown-arrow"></i>
                </div>
              }
              id="products-dropdown"
              className="gold-dropdown"
            >
              <NavDropdown.Item
                onClick={() => {
                  navigate("/admin/products");
                  setIsMobileMenuOpen(false);
                }}
                className="dropdown-link"
              >
                <i className="fa fa-shopping-basket me-2"></i>
                <span>All Products</span>
              </NavDropdown.Item>
              <NavDropdown.Item
                onClick={() => {
                  navigate("/admin/products/create");
                  setIsMobileMenuOpen(false);
                }}
                className="dropdown-link"
              >
                <i className="fa fa-plus me-2"></i>
                <span>Create Product</span>
              </NavDropdown.Item>
            </NavDropdown>
          </li>

          {/* Orders */}
          <li className="nav-item">
            <Link
              to="/admin/orders"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa fa-shopping-basket nav-icon"></i>
              <span className="nav-text">Orders</span>
            </Link>
          </li>

          {/* Users */}
          <li className="nav-item">
            <Link
              to="/admin/users"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa fa-users nav-icon"></i>
              <span className="nav-text">Users</span>
            </Link>
          </li>

          {/* Categories */}
          <li className="nav-item">
            <Link
              to="/admin/categories"
              className="nav-link"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <i className="fa fa-tags nav-icon"></i>
              <span className="nav-text">Categories</span>
            </Link>
          </li>
        </ul>
      </nav>

      {/* Custom Styles */}
      <style jsx>{`
        .sidebar-wrapper {
          position: relative;
        }

        .gold-menu-toggle {
          position: fixed;
          top: 15px;
          left: 15px;
          z-index: 1050;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid #d4af37;
          color: #d4af37;
          padding: 10px 15px;
          border-radius: 8px;
          font-weight: 600;
          box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
        }

        .gold-menu-toggle:hover {
          background: linear-gradient(135deg, #2d2d2d 0%, #3d3d3d 100%);
          color: #faf0a0;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(212, 175, 55, 0.4);
        }

        .mobile-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          z-index: 1040;
        }

        #gold-sidebar {
          background: linear-gradient(
            180deg,
            #0c0c0c 0%,
            #1a1a1a 50%,
            #0c0c0c 100%
          );
          border-right: 1px solid #333;
          min-height: 100vh;
          position: sticky;
          top: 0;
          width: 280px;
          z-index: 1030;
          box-shadow: 5px 0 15px rgba(0, 0, 0, 0.5);
        }

        .sidebar-header {
          padding: 2rem 1.5rem 1.5rem;
          border-bottom: 1px solid #333;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          position: relative;
          overflow: hidden;
        }

        .sidebar-header::before {
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
        }

        .brand-logo {
          text-align: center;
        }

        .logo-icon {
          font-size: 2.5rem;
          margin-bottom: 0.5rem;
          filter: drop-shadow(0 0 10px rgba(212, 175, 55, 0.5));
        }

        .brand-text {
          font-size: 1.4rem;
          margin-bottom: 0.25rem;
          font-weight: bold;
        }

        .brand-subtitle {
          color: #d4af37;
          font-size: 0.85rem;
          margin: 0;
          opacity: 0.8;
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
          font-family: "Yantramanav", sans-serif;
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

        .sidebar-components {
          list-style: none;
          padding: 1rem 0;
          margin: 0;
        }

        .nav-item {
          margin: 0.25rem 0;
        }

        .nav-link {
          display: flex;
          align-items: center;
          padding: 1rem 1.5rem;
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s ease;
          border-left: 3px solid transparent;
          position: relative;
        }

        .nav-link:hover {
          background: linear-gradient(
            90deg,
            rgba(212, 175, 55, 0.1) 0%,
            transparent 100%
          );
          color: #d4af37;
          border-left-color: #d4af37;
        }

        .nav-link.active {
          background: linear-gradient(
            90deg,
            rgba(212, 175, 55, 0.2) 0%,
            transparent 100%
          );
          color: #faf0a0;
          border-left-color: #faf0a0;
        }

        .nav-icon {
          width: 20px;
          margin-right: 1rem;
          font-size: 1.1rem;
        }

        .nav-text {
          flex: 1;
          font-weight: 500;
        }

        .dropdown-arrow {
          margin-left: auto;
          font-size: 0.8rem;
          transition: transform 0.3s ease;
        }

        .gold-dropdown.show .dropdown-arrow {
          transform: rotate(180deg);
        }

        .gold-dropdown .dropdown-toggle {
          background: none !important;
          border: none;
          padding: 0;
          width: 100%;
        }

        .gold-dropdown .dropdown-toggle::after {
          display: none;
        }

        .gold-dropdown .dropdown-menu {
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          border: 1px solid #333;
          border-radius: 8px;
          margin: 0;
          padding: 0.5rem 0;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        }

        .dropdown-link {
          display: flex;
          align-items: center;
          padding: 0.75rem 1.5rem;
          color: #ccc;
          text-decoration: none;
          transition: all 0.3s ease;
          border: none;
          background: none;
          width: 100%;
        }

        .dropdown-link:hover {
          background: linear-gradient(
            90deg,
            rgba(212, 175, 55, 0.1) 0%,
            transparent 100%
          );
          color: #d4af37;
        }

        /* Mobile Styles */
        @media (max-width: 767.98px) {
          #gold-sidebar {
            position: fixed;
            left: -100%;
            top: 0;
            height: 100vh;
            transition: left 0.3s ease;
            box-shadow: 5px 0 25px rgba(0, 0, 0, 0.7);
          }

          #gold-sidebar.mobile-open {
            left: 0;
          }
        }

        /* Desktop Styles */
        @media (min-width: 768px) {
          .gold-menu-toggle {
            display: none;
          }

          #gold-sidebar {
            width: 280px;
            min-width: 280px;
            max-width: 280px;
          }
        }
      `}</style>
    </div>
  );
}
