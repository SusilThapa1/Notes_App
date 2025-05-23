import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/semester";

const fetchAllSemesters = async () => {
  try {
    const response = await axios.get(`${API_URL}/semesterView`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addSemester = async (semesterData) => {
  try {
    const response = await axios.post(`${API_URL}/add`, semesterData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateSemester = async (semesterId, semesterData) => {
  try {
    const response = await axios.put(
      `${API_URL}/update/${semesterId}`,
      semesterData,
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteSemester = async (semesterId) => {
  try {
    const response = await axios.delete(`${API_URL}/delete/${semesterId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { addSemester, fetchAllSemesters, updateSemester, deleteSemester };
