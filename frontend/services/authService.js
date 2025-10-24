import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/auth";

// Register a new user
const registerUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
    });
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

// Logout user
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

// Send email verification OTP
const sendVerifyOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/send-emailverify-otp`, {
      email,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Verify email with OTP
const verifyEmail = async (otp, userId) => {
  try {
    const response = await axios.post(
      `${API_URL}/verify-email`,
      {
        otp,
        userId,
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

// Send email change verification OTP
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

// Verify email change with OTP
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

// Change password
const changePassword = async (userData) => {
  try {
    const response = await axios.patch(`${API_URL}/change-password`, userData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Send password reset OTP
const passResetOtp = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/pass-reset-otp`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Verify password reset OTP
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

// Complete password reset
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

// Resend OTP (email verification)
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

// Resend OTP (password reset)
const resetOtpResend = async (email) => {
  try {
    const response = await axios.post(`${API_URL}/reset-otp-resend`, { email });
    return response.data;
  } catch (err) {
    throw err;
  }
};

// Session heartbeat
const heartbeat = async () => {
  try {
    const response = await axios.put(`${API_URL}/heartbeat`, null, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    if (
      err.response &&
      (err.response.status === 401 || err.response.status === 404)
    ) {
      throw new Error("SESSION_EXPIRED");
    }
    throw err;
  }
};

// Remove session
const removeSession = async (deviceId) => {
  try {
    const res = await axios.delete(`${API_URL}/session/${deviceId}`, {
      withCredentials: true,
    });
    return res.data;
  } catch (err) {
    throw err;
  }
};

// Export all authentication functions
export {
  registerUser,
  userLogin,
  logoutUser,
  sendVerifyOtp,
  verifyEmail,
  sendEmailChangeVerifyOtp,
  verifyEmailChange,
  changePassword,
  passResetOtp,
  passResetOtpVerify,
  passResetSuccess,
  otpResend,
  resetOtpResend,
  heartbeat,
  removeSession,
};
