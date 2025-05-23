import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/programme";

const fetchAllProgrammes = async () => {
  try {
    const response = await axios.get(`${API_URL}/viewProgramme`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addProgramme = async (programmeData) => {
  try {
    const response = await axios.post(
      `${API_URL}/addProgramme`,
      programmeData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateProgramme = async (programmeId, programmeData) => {
  try {
    const response = await axios.put(
      `${API_URL}/updateProgramme/${programmeId}`,
      programmeData,
      {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteProgramme = async (programmeId) => {
  try {
    const response = await axios.delete(
      `${API_URL}/deleteProgramme/${programmeId}`,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { addProgramme, fetchAllProgrammes, updateProgramme, deleteProgramme };
