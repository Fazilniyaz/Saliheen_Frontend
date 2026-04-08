import React, { Fragment, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Image } from "react-bootstrap";
import { logout } from "../../actions/userActions";
// Icon replaced with inline SVG — no Semantic UI CSS needed in critical path
import { CartContext } from "../cart/cartContext";
import GoogleAuthModal from "../user/GoogleAuthModel";
import { useTheme } from "../../context";

function Header() {
  const { isAuthenticated, user = "" } = useSelector(
    (state) => state.authState
  );
  const { items: cartItems } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  const { localCart } = useContext(CartContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const logoutHandler = () => {
    dispatch(logout);
  };

  const isAdmin = window.location.pathname.startsWith('/admin');

  if (isAdmin) {
    return null;
  }


  return (
    <Fragment>
      <nav className="navbar navbar-compact">
        <div className="navbar-brand-wrap">
          <div id="brand-display" className="navbar-brand">
            <img
              src="/images/spimhd.png"
              alt="Logo"
              className="navbar-logo-img"
            />
            <Link to="/">
              <h1 id="brand-display" className="text-logo">
                Saliheen Perfumes
              </h1>
            </Link>
          </div>
        </div>

        <div className="navbar-actions">
          {/* Theme toggle */}
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === "light" ? "Switch to dark (Gold & Black)" : "Switch to light"}
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <span className="theme-icon" aria-hidden="true">◆</span>
            ) : (
              <span className="theme-icon theme-icon-sun" aria-hidden="true">☀</span>
            )}
          </button>
          {isAuthenticated ? (
            <>
              <Dropdown className="d-inline header-profile-dropdown" align="end">
                <Dropdown.Toggle
                  variant="default"
                  id="dropdown-basic"
                  className="navbar-user-toggle header-profile-toggle"
                >
                  <span className="header-profile-wrap">
                    <figure className="avatar avatar-nav">
                      <Image
                        className="avatar-nav-img"
                        src={user.avatar ?? "/images/default_avatar.png"}
                      />
                    </figure>
                    <span className="header-profile-arrow" aria-hidden="true" />
                  </span>
                </Dropdown.Toggle>

                <Dropdown.Menu>
                  <Dropdown.Item
                    onClick={() => navigate("/myProfile")}
                    className="text-dark"
                  >
                    Profile
                  </Dropdown.Item>

                  <Dropdown.Item className="text-dark">
                    <Link to="/cart" className="text-dark">
                      Cart <span className="ml-1">{cartItems.length}</span>
                    </Link>
                  </Dropdown.Item>

                  {user.role === "admin" && (
                    <Dropdown.Item
                      onClick={() => navigate("/admin/dashboard")}
                      className="text-dark"
                    >
                      Dashboard
                    </Dropdown.Item>
                  )}

                  <Dropdown.Item
                    onClick={() => navigate("/orders")}
                    className="text-dark"
                  >
                    Orders
                  </Dropdown.Item>

                  <Dropdown.Item
                    onClick={logoutHandler}
                    className="text-danger"
                  >
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </>
          ) : (
            <button
              className="btn"
              id="login_btn"
              onClick={() => setShowAuthModal(true)}
            >
              Sign In
            </button>
          )}

          {/* Always show cart icon */}
          <span id="cart_count">
            <Link to="/cart" className="cart-icon-link">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true" style={{ verticalAlign: "middle" }}>
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zM5 13a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
              </svg>
              {localCart.length}
            </Link>
          </span>
        </div>
      </nav>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </Fragment>
  );
}

export default Header;
