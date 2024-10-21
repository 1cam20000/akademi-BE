import mongoose from "mongoose";

const StudentSchema = mongoose.Schema(
  {
    studentId: { type: String, required: true, unique: true },
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    dateOfBirth: String,
    parentName: String,
    phone: String,
    address: String,
    parentEmail: String,
    parentPhone: String,
    parentAddress: String,
    payment: String,
    studentTeacher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
      },
    ],
    classes: [
      {
        classId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Class",
        },
        className: { type: String, default: "Chưa xác định" },
        year: { type: String, default: "Chưa xác định" },
        grade: { type: Number, default: 0 },
      },
    ],

    isDelete: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const StudentModel = mongoose.model("Student", StudentSchema);

export { StudentModel, StudentSchema };
