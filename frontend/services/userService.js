import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/user";

const fetchAllUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/view`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
const fetchSinglelUser = async (userid) => {
  try {
    const response = await axios.get(`${API_URL}/single/${userid}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const registerUser = async (UserData) => {
  try {
    const response = await axios.post(`${API_URL}/register`, UserData, {
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

const updateUser = async (UserId, UserData) => {
  try {
    const response = await axios.put(`${API_URL}/update/${UserId}`, UserData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (UserId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${UserId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const logoutUser = async () => {
  try {
    const response = await axios.delete(`${API_URL}/logout`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
export {
  registerUser,
  userLogin,
  fetchSinglelUser,
  fetchAllUsers,
  updateUser,
  deleteUser,
  logoutUser,
};
