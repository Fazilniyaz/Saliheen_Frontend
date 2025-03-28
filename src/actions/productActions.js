import axios from "axios";

import {
  productsFail,
  productsSuccess,
  productsRequest,
} from "../slices/productsSlice";

// import axios from "axios";
import { clearError } from "../slices/productsSlice";
import { toast } from "react-toastify";

import {
  productFail,
  productSuccess,
  productRequest,
  newProductRequest,
  newProductSuccess,
  newProductFail,
  deleteProductRequest,
  deleteProductSuccess,
  deleteProductFail,
  createReviewRequest,
  createReviewSuccess,
  createReviewFail,
  updateProductRequest,
  updateProductSuccess,
  updateProductFail,
} from "../slices/productSlice";

import {
  adminProductsFail,
  adminProductsRequest,
  adminProductsSuccess,
} from "../slices/productsSlice";

export const getProducts =
  (keyword, price, category, rating, gender, currentPage) =>
  // (keyword, price, category, rating, currentPage) =>
  async (dispatch) => {
    try {
      dispatch(productsRequest());
      let link = `https://api.saliheenperfumes.com/api/v1/products?page=${currentPage}`;
      if (keyword) {
        link += `&keyword=${keyword}`;
      }
      if (price) {
        link += `&price[gte]=${price[0]}&price[lte]=${price[1]}`;
      }
      if (category) {
        link += `&category=${category}`;
      }
      if (rating) {
        link += `&ratings=${rating}`;
      }
      if (gender) {
        link += `&gender=${gender}`;
      }
      dispatch(productsRequest());
      const { data } = await axios.get(link, { withCredentials: true });
      dispatch(productsSuccess(data));
      console.log("called");
    } catch (error) {
      console.log("hii");
      dispatch(productsFail(error.response.data.message));
    }
  };

export const getProduct = (id) => async (dispatch) => {
  try {
    dispatch(productRequest());
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/product/${id}`,
      { withCredentials: true }
    ); // The URL is correct
    console.log(data);
    dispatch(productSuccess(data));
    console.log("called");
  } catch (error) {
    console.log("hii");
    dispatch(productFail(error.response.data.message));
  }
};

export const getAdminProducts = async (dispatch) => {
  try {
    dispatch(adminProductsRequest());
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/admin/products`,
      { withCredentials: true }
    );
    dispatch(adminProductsSuccess(data));
  } catch (error) {
    //handle error
    dispatch(adminProductsFail(error.response.data.message));
  }
};

export const createNewProduct = (productData) => async (dispatch) => {
  try {
    dispatch(newProductRequest());
    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/admin/product/new`,
      productData,
      { withCredentials: true }
    );
    dispatch(newProductSuccess(data));
  } catch (error) {
    //handle error
    dispatch(newProductFail(error.response.data.message));
  }
};

export const deleteProduct = (id) => async (dispatch) => {
  try {
    dispatch(deleteProductRequest());
    await axios.delete(
      `https://api.saliheenperfumes.com/api/v1/admin/product/${id}`,
      { withCredentials: true }
    );
    dispatch(deleteProductSuccess());
  } catch (error) {
    //handle error
    dispatch(deleteProductFail(error.response.data.message));
  }
};

export const createReview = (reviewData) => async (dispatch) => {
  try {
    dispatch(createReviewRequest());
    const config = {
      headers: { "Content-type": "application/json" },
    };
    const { data } = await axios.put(
      `https://api.saliheenperfumes.com/api/v1/review`,
      reviewData,
      config,
      { withCredentials: true }
    );
    dispatch(createReviewSuccess(data));
  } catch (error) {
    //handle error
    dispatch(createReviewFail(error.response.data.message));
  }
};

export const updateProduct = (id, productData) => async (dispatch) => {
  try {
    dispatch(updateProductRequest());
    const { data } = await axios.put(
      `https://api.saliheenperfumes.com/api/v1/admin/product/${id}`,
      productData,
      { withCredentials: true }
    );
    dispatch(updateProductSuccess(data));
  } catch (error) {
    //handle error
    dispatch(updateProductFail(error.response.data.message));
  }
};

// Enable Product
export const enableProduct = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/admin/product/enable/${id}`,
      { withCredentials: true }
    );
    toast.success(data.message, { position: "bottom-center" });
  } catch (error) {
    dispatch({ type: clearError, payload: error.response.data.message });
    toast.error(error.response.data.message, { position: "bottom-center" });
  }
};

// Disable Product
export const disableProduct = (id) => async (dispatch) => {
  try {
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/admin/product/disable/${id}`,
      { withCredentials: true }
    );
    toast.success(data.message, { position: "bottom-center" });
  } catch (error) {
    dispatch({ type: clearError, payload: error.response.data.message });
    toast.error(error.response.data.message, { position: "bottom-center" });
  }
};
