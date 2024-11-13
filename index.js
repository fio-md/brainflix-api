import express from "express";
import videosRoute from "./routes/videos.js";
import "dotenv/config";
import cors from "cors";

const { BACKEND_URL, PORT, CORS_ORIGIN } = process.env;
const app = express();

// middleware
app.use(cors()); //
app.use(express.json());
app.use(express.static("public")); // serve images/ as public static asset

app.use("/videos", videosRoute);

app.listen(PORT, () => {
  console.log(`Listening on port ${BACKEND_URL}${PORT}...`);
});
