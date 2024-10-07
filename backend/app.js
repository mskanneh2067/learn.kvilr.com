import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user/User.js";
import authRoute from "./routes/auth/Auth.js";
// import gigRoute from "./routes/gig.route.js";
// import orderRoute from "./routes/order.route.js";
// import conversationRoute from "./routes/conversation.route.js";
// import messageRoute from "./routes/message.route.js";
// import reviewRoute from "./routes/review.route.js";


//Configurations
const app = express();
dotenv.config();

const Port = process.env.PORT




//Database
const connect = async () => {
  try {
    await mongoose.connect(process.env.mongoDB);
    console.log(`3. Backend Server is connected to MongoDB successfully!`);
  } catch (error) {
    throw error;
  }
};

mongoose.connection.on("connected", () => {
  console.log(
    "2. Backend Server has successfuly initiated connection to MongoDB!"
  );
});

//Middlewares
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users",userRoute);
app.use("/api/auths",authRoute);


app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong!";

  return res.status(errorStatus).send(errorMessage);
});


////Backend Server Connection Here
app.listen(Port, () => {
  connect();
  console.log(`1. Application has successfully started on port: ${Port}`);
});
