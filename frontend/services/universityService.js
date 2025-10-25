import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/university";

// ======================== Fetch All Universities ========================
const fetchAllUniversities = async () => {
  try {
    const response = await axios.get(`${API_URL}/list`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================== Add University ========================
const addUniversity = async (universityData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, universityData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================== Update University ========================
const updateUniversity = async (universityId, universityData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${universityId}`,
      universityData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================== Delete University ========================
const deleteUniversity = async (universityId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${universityId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ======================== Get Single University ========================
const fetchSingleUniversity = async (universityId) => {
  try {
    const response = await axios.get(`${API_URL}/single/${universityId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export {
  fetchAllUniversities,
  fetchSingleUniversity,
  addUniversity,
  updateUniversity,
  deleteUniversity,
};
