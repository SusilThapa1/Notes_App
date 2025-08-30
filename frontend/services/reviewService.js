import axios from "axios";
const API_URL = import.meta.env.VITE_API_URL + "/review";

const addReview = async (review) => {
  try {
    const response = await axios.post(`${API_URL}/send-review`, review, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
const viewReview = async () => {
  try {
    const response = await axios.get(`${API_URL}/view-review`);
    return response.data;
  } catch (err) {
    throw err;
  }
};

const sendReplyReview = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/reply-review/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
const updateReview = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/update-review/${id}`, data, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};
const editReplyReview = async (id, data) => {
  try {
    const response = await axios.put(
      `${API_URL}/update-reviewreply/${id}`,
      data,
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (err) {
    throw err;
  }
};
const deleteReplyReview = async (id) => {
  try {
    const response = await axios.put(
      `${API_URL}/delete-reviewreply/${id}`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(response?.data);
    return response.data;
  } catch (err) {
    throw err;
  }
};
const deleteReview = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/delete-review/${id}`, {
      withCredentials: true,
    });
    return response.data;
  } catch (err) {
    throw err;
  }
};

export {
  addReview,
  viewReview,
  sendReplyReview,
  updateReview,
  editReplyReview,
  deleteReplyReview,
  deleteReview,
};
