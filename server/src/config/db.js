import mongoose from "mongoose";

export async function connectDatabase() {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGODB || process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error("MongoDB URI is not set. Use MONGODB_URI (or MONGODB/MONGO_URI).");
  }

  mongoose.set("strictQuery", true);

  await mongoose.connect(mongoUri, {
    dbName: process.env.MONGODB_DB_NAME || undefined,
  });

  console.log("MongoDB connected");
}

export default connectDatabase;
