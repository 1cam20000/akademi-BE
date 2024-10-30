// import ClassModel from "../models/ClassModel.js";
import { handleValidationError } from "../middlewares/errorHandler.js";
import SubjectModel from "../models/SubjectModel.js";

const getSubject = async (req, res) => {
  try {
    const subjectRecords = await SubjectModel.find().populate("name");
    res.status(200).json({
      success: true,
      subjectRecords,
    });
  } catch (error) {
    res.status(400).json({
      message: `Get subjects controller error: ${error.message}`,
    });
  }
};

const addSubject = async (req, res) => {
  const { subjectData } = req.body;

  try {
    if (
      !subjectData ||
      !Array.isArray(subjectData) ||
      subjectData.length === 0
    ) {
      handleValidationError("Subject data is missing or invalid!", 400);
      // handleValidationError("Attendance dat", 300);
    }
    const subjectRecords = await Promise.all(
      subjectData.map(async (record) => {
        const { teacher, name } = record;
        return await SubjectModel.create({ teacher, name });
      })
    );
    res.status(200).json({
      success: true,
      message: "Subject created successfully!",
      attendanceRecords: subjectRecords,
    });
  } catch (error) {
    res.status(400).json({
      message: `Add subject controller error: ${error.message}`,
    });
  }
};

const deleteSubject = async (req, res) => {
  try {
    await SubjectModel.findOneAndDelete({
      _id: req.body.subjectId,
    });

    res.status(201).json({
      message: "Delete subject successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: `Delete subject controller error: ${error.message}`,
    });
  }
};

export { getSubject, addSubject, deleteSubject };
