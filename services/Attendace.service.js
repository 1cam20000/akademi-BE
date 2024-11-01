import AttendanceModel from "../models/AttendanceModel.js";
import { handleValidationError } from "../middlewares/errorHandler.js";


//xem tkb
const getAttendance = async (req, res) => {
    try {
        const attendanceRecords = await AttendanceModel.find().populate('student');
        res.status(200).json({
            success: true,
            attendanceRecords
        });
    } catch (error) {
        res.status(400).json({
            message: `Get attendance controller error: ${error.message}`
        })
    }
}


//them tkb
const addAttendance = async (req, res) => {
    const { attendanceData } = req.body;

    try {
        if (!attendanceData || !Array.isArray(attendanceData) || attendanceData.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Attendance data is missing or invalid!",
            });
        }

        const attendanceRecords = await Promise.all(attendanceData.map(async (record) => {
            const { student, status } = record;
            return await AttendanceModel.create({ student, status });
        }));

        res.status(200).json({
            success: true,
            message: "Attendance marked successfully!",
            attendanceRecords
        });

    } catch (error) {
        res.status(400).json({
            message: `Add attendance controller error: ${error.message}`,
        });
    }
};



export { getAttendance, addAttendance }