import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/user";

// Fetch all users (admin use)
const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/view`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single user (requires token)
const fetchSingleUser = async () => {
  try {
    const res = await axios.get(`${API_URL}/userprofile`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    console.error("fetchSinglelUser error:", error);
    throw error;
  }
};

const deleteProfile = async (userid) => {
  try {
    const res = await axios.delete(`${API_URL}/profileimageDelete/${userid}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    console.error("Error deleting profile image:", err);
    return { success: false, message: "Failed to delete profile image" };
  }
};

// Register a new user
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Upload profile image
const uploadProfile = async (userId, formData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/profile/${userId}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Login user
const userLogin = async (data) => {
  try {
    const response = await axios.post(`${API_URL}/login`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update user info (e.g., username, phone, etc.)
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.patch(
      `${API_URL}/update/${userId}`,
      userData,
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//Change password
const changePass = async (userData) => {
  try {
    const response = await axios.patch(`${API_URL}/change-password`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    console.log(response.data);
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Delete a user (admin only)
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${userId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUserAccount = async (password) => {
  try {
    const response = await axios.post(
      `${API_URL}/delete`,
      { password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

//  Logout user
const logoutUser = async () => {
  try {
    const response = await axios.delete(`${API_URL}/logout`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

//send email verification-otp
const sendVerifyOtp = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/send-emailverify-otp`,
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

//verify email
const verifyEmail = async (otp, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-email`,
      { otp, userId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
//send email change verification-otp
const sendEmailChangeVerifyOtp = async (email) => {
  try {
    const response = await axios.post(
      `${API_URL}/send-email-change-verify-otp`,
      { email },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

//verify email change
const verifyEmailChange = async (otp) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-email-change`,
      {
        otp,
      },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

const passResetOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/pass-reset-otp`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const passResetOtpVerify = async (otp, email) => {
  try {
    const response = await axios.post(`${API_URL}/pass-reset-otp-verify`, {
      otp,
      email,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const passResetSuccess = async (password, email) => {
  try {
    const response = await axios.post(`${API_URL}/pass-reset-success`, {
      password,
      email,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const otpResend = async (userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/otp-resend`,
      { userId },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
const resetOtpResend = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/reset-otp-resend`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};

const changeRole = async (id, role) => {
  try {
    const response = await axios.post(
      `${API_URL}/change-role`,
      { id, role },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};

//  Export all functions
export {
  registerUser,
  userLogin,
  uploadProfile,
  deleteProfile,
  fetchSingleUser,
  fetchAllUsers,
  updateUser,
  changePass,
  deleteUser,
  deleteUserAccount,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  sendEmailChangeVerifyOtp,
  verifyEmailChange,
  passResetOtp,
  passResetOtpVerify,
  passResetSuccess,
  otpResend,
  resetOtpResend,
  changeRole,
};
