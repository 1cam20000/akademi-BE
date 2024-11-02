import mongoose, { Schema } from "mongoose";

const classSchema = new Schema(
  {
    className: {
      type: String,
      required: [true, "Grade is required"],
      unique: true,
    },
    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: [true, "Teacher is required"],
    },
    students: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
      },
    ],
    isDelete: {
      type: Boolean,
      default: false,
    },
    grade: {
      type: String,
      default: "ungraded",
    },
  },
  {
    timestamps: true,
  }
);

const ClassModel = mongoose.model("Class", classSchema);

export { ClassModel };
