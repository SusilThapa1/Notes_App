import axios from "axios";

const API_URL = import.meta.env.VITE_API_FILE_URL + "/uploads";

const fileUpload = async (file, type) => {
  try {
    if (!file) throw new Error("No file selected");
    if (!["images", "notes", "questions", "syllabus"].includes(type)) {
      throw new Error("Invalid upload type");
    }

    const formData = new FormData();
    formData.append(type, file);  

    const res = await axios.post(`${API_URL}/${type}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      withCredentials: true,
    });
    return res.data;  
  } catch (err) {
    console.error("fileUpload error:", err.message);
    throw err;
  }
};

export { fileUpload };
