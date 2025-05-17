import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { removeItemFromCart } from "../../slices/cartSlice";
import Loader from "../layouts/Loader";
import { Fragment } from "react";
import { CartContext } from "./cartContext";

const CartPage = () => {
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalAmount: 0, totalProducts: 0 });

  const { user = "" } = useSelector((state) => state.authState);
  const userId = user._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { localCart, removeFromLocalCart } = useContext(CartContext);

  const checkoutHandler = () => {
    navigate(`/login?redirect=shipping`);
  };

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
    const fetchCartItems = async () => {
      try {
        if (userId) {
          setLoading(true);
          const { data } = await axios.get(
            `https://api.saliheenperfumes.com:8000/api/v1/CartProductsOfSingleUser/${userId}`,
            { withCredentials: true }
          );
          setCartData(data.cartItems);
          setSummary(data.summary);
        } else {
          setCartData(localCart);
          recalculateSummary(localCart);
        }
      } catch (error) {
        console.error("Error fetching cart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, [userId, localCart]);

  const handleDelete = async (id) => {
    if (!userId) {
      // If not logged in, delete from local cart
      removeFromLocalCart(id);
      const updatedCartData = cartData.filter((item) => item.productId !== id);
      setCartData(updatedCartData);
      recalculateSummary(updatedCartData);
    } else {
      try {
        await axios.delete(
          `https://api.saliheenperfumes.com/api/v1/deleteCartItem/${id}`,
          { withCredentials: true }
        );
        const updatedCartData = cartData.filter((item) => item._id !== id);
        setCartData(updatedCartData);
        recalculateSummary(updatedCartData);
        dispatch(removeItemFromCart(id));
      } catch (error) {
        console.error("Error deleting cart item:", error);
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Fragment>
      <div className="cart-page" style={styles.cartPage}>
        {cartData.length >= 1 ? (
          <h2 style={styles.heading}>Your Cart</h2>
        ) : (
          <h2 className="mt-5 headings mb-2">Your cart is Empty</h2>
        )}
        <div style={styles.cartItems}>
          {cartData.map((item) => (
            <div key={item._id || item.productId} style={styles.cartItem}>
              <img
                src={item.productId?.images?.[0]?.image || ""}
                alt={item.itemName}
                style={styles.productImage}
              />
              <div style={styles.itemDetails}>
                <Link to={`/product/${item.productId._id || item.productId}`}>
                  {item.itemName}
                </Link>
                <p id="card_item_price">Price: ₹{item.finalPrice}</p>
                <p>Stock: {item.stock > 0 ? "In Stock" : "Out of Stock"}</p>
                <div style={styles.quantityControls}>
                  <span className="mt-2 mb-2 stock">{item.quantity} ML</span>
                </div>
                <button
                  style={{ ...styles.button, ...styles.deleteButton }}
                  onClick={() =>
                    handleDelete(userId ? item._id : item.productId)
                  }
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {cartData.length >= 1 && (
          <div style={styles.orderSummary}>
            <h3 className="headings mb-3">Order Summary</h3>
            <p>Number of Products: {summary.totalProducts}</p>
            <p>Total Amount: ₹{summary.totalAmount}</p>
            <button
              disabled={cartData.length === 0}
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

const styles = {
  cartPage: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    fontWeight: "bold",
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
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "black",
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
    border: "1px solid #007bff",
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    borderColor: "#dc3545",
    marginTop: "10px",
  },
  orderSummary: {
    marginTop: "30px",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    backgroundColor: "black",
  },
  checkoutButton: {
    marginTop: "20px",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#28a745",
    color: "#fff",
    cursor: "pointer",
  },
};

export default CartPage;
