const semesters = require("../models/semesterModel");
let semesterInsert = async (req, res) => {
  try {
    const { semesternames, programmename } = req.body;

    if (
      !semesternames ||
      !Array.isArray(semesternames) ||
      semesternames.length === 0
    ) {
      return res.status(400).json({
        success: 0,
        message: "Please provide a list of semester names.",
      });
    }

    // Check if semesters already exist in the given programme
    const existingsemesters = await semesters.find({
      semestername: { $in: semesternames },
      programmename,
    });
    console.log(existingsemesters);
    const existingsemesterNames = existingsemesters.map(
      (semester) => semester.semestername
    );
    console.log(existingsemesterNames);

    const newsemesters = semesternames.filter(
      (name) => !existingsemesterNames.includes(name)
    );
    if (newsemesters.length === 0) {
      return res.status(400).json({
        success: 0,
        message: "All semesters already exist in this programme.",
      });
    }

    // Insert only new semesters
    const semestersToAdd = newsemesters.map((semestername) => ({
      semestername,
      programmename,
    }));

    await semesters.insertMany(semestersToAdd);

    res.status(201).json({
      success: 1,
      message: "semesters added successfully.",
      data: semestersToAdd,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to add semesters.",
      error: err.message,
    });
  }
};

let semesterList = async (req, res) => {
  try {
    let allsemester = await semesters.find();

    res
      .status(200)
      .json({ success: 1, message: "semester List", data: allsemester });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch semesters",
      error: err.message,
    });
  }
};

let semesterDelete = async (req, res) => {
  const semesterid = req.params.id;
  try {
    let semester = await semesters.deleteOne({ _id: semesterid });
    res.status(200).json({
      success: 1,
      message: "semester deleted successfully.",
      data: semester,
    });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to delete semester.",
      error: err.message,
    });
  }
};

let semesterSingle = async (req, res) => {
  try {
    let semesterid = req.params.id;
    let semester = await semesters.find({ _id: semesterid });

    res
      .status(200)
      .json({ success: 1, message: "semester fetched.", data: semester });
  } catch (err) {
    res.status(500).json({
      success: 0,
      message: "Failed to fetch semester.",
      error: err.message,
    });
  }
};

let semesterUpdate = async (req, res) => {
  let semesterid = req.params.id;
  try {
    const { semesternames, programmename } = req.body;

    if (!Array.isArray(semesternames)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid data format" });
    }

    // Loop through each semestername and update individually
    for (const name of semesternames) {
      await semesters.findByIdAndUpdate(semesterid, {
        semestername: name,
        programmename,
      });
    }

    res
      .status(200)
      .json({ success: true, message: "semesters updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  semesterInsert,
  semesterList,
  semesterSingle,
  semesterUpdate,
  semesterDelete,
};
