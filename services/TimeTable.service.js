import { ClassModel } from "../models/Class.model.js";
import subjectModel from "../models/SubjectModel.js";
import TimeTableModel from "../models/TimetableModel.js";

const getAllTimeTables = async (req, res) => {
  try {
    const allTimeTables = await TimeTableModel.find({});

    res.status(200).json({
      message: "Get all timetables successfully ",
      data: allTimeTables,
    });
  } catch (error) {
    res.status(400).json({
      message: `Get all Timetables controller error: ${error.message}`,
    });
  }
};

const getTimeTableByClass = async (req, res) => {
  const { grade } = req.body;

  try {
    const timeTableByClass = await TimeTableModel.find({ grade });

    res.status(200).json({
      message: `Get timetable of class successfully`,
      data: timeTableByClass,
    });
  } catch (error) {
    res.status(400).json({
      message: `Get all Timetables controller error: ${error.message}`,
    });
  }
};

const addTimeTable = async (req, res) => {
  const { grade, day, time, name } = req.body;

  try {
    if (!grade || !day || !time || !name) {
      throw new Error("Missing anything");
    }

    const existingClass = await ClassModel.findOne({ grade });

    if (!existingClass) {
      throw new Error("Class not in valid");
    }

    const existingSubject = await subjectModel.findOne({ name });

    if (!existingSubject) {
      throw new Error("Subject not in valid");
    }

    const existingElement = await TimeTableModel.find({});
    // console.log(existingElement.grade);
    // console.log(existingElement.day);
    // console.log(existingElement.time);

    existingElement.forEach((element) => {
      if (
        element.grade === grade &&
        element.day === day &&
        element.time === time
      ) {
        throw new Error("Data not valid because duplicating");
      }
    });

    const newTimetable = new TimeTableModel(req.body);
    await newTimetable.save();
    res.status(201).json({
      message: "Add new timetable successfully!",
      data: {
        _id: newTimetable._id,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: `Add subject controller error: ${error.message}`,
    });
  }
};

const deleteTimeTable = async (req, res) => {
  // const { id } = req.params

  try {
    const timetable = await TimeTableModel.findOneAndDelete({
      _id: req.body.timetableId,
    });
    res.status(201).json({
      message: "Delete timetable successfully",
    });

    // if (timetable) {
    //     await timetable.destroy();
    //     res.status(201).json({
    //         message: "Delete timetable successfully"
    //     })
    // }

    // else {
    //     res.status(401).json({
    //         message: "Delete timetable failed"
    //     })
    // }
  } catch (error) {
    res.status(400).json({
      message: `Delete timetable controller error: ${error.message}`,
    });
  }
};

const updateTimeTable = async (req, res) => {
  // const { class_id, day, time, subject } = req.body

  try {
    await TimeTableModel.findOneAndUpdate(
      {
        _id: req.body.timetableId,
      },
      req.body.payload
    );
    res.status(201).json({
      message: "Update timetable's information successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: `Update timetable controller error: ${error.message}`,
    });
  }
};

export {
  getAllTimeTables,
  getTimeTableByClass,
  addTimeTable,
  deleteTimeTable,
  updateTimeTable,
};
