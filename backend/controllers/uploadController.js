const Uploads = require("../models/uploadModel");
const { deleteFile } = require("../Utils/fileHelper");

// Insert new upload
let uploadInsert = async (req, res) => {
  try {
    const {
      university,
      resources,
      programme,
      courseCode,
      courseName,
      year,
      semyear,
      filename,
      filepath,
      isVerified,
    } = req.body;

    // Required checks
    if (!university || !resources || !programme || !semyear) {
      return res.status(400).json({
        success: 0,
        message: "All fields must be filled",
      });
    }

    // Conditional fields for syllabus/notes
    if (resources !== "questions" && (!courseCode || !courseName)) {
      return res.status(400).json({
        success: 0,
        message: "Course code and name are required for this resource type",
      });
    }

    // Conditional field for questions
    if (resources === "questions" && !year) {
      return res.status(400).json({
        success: 0,
        message: "Year is required for questions",
      });
    }

    if (!filename || !filepath) {
      return res
        .status(400)
        .json({ success: 0, message: "File details are missing." });
    }

    const newUpload = new Uploads({
      userID: req.userid,
      universityID: university,
      resources,
      programmeID: programme,
      courseCode: courseCode || "",
      courseName: courseName || "",
      year: year || "",
      semyear,
      filename,
      filepath,
      isVerified,
    });

    await newUpload.save();

    res.status(201).json({
      success: 1,
      message: "Data uploaded successfully",
      data: newUpload,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to upload data",
      error: err.message,
    });
  }
};

// List all uploads
let uploadList = async (req, res) => {
  try {
    const allUpload = await Uploads.find()
      .populate("userID", "username email profilepath")
      .populate("programmeID")
      .populate("universityID");
    res
      .status(200)
      .json({ success: 1, message: "Upload List", data: allUpload });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch uploads",
      error: err.message,
    });
  }
};

// Get a single upload
let getSingleUpload = async (req, res) => {
  try {
    const upload = await Uploads.find({ userID: req.userid })
      .populate("userID", "username email profilepath")
      .populate("programmeID")
      .populate("universityID");
    if (!upload)
      return res.status(404).json({ success: 0, message: "Upload not found" });

    res
      .status(200)
      .json({ success: 1, message: "Data fetched successfully", data: upload });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch data",
      error: err.message,
    });
  }
};

// Update an upload
let uploadUpdate = async (req, res) => {
  try {
    const uploadid = req.params.id;
    const {
      university,
      resources,
      programme,
      courseCode,
      courseName,
      year,
      semyear,
      filename,
      filepath,
      isVerified,
    } = req.body;

    const update = {
      universityID: university,
      resources,
      programmeID: programme,
      courseCode,
      courseName,
      year,
      semyear,
      filename,
      filepath,
      isVerified,
    };

    const existingUpload = await Uploads.findById(uploadid);
    if (!existingUpload) {
      return res.status(404).json({ success: 0, message: "Upload not found" });
    }

    // Step 2: Delete old file if new one is uploaded
    if (filepath && filename) {
      if (existingUpload.filepath) {
        const oldFilename = existingUpload.filepath.split("/").pop();
        const relativePath = `uploads/resources/${oldFilename}`;
        deleteFile(relativePath);
      }
    }

    const updatedUpload = await Uploads.findByIdAndUpdate(uploadid, update, {
      new: true,
    });

    if (!updatedUpload)
      return res.status(404).json({ success: 0, message: "Upload not found" });

    res.status(200).json({
      success: 1,
      message: "Data updated successfully",
      data: updatedUpload,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to update data",
      error: err.message,
    });
  }
};

// Delete a specific upload
let uploadDelete = async (req, res) => {
  try {
    const upload = await Uploads.findById(req.params.id);
    if (!upload) {
      return res.status(404).json({ success: 0, message: "Upload not found" });
    }

    if (upload.filepath) {
      const relativePath = `uploads/${upload.resources}/${upload.filepath
        .split("/")
        .pop()}`;
      deleteFile(relativePath);
    }

    await Uploads.deleteOne({ _id: req.params.id });

    res.status(200).json({ success: 1, message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

const likes = async (req, res) => {
  const { id } = req.params;
  const userid = req.userid;
  try {
    const upload = await Uploads.findById(id);
    if (!upload) {
      return res.status(404).json({ success: 0, message: "File not found" });
    }

    if (upload.likes.includes(userid)) {
      upload.likes.pull(userid);
    } else {
      upload.likes.push(userid);
      upload.dislikes.pull(userid);
    }

    await upload.save();
    res
      .status(200)
      .json({ likes: upload.likes.length, dislikes: upload.dislikes.length });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};
const disLikes = async (req, res) => {
  const { id } = req.params;
  const userid = req.userid;
  try {
    const upload = await Uploads.findById(id);
    if (!upload) {
      return res.status(404).json({ success: 0, message: "File not found" });
    }

    if (upload.dislikes.includes(userid)) {
      upload.dislikes.pull(userid);
    } else {
      upload.dislikes.push(userid);
      upload.likes.pull(userid);
    }
    await upload.save();
    res
      .status(200)
      .json({ likes: upload.likes.length, dislikes: upload.dislikes.length });
  } catch (err) {
    res.status(500).json({ success: 0, message: err.message });
  }
};

module.exports = {
  uploadInsert,
  uploadList,
  getSingleUpload,
  uploadUpdate,
  uploadDelete,
  likes,
  disLikes,
};
