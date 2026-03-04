import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
  mongoose.set("strictQuery", true);

  if (isConnected) {
    return;
  }

  // Check if already connected via mongoose
  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI_OLD, {
      dbName: "travel_users",
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    isConnected = true;
    console.log("MongoDB is connected successfully");
  } catch (err) {
    console.error("Error connecting to MongoDB:", err.message);
    throw err;
  }
};
