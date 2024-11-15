import express from "express";
import fs from "fs";
import { v4 as uuid } from "uuid";

const router = express.Router();

const FILE_PATH = "./data/videos.json";
const videoData = JSON.parse(fs.readFileSync(FILE_PATH));
const updateData = () => fs.writeFileSync(FILE_PATH, JSON.stringify(videoData));

const validate = (req, res, next) => {
  const { id } = req.params;
  req.findVid = videoData.find((video) => video.id === id);
  if (req.findVid) {
    next();
  } else {
    res.status(400).send(`Invalid video ID: ${id}`);
  }
};

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
      const { title, description, image } = req.body;
      const newVid = {
        id: uuid(),
        title,
        channel: "Fio M",
        image,
        description,
        views: "0",
        likes: "0",
        duration: "4:33",
        video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        timestamp: Date.now(),
        comments: [],
      };
      videoData.push(newVid);
      updateData();
      res.status(200).send(`Video added: ${newVid}`);
    } catch (e) {
      res.status(400).send(`Unable to add video: ${newVid}`);
    }
  });

router.get("/:id", validate, (req, res) => {
  res.status(200).send(req.findVid);
});

router.post("/:id/comments", validate, (req, res) => {
  const { name, comment } = req.body;

  if (!name || !comment) {
    res.status(400).send(`Comment information is incomplete: ${{ name, comment }}`);
  }

  const newComment = {
    id: uuid(),
    name,
    comment,
    timestamp: Date.now(),
  };

  req.findVid.comments.push(newComment);
  updateData();
  const findComment = req.findVid.comments.find(
    (comment) => comment.id === newComment.id
  );
  res.status(200).send(`Comment posted: ${findComment}}`);
});

router.delete("/:id/comments/:commentId", validate, (req, res) => {
  const { commentId } = req.params;
  const commentArray = req.findVid.comments;
  const commentIndex = commentArray.findIndex((comment) => comment.id === commentId);
  commentArray.splice(commentIndex, 1);
  updateData();
  res.status(200).send(`Comment deleted`);
});

export default router;
