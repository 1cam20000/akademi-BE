import mongoose, { Schema } from "mongoose";

const TeacherSchema = new Schema(
  {
    teacherId: {
      type: String,
      required: true,
      unique: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true, 
    },
    firstName: {
      type: String,
      required: true, 
    },
    lastName: {
      type: String,
      required: true, 
    },
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
        ref: "Student", 
      },
    ],
    teacherClass: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class", 
      },
    ],
  },
  {
    timestamps: true, 
  }
);

const TeacherModel = mongoose.model("Teacher", TeacherSchema); 

export { TeacherModel, TeacherSchema };
