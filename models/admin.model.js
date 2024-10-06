import mongoose from "mongoose";

const AdminSchema = mongoose.Schema(
  {
    email: String,
    password: String,
    teacher: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "teacher",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const AdminModel = mongoose.model("admin", AdminSchema);

export { AdminModel, AdminSchema };
