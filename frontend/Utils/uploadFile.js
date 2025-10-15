import { toast } from "react-toastify";
import { fileUpload } from "../Services/fileUploadService";

  const uploadFile = async (file,type) => {
  if (!file) return "File not found";
  try {
    const res = await fileUpload( file,type);
    if (res.success) {
      return res.data; // contains fileUrl & imageName
    } else {
      toast.error(res?.message);
    }
  } catch (err) {
    toast.error("File upload failed: " + err.message);
    return err;
  }
};

export {uploadFile}