const Uploads = require("../models/uploadModel");
// const fs = require("fs");
// const path = require("path");

let uploadInsert = async (req, res) => {
  try {
    const {
      resources,
      programmename,
      academicstructure,
      semestername,
      year,
      link,
    } = req.body;

    // Check for duplicates based on the 4 fields
    const duplicate = await Uploads.findOne({
      resources,
      programmename,
      semestername,
      year,
    });

    if (duplicate) {
      return res.status(409).json({
        success: 0,
        message: "Duplicate entry detected. Same data already exists.",
      });
    }

    let newUpload = new Uploads({
      userID: req.userid,
      resources,
      programmename,
      academicstructure,
      semestername,
      year,
      link,
    });

    await newUpload.save();
    res.status(201).json({
      success: 1,
      message: "Data uploaded successfully",
      data: newUpload,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to upload data", error: err.message });
  }
};

let uploadList = async (req, res) => {
  try {
    let allUpload = await Uploads.find().populate("userID", "username email");
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

let uploadDelete = async (req, res) => {
  try {
    const upload = await Uploads.findById(req.params.id);
    if (!upload) {
      return res
        .status(404)
        .json({ success: false, message: "Upload not found" });
    }

    // Remove from database
    await Uploads.deleteOne({ _id: req.params.id });

    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

let getSingleUpload = async (req, res) => {
  try {
    let userid = req.params.id;
    let upload = await Uploads.findOne({ _id: userid });
    res.status(200).json({
      success: 1,
      message: "Data fetched successfully.",
      data: upload,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch data",
      error: err.message,
    });
  }
};

let uploadUpdate = async (req, res) => {
  try {
    let uploadid = req.params.id;
    let {
      resources,
      programmename,
      academicstructure,
      semestername,
      year,
      link,
    } = req.body;
    let update = {
      resources,
      programmename,
      academicstructure,
      semestername,
      year,
      link,
    };
    let upload = await Uploads.updateOne({ _id: uploadid }, update);
    res
      .status(200)
      .json({ success: 1, message: "Data updated successfully", data: upload });
  } catch (err) {
    res.status(500).json({
      ssuccess: 0,
      message: "Failed to update data",
      error: err.message,
    });
  }
};

module.exports = {
  uploadInsert,
  uploadList,
  getSingleUpload,
  uploadUpdate,
  uploadDelete,
};
