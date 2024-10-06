import mongoose from "mongoose";

const TeacherSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    firstName: String,
    lastName: String,
    phone: String,
    address: String,
    photo: String,
    dateOfBirth: String,
    placeOfBirth: String,
    university: String,
    degree: String,
    startEndDate: String,
    city: String,
    teacherStudent: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "student",
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const TeacherModel = mongoose.model("teacher", TeacherSchema);

export { TeacherModel, TeacherSchema };
