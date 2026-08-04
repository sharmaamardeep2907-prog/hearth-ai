import mongoose from "mongoose";
import { config } from "../config";

async function clean() {
  await mongoose.connect(config.mongodb.uri);
  await mongoose.connection.db?.dropDatabase();
  console.log("✅ Database dropped");
  await mongoose.disconnect();
  process.exit(0);
}
clean();