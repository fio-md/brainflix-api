import * as express from "express";
import { Video } from "./src/routes/videos";

declare global {
  namespace Express {
    interface Request {
      findVid: Video;
    }
  }
}
