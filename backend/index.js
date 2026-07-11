import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import fineRoutes from "./routes/fine.route.js";
import messageRoutes from "./routes/message.route.js";
import violatioRoute from "./routes/violation.route.js";
import complainRoutes from "./routes/complain.route.js";
import stativRoutes from "./routes/staticvalue.route.js";
import notificationRoutes from "./routes/notification.route.js";
import activityRoutes from "./routes/activity.route.js";

import { app, server } from "./socket/socket.js";
import cron from "node-cron";
import { checkFinesAndSendEmails } from "./controllers/email.controller.js";
import payRoutes from "./routes/payment.route.js";
import { updateBlockedFines } from "./controllers/email.controller.js";
import { checkFinesAndSendReminder } from "./controllers/email.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB Connected!");
  } catch (error) {
    console.error("MongoDB Connection Failed!", error);
    process.exit(1);
  }
};

connectDB();

// Runs once daily at 09:00 to email fine notices/reminders and block overdue fines.
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily fine cron job...");
  await checkFinesAndSendEmails();
  await updateBlockedFines();
  await checkFinesAndSendReminder();
});

//const app = express();

app.use(express.json());

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/fine", fineRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/violation", violatioRoute);
app.use("/api/pay", payRoutes);
app.use("/api/v1/complain", complainRoutes);
app.use("/api/v1/static", stativRoutes);
app.use("/api/v1/notification", notificationRoutes);
app.use("/api/v1/activity", activityRoutes);

server.listen(3000, () => {
  console.log("Server is running on port 3000!");
});

// npm i bcryptjs dotenv mongoose
// npm i flowbite-react react-router-dom

//handle middleware errors
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
