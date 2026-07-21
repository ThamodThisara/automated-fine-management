// MongoDB helpers for integration tests. Connects to a DEDICATED local test database
// (automated-fine-management-test), never the real app database, so seeding and clearing
// can never affect real data.

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import User from "../../model/user.model.js";

const TEST_DB_URL =
  process.env.MONGO_TEST_URL ||
  "mongodb://127.0.0.1:27017/automated-fine-management-test";

export const connectTestDB = async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(TEST_DB_URL);
  }
};

export const clearDB = async () => {
  const collections = mongoose.connection.collections;
  for (const key of Object.keys(collections)) {
    await collections[key].deleteMany({});
  }
};

export const disconnectTestDB = async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

// Plain-text credentials the tests use to log in (passwords are hashed on the way into DB).
export const SEED_CREDENTIALS = {
  admin: { email: "admin@test.local", id: "ADM-001", password: "Admin@123" },
  officer: { email: "officer@test.local", id: "OFF-001", password: "Officer@123" },
  driver: { email: "driver@test.local", id: "DRV-001", password: "Driver@123" },
};

// Inserts one admin, one officer and one driver. Returns the created user documents.
export const seedUsers = async () => {
  const base = {
    nic: "990000000V",
    dob: new Date("1999-01-01"),
    address: "123 Test Street",
    phoneNumber: "0770000000",
  };

  const admin = await User.create({
    ...base,
    name: "Test Admin",
    email: SEED_CREDENTIALS.admin.email,
    id: SEED_CREDENTIALS.admin.id,
    password: bcrypt.hashSync(SEED_CREDENTIALS.admin.password, 9),
    role: "admin",
    pStation: "Central",
  });

  const officer = await User.create({
    ...base,
    name: "Test Officer",
    email: SEED_CREDENTIALS.officer.email,
    id: SEED_CREDENTIALS.officer.id,
    password: bcrypt.hashSync(SEED_CREDENTIALS.officer.password, 9),
    role: "officer",
    pStation: "Central",
  });

  const driver = await User.create({
    ...base,
    name: "Test Driver",
    email: SEED_CREDENTIALS.driver.email,
    id: SEED_CREDENTIALS.driver.id,
    password: bcrypt.hashSync(SEED_CREDENTIALS.driver.password, 9),
    role: "driver",
    vType: "Car",
    model: "Toyota Axio",
  });

  return { admin, officer, driver };
};
