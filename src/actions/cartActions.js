import { toast } from "react-toastify";
import { addCartItemRequest, addCartItemSuccess } from "../slices/cartSlice";
import axios from "axios";
import { setCartItems } from "../slices/cartSlice";

export const addCartItem = (id, quantity) => async (dispatch) => {
  try {
    dispatch(addCartItemRequest());
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/product/${id}`,
      {
        withCredentials: true,
      }
    );

    dispatch(
      addCartItemSuccess({
        product: data.product._id,
        name: data.product.name,
        image: data.product.images[0].image,
        price: data.product.price,
        stock: data.product.stock,
        quantity,
      })
    );
  } catch (error) {}
};

export const addCartItemInDB =
  (productId, quantity, type, userId, itemName, overallPrice) =>
  async (dispatch) => {
    try {
      dispatch(addCartItemRequest());

      const { data } = await axios.post(
        `https://api.saliheenperfumes.com/api/v1/createCartItem`,
        {
          itemName,
          userId,
          productId,
          quantity,
          type,
          overallPrice,
        },
        { withCredentials: true }
      );

      dispatch(
        addCartItemSuccess({
          product: data?.cartItem?._id,
          name: data.cartItem?.itemName,
          type: data.cartItem?.type,
          image: data?.cartItem?.images[0]?.image,
          price: data.cartItem?.price,
          // price: isCouponAdded ? FinalPriceAfterCoupen : data.cartItem.price,
          stock: data.cartItem.stock,
          // quantity,
          // isCouponAdded,
        })
      );

      toast("Cart Item Added!", {
        type: "success",
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        // Redirect to the cart page after the toast closes
      });
    } catch (error) {
      toast(error?.response?.data?.message + " Try again later" || "", {
        type: "error",
        position: "bottom-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

export const fetchCartItemsForUser = (userId) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/CartProductsOfSingleUser/${userId}`,
      { withCredentials: true }
    );

    // Dispatch the action to set the cart items in Redux
    dispatch(setCartItems(data.cartItems));
  } catch (error) {
    console.error("Error fetching cart items:", error);
  }
};
