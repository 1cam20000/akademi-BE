import mongoose, { Schema } from "mongoose";

const subjectSchema = new Schema(
    {
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'teachers',
            required: [true, "teacher is required"],
        },

        name: {
            type: String,
            required: [true, "name is required"]
        },

    },
    {
        timestamps: true,
    }
);

const subjectModel = mongoose.model("subjects", subjectSchema);

export default subjectModel;