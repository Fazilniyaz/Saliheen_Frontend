import {
  loginFail,
  loginRequest,
  loginSuccess,
  clearError,
  registerFail,
  registerRequest,
  registerSuccess,
  loadUserRequest,
  loadUserSuccess,
  loadUserFail,
  logoutSuccess,
  logoutFail,
  updateProfileRequest,
  updateProfileSuccess,
  updateProfileFail,
  updatePasswordRequest,
  updatePasswordSuccess,
  updatePasswordFail,
  forgotPasswordRequest,
  forgotPasswordSuccess,
  forgotPasswordFail,
  resetPasswordRequest,
  resetPasswordSuccess,
  resetPasswordFail,
  otpRequest,
  otpSuccess,
  otpFail,
} from "../slices/authSlice";

import {
  usersRequest,
  usersSuccess,
  usersFail,
  userRequest,
  userSuccess,
  userFail,
  deleteUserRequest,
  deleteUserSuccess,
  deleteUserFail,
  updateUserRequest,
  updateUserSuccess,
  updateUserFail,
} from "../slices/userSlice";
import axios from "axios";
import { toast } from "react-toastify";
import Swal from "sweetalert2";

export const login = (email, password) => async (dispatch) => {
  let err;
  if (email && password) {
    try {
      dispatch(loginRequest());
      const { data } = await axios.post(
        `https://api.saliheenperfumes.com/api/v1/login`,
        { email, password },
        { withCredentials: true }
      );
      if (data.message == "User is blocked") {
        console.log("User blocked");
        toast("You are blocked by admin!", {
          type: "error",
          position: "bottom-center",
        });
      }
      dispatch(loginSuccess(data));
    } catch (error) {
      // toast(error.response.data.message, {
      //   type: "error",
      //   position: "bottom-center",
      // });
      err = error.response.data.message;
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response.data.message,
      });
      // window.alert(error.response.data.message);
      dispatch(loginFail(error.response.data.message));
      console.log(error.response.data.message);
      // toast(error.response.data.message, {
      //   type: "error",
      //   position: "bottom-center",
      // });
    }
    if (err?.trim() !== "") {
      console.log("Helo");
      toast("Fazil");
    }
  } else {
    console.log("GOogleSignin triggered");
    try {
      dispatch(loginRequest());
      const { data } = await axios.post(
        `https://api.saliheenperfumes.com/api/v1/google/signin`,
        {
          email,
        },
        { withCredentials: true }
      );
      dispatch(loginSuccess(data));
    } catch (error) {
      dispatch(loginFail(error.response.data.message));
    }
  }
};
export const googleLogin = (email) => async (dispatch) => {
  console.log(email);
  try {
    dispatch(loginRequest());
    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/google/signin`,
      {
        email,
      },
      { withCredentials: true }
    );
    dispatch(loginSuccess(data));
  } catch (error) {
    dispatch(loginFail(error.response.data.message));
  }
};

export const clearAuthError = (dispatch) => {
  dispatch(clearError());
};

export const register = (userData) => async (dispatch) => {
  try {
    dispatch(registerRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/register`,
      userData,
      config,
      { withCredentials: true }
    );
    dispatch(registerSuccess(data));
  } catch (error) {
    console.log(error.response.data.message);
    dispatch(registerFail(error.response.data.message));
  }
};

export const loadUser = async (dispatch) => {
  try {
    dispatch(loadUserRequest());

    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/myprofile`,
      { withCredentials: true }
    );
    dispatch(loadUserSuccess(data));
  } catch (error) {
    dispatch(loadUserFail(error.response.data.message));
  }
};

export const logout = async (dispatch) => {
  try {
    await axios.get(`https://api.saliheenperfumes.com/api/v1/logout`, {
      withCredentials: true,
    });
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(logoutFail);
  }
};

export const updateProfile = (userData) => async (dispatch) => {
  try {
    dispatch(updateProfileRequest());
    const config = {
      headers: {
        "Content-type": "multipart/form-data",
      },
    };

    const { data } = await axios.put(
      `https://api.saliheenperfumes.com/api/v1/update`,
      userData,
      config,
      { withCredentials: true }
    );
    dispatch(updateProfileSuccess(data));
  } catch (error) {
    dispatch(updateProfileFail(error.response.data.message));
  }
};

export const updatePassword = (formData) => async (dispatch) => {
  try {
    dispatch(updatePasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(
      `https://api.saliheenperfumes.com/api/v1/password/change`,
      formData,
      config,
      { withCredentials: true }
    );
    dispatch(updatePasswordSuccess());
  } catch (error) {
    dispatch(updatePasswordFail(error.response.data.message));
  }
};

export const forgotPassword = (formData) => async (dispatch) => {
  try {
    dispatch(forgotPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/password/forgot`,
      formData,
      config,
      { withCredentials: true }
    );
    dispatch(forgotPasswordSuccess(data));
  } catch (error) {
    dispatch(forgotPasswordFail(error.response.data.message));
  }
};

export const resetPassword = (formData, token) => async (dispatch) => {
  try {
    dispatch(resetPasswordRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/password/reset/${token}`,
      formData,
      config,
      { withCredentials: true }
    );
    dispatch(resetPasswordSuccess(data));
  } catch (error) {
    dispatch(resetPasswordFail(error.response.data.message));
  }
};

export const getUsers = async (dispatch) => {
  try {
    dispatch(usersRequest());
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/admin/users`,
      { withCredentials: true }
    );
    dispatch(usersSuccess(data));
  } catch (error) {
    dispatch(usersFail(error.response.data.message));
  }
};

export const getUser = (id) => async (dispatch) => {
  try {
    dispatch(userRequest());
    const { data } = await axios.get(
      `https://api.saliheenperfumes.com/api/v1/admin/user/${id}`,
      { withCredentials: true }
    );
    dispatch(userSuccess(data));
  } catch (error) {
    dispatch(userFail(error.response.data.message));
  }
};

export const deleteUser = (id) => async (dispatch) => {
  try {
    dispatch(deleteUserRequest());
    await axios.delete(
      `https://api.saliheenperfumes.com/api/v1/admin/user/${id}`,
      { withCredentials: true }
    );
    dispatch(deleteUserSuccess());
  } catch (error) {
    dispatch(deleteUserFail(error.response.data.message));
  }
};

export const updateUser = (id, formData) => async (dispatch) => {
  try {
    dispatch(updateUserRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    await axios.put(
      `https://api.saliheenperfumes.com/api/v1/admin/user/${id}`,
      formData,
      config,
      { withCredentials: true }
    );
    dispatch(updateUserSuccess());
  } catch (error) {
    dispatch(updateUserFail(error.response.data.message));
  }
};

export const blockUser = (id) => async (dispatch) => {
  try {
    await axios.put(
      `https://api.saliheenperfumes.com/api/v1/admin/userBlock/${id}`,
      { withCredentials: true }
    );

    toast.success("User blocked successfully!", {
      position: "bottom-center",
    });
    dispatch(getUser(id)); // Refresh the user data after blocking
  } catch (error) {
    toast.error("Error blocking user", { position: "bottom-center" });
  }
};

export const verifyOtp = (email) => async (dispatch) => {
  console.log("Verify OTP called");
  try {
    dispatch(otpRequest());
    const config = {
      headers: {
        "Content-type": "application/json",
      },
    };
    const { data } = await axios.post(
      `https://api.saliheenperfumes.com/api/v1/register/otp`,
      email,
      config,
      { withCredentials: true }
    );
    dispatch(otpSuccess(data));
    console.log("Verify OTP success");
  } catch (error) {
    dispatch(otpFail(error.response.data.message));
    console.log("Verify OTP failure");
  }
};

// export const verifyOtp = (email) => async (dispatch) => {
//   console.log("Verify OTP called");
//   try {
//     dispatch(otpRequest());
//     const config = {
//       headers: {
//         "Content-type": "application/json",
//       },
//     };
//     const { data } = await axios.post(`/api/v1/register/otp`, email, config);
//     dispatch(otpSuccess(data));
//     console.log("Verify OTP success");
//   } catch (error) {
//     dispatch(otpFail(error.response.data.message));
//     console.log("Verify OTP failure");
//   }
// };
