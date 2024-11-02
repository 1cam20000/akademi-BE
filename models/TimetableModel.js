import mongoose, { Schema } from "mongoose";

const timeTableSchema = new Schema(
  {
    className: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "classes",
      type: String,
      required: [true, "class is required"],
    },

    day: {
      type: String,
      required: [true, "day is required"],
    },
    time: {
      type: String,
      required: [true, "time is required"],
    },
    name: {
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'subjects',
      type: String,
      required: [true, "subject is required"],
    },
  },
  {
    timestamps: true,
  }
);

const TimeTableModel = mongoose.model("timetables", timeTableSchema);

export default TimeTableModel;
