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
  const { className } = req.body;

  try {
    const timeTableByClass = await TimeTableModel.find({ className });
    // console.log(
    //   "🚀 ~ getTimeTableByClass ~ timeTableByClass:",
    //   timeTableByClass
    // );

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
  const { className, day, time, name } = req.body;
  try {
    if (!className || !day || !time || !name) {
      throw new Error("Missing anything");
    }

    const existingClass = await ClassModel.findOne({ className });

    if (!existingClass) {
      throw new Error("Class not in valid");
    }

    const existingSubject = await subjectModel.findOne({ name });

    if (!existingSubject) {
      throw new Error("Subject not in valid");
    }

    const existingElement = await TimeTableModel.find({});

    existingElement.forEach((element) => {
      if (
        element.className === className &&
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
  try {
    // Tìm và xóa thời khóa biểu
    const timetable = await TimeTableModel.findOneAndDelete({
      _id: req.body.timetableId,
    });

    // Kiểm tra xem thời khóa biểu có tồn tại không
    if (!timetable) {
      return res.status(404).json({
        message: "Timetable not found",
      });
    }

    // Trả về thông tin thời khóa biểu đã xóa
    res.status(200).json({
      message: "Delete timetable successfully",
      data: timetable, // Thông tin thời khóa biểu đã xóa
    });
  } catch (error) {
    res.status(400).json({
      message: `Delete timetable controller error: ${error.message}`,
    });
  }
};

const updateTimeTable = async (req, res) => {
  try {
    const updatedTimetable = await TimeTableModel.findOneAndUpdate(
      { _id: req.body.timetableId },
      req.body.payload,
      { new: true } // Trả về tài liệu đã được cập nhật
    );

    if (!updatedTimetable) {
      return res.status(404).json({
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      message: "Update timetable's information successfully",
      data: updatedTimetable,
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
