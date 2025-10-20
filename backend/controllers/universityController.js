const Universities = require("../models/universityModel");
const { deleteFile } = require("../Utils/fileHelper");
const { logAction } = require("../Utils/activityLog");

// ======================== CREATE ===========================
const universityInsert = async (req, res) => {
  console.log("first:", req.body);
  try {
    const { universityfullname, universityshortname, imagename, imagepath } =
      req.body;

    if (!imagename || !imagepath) {
      return res
        .status(400)
        .json({ success: 0, message: "Image details are missing." });
    }

    // Check for duplicate fullname
    const existingFull = await Universities.findOne({ universityfullname });
    if (existingFull) {
      return res
        .status(400)
        .json({ success: 0, message: "University fullname already exists." });
    }

    // Check for duplicate shortname
    const existingShort = await Universities.findOne({ universityshortname });
    if (existingShort) {
      return res
        .status(400)
        .json({ success: 0, message: "University shortname already exists." });
    }
    console.log("Existing fullname:", existingFull);
    console.log("Existing shortname:", existingShort);

    const university = new Universities({
      imagename,
      imagepath,
      universityfullname,
      universityshortname,
    });

    await university.save();

    await logAction({
      user: req.user,
      action: "create_university",
      details: { universityId: university._id, universityfullname },
      req,
    });

    res.status(201).json({
      success: 1,
      message: "University added successfully.",
      data: university,
    });
  } catch (err) {
    res.status(400).json({
      success: 0,
      message: "Failed to add university.",
      error: err.message,
    });
  }
};

// ======================== READ (List) ===========================
const universityList = async (req, res) => {
  try {
    const alluniversities = await Universities.find();

    await logAction({
      user: req.user,
      action: "list_universities",
      details: { count: alluniversities.length },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "University list fetched.",
      data: alluniversities,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch universities.",
      error: err.message,
    });
  }
};

// ======================== READ (Single) ===========================
const universitySingle = async (req, res) => {
  try {
    const universityid = req.params.id;
    const university = await Universities.findById(universityid);

    if (!university) {
      return res.status(404).json({
        success: 0,
        message: "University not found.",
      });
    }

    await logAction({
      user: req.user,
      action: "fetch_university",
      details: { universityId: universityid },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "University fetched successfully.",
      data: university,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch university.",
      error: err.message,
    });
  }
};

// ======================== UPDATE ===========================
const universityUpdate = async (req, res) => {
  const universityid = req.params.id;

  try {
    const { universityfullname, universityshortname, imagename, imagepath } =
      req.body;

    const existingUniversity = await Universities.findById(universityid);
    if (!existingUniversity) {
      return res
        .status(404)
        .json({ success: 0, message: "University not found." });
    }

    // Prepare update object
    const update = {
      universityfullname,
      universityshortname,
    };

    // If new image provided, delete old and update new
    if (imagepath && imagename) {
      if (existingUniversity.imagepath) {
        const oldFilename = existingUniversity.imagepath.split("/").pop();
        const relativePath = `uploads/images/${oldFilename}`;
        deleteFile(relativePath);
      }

      update.imagename = imagename;
      update.imagepath = imagepath;
    }

    const updatedUniversity = await Universities.updateOne(
      { _id: universityid },
      update
    );

    await logAction({
      user: req.user,
      action: "update_university",
      details: { universityId: universityid, update },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "University updated successfully.",
      data: updatedUniversity,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to update university.",
      error: err.message,
    });
  }
};

// ======================== DELETE ===========================
const universityDelete = async (req, res) => {
  const universityid = req.params.id;

  try {
    const existingUniversity = await Universities.findById(universityid);
    if (!existingUniversity) {
      return res.status(404).json({
        success: 0,
        message: "University not found.",
      });
    }

    // Delete image
    if (existingUniversity.imagepath) {
      const relativePath = `uploads/images/${existingUniversity.imagepath
        .split("/")
        .pop()}`;
      deleteFile(relativePath);
    }

    await Universities.deleteOne({ _id: universityid });

    await logAction({
      user: req.user,
      action: "delete_university",
      details: {
        universityId: universityid,
        universityfullname: existingUniversity.universityfullname,
      },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "University deleted successfully.",
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to delete university.",
      error: err.message,
    });
  }
};

module.exports = {
  universityInsert,
  universityList,
  universitySingle,
  universityUpdate,
  universityDelete,
};
