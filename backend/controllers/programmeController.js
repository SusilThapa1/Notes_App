const Programmes = require("../models/programmeModel");
const { deleteFile } = require("../Utils/fileHelper");
const programmeInsert = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(400)
        .json({ success: 0, message: "No image file uploaded" });
    }

    const { programmefullname, programmeshortname, academicstructure } =
      req.body;

    // Check if programme fullname already exists
    const existingProgrammeFullname = await Programmes.findOne({
      programmefullname,
    });
    if (existingProgrammeFullname) {
      return res
        .status(400)
        .json({ success: 0, message: "Programme fullname already exists." });
    }

    // Check if programme shortname already exists
    const existingProgrammeShortname = await Programmes.findOne({
      programmeshortname,
    });
    if (existingProgrammeShortname) {
      return res
        .status(400)
        .json({ success: 0, message: "Programme shortname already exists." });
    }

    const imagepath = `${process.env.SERVER_BASE_URL}/uploads/images/${req.file.filename}`;

    const programme = new Programmes({
      // image: req.file.path,
      imagename: req.file.originalname,
      imagepath: imagepath,
      programmefullname,
      programmeshortname,
      academicstructure,
    });

    await programme.save();
    res.status(201).json({
      success: 1,
      message: "Programme added successfully.",
      data: programme,
    });
  } catch (err) {
    res.status(400).json({
      success: 0,
      message: "Failed to add programme.",
      error: err.message,
    });
  }
};

const programmeList = async (req, res) => {
  try {
    const allprogramme = await Programmes.find();
    res
      .status(200)
      .json({ success: 1, message: "Programme List", data: allprogramme });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch programmes",
      error: err.message,
    });
  }
};

const programmeDelete = async (req, res) => {
  const programmeid = req.params.id;

  try {
    // First fetch the programme to get the image path
    const existingProgramme = await Programmes.findById(programmeid);
    if (!existingProgramme) {
      return res.status(404).json({
        success: 0,
        message: "Programme not found.",
      });
    }

    // Delete the image using imagepath
    if (existingProgramme.imagepath) {
      const relativePath = `uploads/images/${existingProgramme.imagepath
        .split("/")
        .pop()}`;
      deleteFile(relativePath);
    }

    // Now delete the DB record
    await Programmes.deleteOne({ _id: programmeid });

    res.status(200).json({
      success: 1,
      message: "Programme deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to delete programme.",
      error: err.message,
    });
  }
};

const programmeSingle = async (req, res) => {
  try {
    const programmeid = req.params.id;
    const programme = await Programmes.findById({ _id: programmeid });
    if (!programme) {
      return res.status(404).json({
        success: 0,
        message: "Programme not found.",
      });
    }
    res.status(200).json({
      success: 1,
      message: "Programme fetched.",
      data: programme,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch programme.",
      error: err.message,
    });
  }
};

const programmeUpdate = async (req, res) => {
  const programmeid = req.params.id;

  try {
    const { programmefullname, programmeshortname, academicstructure } =
      req.body;

    const existingProgramme = await Programmes.findById(programmeid);
    if (!existingProgramme) {
      return res
        .status(404)
        .json({ success: 0, message: "Programme not found" });
    }

    const update = {
      programmefullname,
      programmeshortname,
      academicstructure,
    };

    if (req.file) {
      // Delete old image using imagepath
      if (existingProgramme.imagepath) {
        const oldFilename = existingProgramme.imagepath.split("/").pop();
        const relativePath = `uploads/images/${oldFilename}`;
        deleteFile(relativePath);
      }

      update.imagename = req.file.originalname;
      update.imagepath = `${process.env.SERVER_BASE_URL}/uploads/images/${req.file.filename}`;
    }

    const updatedProgramme = await Programmes.updateOne(
      { _id: programmeid },
      update
    );

    res.status(200).json({
      success: 1,
      message: "Updated successfully",
      data: updatedProgramme,
    });
  } catch (err) {
    // Clean up uploaded image if DB update fails
    if (req.file && req.file.path) {
      deleteFile(req.file.path);
    }

    res.status(500).json({
      success: 0,
      message: "Failed to update programme.",
      error: err.message,
    });
  }
};

module.exports = {
  programmeInsert,
  programmeList,
  programmeSingle,
  programmeUpdate,
  programmeDelete,
};
