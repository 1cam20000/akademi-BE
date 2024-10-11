import { ClassModel } from "../models/Class.model.js";

const getAllClasses = async (req, res) => {
  try {
    // const body = res.body;
    // console.log(body);
    const allClasses = await ClassModel.find({});

    res.status(200).json({
      message: "Get all classes successfully ",
      data: allClasses,
    });

    console.log(allClasses);
  } catch (error) {
    res.status(400).json({
      message: `Get classes controller error: ${error.message}`,
    });
  }
};

const addClasses = async (req, res) => {
  const { grade } = req.body;

  try {
    if (!grade) {
      throw new Error("Please fill class name");
    }

    const existingClass = await ClassModel.findOne({ grade });

    if (existingClass) {
      throw new Error("Class is already added");
    }

    const newClass = new ClassModel(req.body);
    await newClass.save();
    res.status(201).json({
      message: "Add new class successfully!",
      data: {
        _id: newClass._id,
      },
    });
  } catch (error) {
    res.status(400).json({
      message: `Add class controller error: ${error.message}`,
    });
  }
};

const deleteClasses = async (req, res) => {
  try {
    await ClassModel.findOneAndDelete({
      _id: req.body.classId,
    });

    // const result = await StudentModel.findByIdAndDelete(req.params.id)

    res.status(201).json({
      message: "Delete class successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: `Delete class controller error: ${error.message}`,
    });
  }
};

export { getAllClasses, addClasses, deleteClasses };
