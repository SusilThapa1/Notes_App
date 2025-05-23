import axios from "axios";

// Base URL for the API
const API_URL = import.meta.env.VITE_API_URL + "/upload";

const fetchAllUploads = async () => {
  try {
    const response = await axios.get(`${API_URL}/getUploadData`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

const addUpload = async (uploadData) => {
  try {
    const response = await axios.post(`${API_URL}/addData`, uploadData, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const updateUpload = async (uploadId, uploadData) => {
  try {
    const response = await axios.put(
      `${API_URL}/updateData/${uploadId}`,
      uploadData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

const deleteUpload = async (uploadId) => {
  try {
    const response = await axios.delete(`${API_URL}/deleteData/${uploadId}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export { addUpload, fetchAllUploads, updateUpload, deleteUpload };
