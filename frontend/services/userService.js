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
    const res = await axios.get(`${API_URL}/me`, {
      withCredentials: true,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

// Delete profile image
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

// Update user info (e.g., username, email, gender, etc.)
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

// Delete own account
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

// Change user role (admin only)
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

// Export all user management functions
export {
  uploadProfile,
  deleteProfile,
  fetchSingleUser,
  fetchAllUsers,
  updateUser,
  deleteUser,
  deleteUserAccount,
  changeRole,
};
