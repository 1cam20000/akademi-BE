import mongoose from "mongoose";

const connectMongodb = async () => {
  mongoose
    .connect(
      "mongodb+srv://cananhminh:Anhminhcam89@cluster0.0vaoaea.mongodb.net/akademi"
    )
    .then(() => console.log(`🚀 ~ connected successful to mongodb !`))
    .catch((err) => console.log("🚀 ~ error: ", err));
};

export { connectMongodb };
