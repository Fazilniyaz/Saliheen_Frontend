import React, { Fragment, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Dropdown, Image } from "react-bootstrap";
import { logout } from "../../actions/userActions";
import { Icon } from "semantic-ui-react";
import { CartContext } from "../cart/cartContext";
import GoogleAuthModal from "../user/GoogleAuthModel";

function Header() {
  const { isAuthenticated, user = "" } = useSelector(
    (state) => state.authState
  );
  const { items: cartItems } = useSelector((state) => state.cartState);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localCart } = useContext(CartContext);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const logoutHandler = () => {
    dispatch(logout);
  };

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
              <Icon name="shopping cart" />
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
