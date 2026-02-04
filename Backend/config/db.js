import mongoose from "mongoose";

const connect = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => console.log("Mongo Error:", err));
};

export default connect;
