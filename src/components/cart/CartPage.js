import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { removeItemFromCart } from "../../slices/cartSlice";
import Loader from "../layouts/Loader";
import { Fragment } from "react";
import { useContext } from "react";
import { CartContext } from "../cart/cartContext";
import { ThreeDots } from "react-loader-spinner";
import { useTheme } from "../../context";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAmount: 0, totalProducts: 0 });
  const { user = "" } = useSelector((state) => state.authState);
  const { colors } = useTheme();

  const userId = user._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkoutHandler = () => {
    navigate("/shipping");
  };

  const { localCart, addToLocalCart, removeFromLocalCart } =
    useContext(CartContext);

  // Function to recalculate the summary
  const recalculateSummary = (cartItems) => {
    const totalProducts = cartItems.reduce(
      (acc, item) => acc + item.quantity,
      0
    );
    const totalAmount = cartItems.reduce(
      (acc, item) => acc + item.finalPrice,
      0
    );
    setSummary({ totalProducts, totalAmount });
  };

  useEffect(() => {
    if (userId) {
      const fetchCartItems = async () => {
        try {
          setLoading(true);
          const { data } = await axios.get(
            `https://saliheenperfumes-zd2i.onrender.com/api/v1/CartProductsOfSingleUser/${userId}`,
            { withCredentials: true }
          );
          setCartData(data.cartItems);
          setSummary(data.summary);
        } catch (error) {
          console.error("Error fetching cart data:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchCartItems();
    } else {
      // For guest users, use localCart
      setLoading(false);
      recalculateSummary(localCart);
    }
    // eslint-disable-next-line
  }, [userId, localCart]);

  const handleDelete = async (uId, pId) => {
    // For guest users, remove from localCart
    const updatedLocalCart = localCart.filter((item) => item.productId !== pId);
    const productId = localCart.find((item) => {
      return item.productId === pId;
    });

    removeFromLocalCart(productId.productId);
    recalculateSummary(updatedLocalCart);
  };

  if (loading) {
    return (
      <div
        className="loading-container"
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "50vh",
          width: "100%",
        }}
      >
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color={colors.accent}
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClassName=""
          visible={true}
        />
      </div>
    );
  }

  let toatlAmount = localCart.reduce((acc, item) => acc + item.finalPrice, 0);

  // Decide which cart to show
  const displayCart = localCart;

  const styles = {
    cartPage: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
      maxWidth: "1200px",
      margin: "0 auto",
      backgroundColor: colors.bgPage,
      color: colors.textPrimary,
    },
    heading: {
      textAlign: "center",
      marginBottom: "20px",
      fontSize: "24px",
      fontWeight: "600",
      color: colors.textPrimary,
    },
    cartItems: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
    },
    cartItem: {
      display: "flex",
      alignItems: "center",
      padding: "15px",
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "8px",
      backgroundColor: colors.bgPage,
      color: colors.textPrimary,
    },
    productImage: {
      width: "100px",
      height: "100px",
      marginRight: "20px",
      objectFit: "cover",
      borderRadius: "8px",
    },
    itemDetails: {
      flex: 1,
      color: colors.textPrimary,
    },
    quantityControls: {
      display: "flex",
      alignItems: "center",
      gap: "10px",
      marginTop: "10px",
    },
    button: {
      padding: "5px 10px",
      fontSize: "16px",
      borderRadius: "5px",
      border: `1px solid ${colors.accent}`,
      backgroundColor: colors.accent,
      color: colors.buttonText,
      cursor: "pointer",
    },
    deleteButton: {
      backgroundColor: "#c62828",
      borderColor: "#c62828",
      marginTop: "10px",
      color: "#fff",
    },
    orderSummary: {
      marginTop: "30px",
      padding: "20px",
      border: `1px solid ${colors.borderLight}`,
      borderRadius: "8px",
      backgroundColor: colors.bgSubtle,
      color: colors.textPrimary,
    },
    checkoutButton: {
      marginTop: "20px",
      padding: "10px 20px",
      fontSize: "16px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: colors.accent,
      color: colors.buttonText,
      cursor: "pointer",
    },
  };

  return (
    <Fragment>
      <div className="cart-page" style={styles.cartPage}>
        {displayCart.length >= 1 ? (
          <h2 style={styles.heading}>Your Cart</h2>
        ) : (
          <h2 className="mt-5 headings mb-2">Your cart is Empty</h2>
        )}
        <div style={styles.cartItems}>
          {displayCart.map((item) => (
            <div key={item._id || item.productId} style={styles.cartItem}>
              <img
                src={item?.productImage}
                alt={item.itemName}
                style={styles.productImage}
              />
              <div style={styles.itemDetails}>
                <Link
                  to={`/product/${
                    userId ? item.productId._id : item.productId
                  }`}
                >
                  {item.itemName}
                </Link>
                <p id="card_item_price">Price: ₹{item.finalPrice}</p>
                <p>Stock: {item.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                <div style={styles.quantityControls}>
                  <span>
                    <span className="mt-2 mb-2 stock">
                      {item.quantity} ML | Bottles : {item.noOfBottles}
                    </span>
                  </span>
                </div>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() => {
                    handleDelete(userId, item.productId);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {displayCart.length >= 1 && (
          <div style={styles.orderSummary}>
            <h3 className="headings mb-3">Order Summary</h3>
            <p>Number of Products: {localCart.length}</p>
            <p>Total Amount: ₹{toatlAmount}</p>
            <button
              disabled={displayCart.length === 0}
              style={styles.checkoutButton}
              onClick={checkoutHandler}
            >
              Checkout
            </button>
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default CartPage;
