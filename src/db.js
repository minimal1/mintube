/** @format */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

mongoose.connect(process.env.MONGO_URL_PROD, {
  useNewUrlParser: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

const handleError = (error) =>
  console.log(`❌ Error on DB Connection: ${error}`);
const handleOpen = () => console.log(`✅ Connected to DB`);

db.once("open", handleOpen);
db.on("error", handleError);
