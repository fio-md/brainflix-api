import express from "express";
import fs from "fs";
import { v4 as uuid } from "uuid";

const router = express.Router();

const FILE_PATH = "./data/videos.json";
const videoData = JSON.parse(fs.readFileSync(FILE_PATH));

router
  .route("/")
  .get((_req, res) => {
    try {
      const mainInfo = videoData.map((video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      }));
      res.status(200).send(mainInfo);
    } catch (e) {
      res.status(404).send("Error retrieving videos:", e);
    }
  })
  .post((req, res) => {
    try {
      const { title, description } = req.body;
      const newVid = {
        id: uuid(),
        title,
        channel: "Fio M",
        image: "https://placecats.com/800/500",
        description,
        views: "0",
        likes: "0",
        duration: "4:33",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: new Date(),
        comments: [],
      };
      videoData.push(newVid);
      fs.writeFileSync(FILE_PATH, JSON.stringify(videoData));
      res.status(200).send(`Video added: ${newVid}`);
    } catch (e) {
      res.status(400).send(`Unable to add video: ${newVid}`);
    }
  });

router.route("/:id").get((req, res) => {
  const { id } = req.params;
  try {
    const findVid = videoData.find((video) => video.id === id);
    res.status(200).send(findVid);
  } catch (e) {
    res.send(400).send(`No video found with id ${id}`);
  }
  res.send("video details");
});

// router.route("/:id/comments").post((req, res) => {});
export default router;
