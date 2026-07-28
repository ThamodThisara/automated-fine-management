import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import userRoutes from "./routes/user.route.js";
import vehicleRoutes from "./routes/vehicle.route.js";
import fineRoutes from "./routes/fine.route.js";
import messageRoutes from "./routes/message.route.js";
import violatioRoute from "./routes/violation.route.js";
import complainRoutes from "./routes/complain.route.js";
import stationRoutes from "./routes/station.route.js";
import notificationRoutes from "./routes/notification.route.js";
import activityRoutes from "./routes/activity.route.js";

import User from "./model/user.model.js";
import { app, server } from "./socket/socket.js";
import cron from "node-cron";
import { checkFinesAndSendEmails } from "./controllers/email.controller.js";
import payRoutes from "./routes/payment.route.js";
import { updateBlockedFines } from "./controllers/email.controller.js";
import { checkFinesAndSendReminder } from "./controllers/email.controller.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, ".env") });

// Auth cannot work without a signing secret — fail fast so it is never silently missing.
if (!process.env.JWT_SECRET) {
  console.error(
    "FATAL: JWT_SECRET is not set. Add JWT_SECRET to backend/.env before starting the server."
  );
  process.exit(1);
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("MongoDB Connected!");

    // The User.id index changed from a plain unique index to a sparse one (id is now
    // optional for drivers/admins). syncIndexes migrates an existing database's stale
    // index so new driver/admin documents without an id don't collide on a null key.
    // Best-effort: a failure here must not stop the server from starting.
    try {
      await User.syncIndexes();
    } catch (indexError) {
      console.error("User.syncIndexes() failed (non-fatal):", indexError.message);
    }
  } catch (error) {
    console.error("MongoDB Connection Failed!", error);
    process.exit(1);
  }
};

connectDB();

// Runs once daily at 09:00 to email fine notices/reminders and block overdue fines.
cron.schedule("0 9 * * *", async () => {
  console.log("Running daily fine cron job...");
  await updateBlockedFines();
  await checkFinesAndSendEmails();
  await checkFinesAndSendReminder();
});

//const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

//routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/vehicle", vehicleRoutes);
app.use("/api/v1/fine", fineRoutes);
app.use("/api/v1/message", messageRoutes);
app.use("/api/v1/violation", violatioRoute);
app.use("/api/pay", payRoutes);
app.use("/api/v1/complain", complainRoutes);
app.use("/api/v1/station", stationRoutes);
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
