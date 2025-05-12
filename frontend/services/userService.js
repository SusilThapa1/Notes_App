import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/user";

// Fetch all users (admin use)
const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/view`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Fetch a single user (requires token)
const fetchSinglelUser = async () => {
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
    const response = await axios.put(`${API_URL}/profile/${userId}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
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

// Update user info (e.g., username, phone, etc.)
const updateUser = async (userId, userData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${userId}`, userData, {
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

// Delete a user (admin only)
const deleteUser = async (userId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${userId}`);
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

//  Export all functions
export {
  registerUser,
  userLogin,
  uploadProfile,
  deleteProfile,
  fetchSinglelUser,
  fetchAllUsers,
  updateUser,
  deleteUser,
  logoutUser,
};
