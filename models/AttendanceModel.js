import mongoose, { Schema } from "mongoose";

const attendanceSchema = new Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: [true, "attendance is required"],
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "Absent without reason"],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const AttendanceModel = mongoose.model("attendances", attendanceSchema);

export default AttendanceModel;
