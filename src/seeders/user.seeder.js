import dotenv from "dotenv";
dotenv.config();

import connectDB from "../config/db.js";
import User from "../models/User.js";
const users = [
  {
    name: "User",
    email: "user@example.com",
    password: "password123",
  },
  {
    name: "Admin",
    email: "admin@example.com",
    password: "adminpassword123",
  },
];

const seedUsers = async () => {
  try {
    await connectDB();
    await User.deleteMany({});
    await User.insertMany(users);
    console.log("Users seeded successfully");
    process.exit();
  } catch (error) {
    console.error("Error seeding users:", error);
    process.exit(1);
  }
};

seedUsers();
