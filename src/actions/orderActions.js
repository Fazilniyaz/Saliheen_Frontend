import {
  createOrderFail,
  createOrderRequest,
  createOrderSuccess,
  userOrdersFail,
  userOrdersSuccess,
  userOrdersRequest,
  orderDetailRequest,
  orderDetailSuccess,
  orderDetailFail,
  adminOrdersRequest,
  adminOrdersSuccess,
  adminOrdersFail,
  deleteOrdersRequest,
  deleteOrdersSuccess,
  deleteOrdersFail,
  updateOrdersRequest,
  updateOrdersSuccess,
  updateOrdersFail,
} from "../slices/orderSlice";
import axios from "axios";
import { toast } from "react-toastify";

export const createOrder = (order) => async (dispatch) => {
  console.log(order);
  try {
    dispatch(createOrderRequest());
    const { data } = await axios.post(`/api/v1/order/new`, order);
    dispatch(createOrderSuccess(data));
  } catch (error) {
    dispatch(createOrderFail(error.response.data.message));
    toast(error.response.data.message, {
      type: "error",
      position: "bottom-center",
    });
  }
};
export const userOrders = async (dispatch) => {
  try {
    dispatch(userOrdersRequest());
    const { data } = await axios.get(`/api/v1/myorders`);
    dispatch(userOrdersSuccess(data));
  } catch (error) {
    dispatch(userOrdersFail(error.response.data.message));
  }
};
export const orderDetail = (id) => async (dispatch) => {
  try {
    dispatch(orderDetailRequest());
    const { data } = await axios.get(`/api/v1/order/${id}`);
    dispatch(orderDetailSuccess(data));
  } catch (error) {
    dispatch(orderDetailFail(error.response.data.message));
  }
};

export const adminOrders = async (dispatch) => {
  try {
    dispatch(adminOrdersRequest());
    const { data } = await axios.get(`/api/v1/admin/orders`);
    dispatch(adminOrdersSuccess(data));
  } catch (error) {
    dispatch(adminOrdersFail(error.response.data.message));
  }
};

export const deleteOrder = (id) => async (dispatch) => {
  try {
    dispatch(deleteOrdersRequest());
    await axios.delete(`/api/v1/admin/order/${id}`);
    dispatch(deleteOrdersSuccess());
  } catch (error) {
    dispatch(deleteOrdersFail(error.response.data.message));
  }
};

export const updateOrder = (id, orderData) => async (dispatch) => {
  try {
    dispatch(updateOrdersRequest());
    const { data } = await axios.put(`/api/v1/admin/order/${id}`, orderData);
    dispatch(updateOrdersSuccess());
  } catch (error) {
    dispatch(updateOrdersFail(error.response.data.message));
  }
};
