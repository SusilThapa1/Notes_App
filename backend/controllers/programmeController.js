const Programmes = require("../models/programmeModel");
const { deleteFile } = require("../Utils/fileHelper");
const { logAction } = require("../Utils/activityLog");

// ======================== CREATE ===========================
const programmeInsert = async (req, res) => {
  try {
    const {
      programmefullname,
      programmeshortname,
      academicstructure,
      imagename,
      imagepath,
    } = req.body;

    if (!imagename || !imagepath) {
      return res
        .status(400)
        .json({ success: 0, message: "Image details are missing." });
    }

    //  Check duplicate fullname
    const existingFull = await Programmes.findOne({ programmefullname });
    if (existingFull) {
      return res
        .status(400)
        .json({ success: 0, message: "Programme fullname already exists." });
    }

    //  Check duplicate shortname
    const existingShort = await Programmes.findOne({ programmeshortname });
    if (existingShort) {
      return res
        .status(400)
        .json({ success: 0, message: "Programme shortname already exists." });
    }

    const programme = new Programmes({
      imagename,
      imagepath,
      programmefullname,
      programmeshortname,
      academicstructure,
    });

    await programme.save();

    await logAction({
      user: req.user,
      action: "create_programme",
      details: { programmeId: programme._id, programmefullname },
      req,
    });

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

// ======================== READ (List) ===========================
const programmeList = async (req, res) => {
  try {
    const allprogramme = await Programmes.find();

    await logAction({
      user: req.user,
      action: "list_programmes",
      details: { count: allprogramme.length },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "Programme list fetched.",
      data: allprogramme,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch programmes.",
      error: err.message,
    });
  }
};

// ======================== READ (Single) ===========================
const programmeSingle = async (req, res) => {
  try {
    const programmeid = req.params.id;
    const programme = await Programmes.findById(programmeid);

    if (!programme) {
      return res.status(404).json({
        success: 0,
        message: "Programme not found.",
      });
    }

    await logAction({
      user: req.user,
      action: "fetch_programme",
      details: { programmeId: programmeid },
      req,
    });

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

// ======================== UPDATE ===========================
const programmeUpdate = async (req, res) => {
  const programmeid = req.params.id;

  try {
    const {
      programmefullname,
      programmeshortname,
      academicstructure,
      imagename,
      imagepath,
    } = req.body;

    const existingProgramme = await Programmes.findById(programmeid);
    if (!existingProgramme) {
      return res
        .status(404)
        .json({ success: 0, message: "Programme not found." });
    }

    // Prepare update object
    const update = {
      programmefullname,
      programmeshortname,
      academicstructure,
    };


    //  If new image provided, delete old and update new
    if (imagepath && imagename) {
      console.log("imagepath:",imagepath, "imagename:",imagename)
      if (existingProgramme.imagepath) {
        const oldFilename = existingProgramme.imagepath.split("/").pop();
        const relativePath = `uploads/images/${oldFilename}`;
        deleteFile(relativePath);
      }

      update.imagename = imagename;
      update.imagepath = imagepath;
    }

    const updatedProgramme = await Programmes.updateOne(
      { _id: programmeid },
      update
    );

    await logAction({
      user: req.user,
      action: "update_programme",
      details: { programmeId: programmeid, update },
      req,
    });

    res.status(200).json({
      success: 1,
      message: "Programme updated successfully.",
      data: updatedProgramme,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to update programme.",
      error: err.message,
    });
  }
};

// ======================== DELETE ===========================
const programmeDelete = async (req, res) => {
  const programmeid = req.params.id;

  try {
    const existingProgramme = await Programmes.findById(programmeid);
    if (!existingProgramme) {
      return res.status(404).json({
        success: 0,
        message: "Programme not found.",
      });
    }

    //  Delete image
    if (existingProgramme.imagepath) {
      const relativePath = `uploads/images/${existingProgramme.imagepath
        .split("/")
        .pop()}`;
      deleteFile(relativePath);
    }

    await Programmes.deleteOne({ _id: programmeid });

    await logAction({
      user: req.user,
      action: "delete_programme",
      details: {
        programmeId: programmeid,
        programmefullname: existingProgramme.programmefullname,
      },
      req,
    });

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

module.exports = {
  programmeInsert,
  programmeList,
  programmeSingle,
  programmeUpdate,
  programmeDelete,
};
