import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Admins are identified by their MongoDB _id, so no human-readable id is set here.
const ADMIN = {
  name: "Admin",
  email: "admin@example.com",
  password: "admin@123",
  nic: "992322900V",
  dob: new Date("1999-08-19"),
  address: "Kadawatha",
  phoneNumber: "0768583077",
  role: "admin",
  pStation: "Central",
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("MongoDB Connected!");

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      console.log(
        `Admin already exists (email: ${existing.email}). Skipping seed.`
      );
      return;
    }

    const hashedPassword = bcrypt.hashSync(ADMIN.password, 9);

    await User.create({ ...ADMIN, password: hashedPassword });

    console.log(
      `Default admin created — email: ${ADMIN.email}, password: ${ADMIN.password}`
    );
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
