import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import User from "../model/user.model.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const ADMIN = {
  name: "Default Admin",
  email: "admin@example.com",
  id: "admin",
  password: "admin123",
  nic: "000000000V",
  dob: new Date("1990-01-01"),
  address: "N/A",
  phoneNumber: "0000000000",
  role: "admin",
};

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGOURL);
    console.log("MongoDB Connected!");

    const existing = await User.findOne({ email: ADMIN.email });

    if (existing) {
      console.log(
        `Admin already exists (email: ${existing.email}, id: ${existing.id}). Skipping seed.`
      );
      return;
    }

    const hashedPassword = bcrypt.hashSync(ADMIN.password, 9);

    await User.create({ ...ADMIN, password: hashedPassword });

    console.log(
      `Default admin created — email: ${ADMIN.email}, id: ${ADMIN.id}, password: ${ADMIN.password}`
    );
  } catch (error) {
    console.error("Failed to seed admin:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedAdmin();
