import express from "express";
import fileUpload from "express-fileupload";
import Dotenv from "dotenv";
import connectDB from "./db/connect";
import embeddedRouter from "./router/embedding";
import cors from "cors";
Dotenv.config();

const app = express();

app.use(fileUpload());

app.use(express.json());

app.use(cors())

app.get("/", express.static("public"));

app.use('/', embeddedRouter);

app.listen(3000, async () => {
  try {
    if (await connectDB(process.env.MONGO_URI as string))
      console.log("Connected to MongoDB");
    console.log("Example app listening on port 3000!");
  } catch (error) {
    console.error(error);
  }
});
