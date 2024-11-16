import express, { NextFunction, Request, Response } from "express";
import fs from "fs";
import { v4 as uuid } from "uuid";

const router = express.Router();

const FILE_PATH = "./src/data/videos.json";
const videoData = JSON.parse(fs.readFileSync(FILE_PATH, "utf-8"));
const updateData = () => fs.writeFileSync(FILE_PATH, JSON.stringify(videoData));

type Comment = {
  id: string;
  name: string;
  comment: string;
  likes: number;
  timestamp: number;
};

export type Video = {
  id: string;
  title: string;
  channel: string;
  image: string;
  description: string;
  views: string;
  likes: string;
  duration: string;
  video: string;
  timestamp: number;
  comments: Comment[];
};

const validate = (req: Request, res: Response, next: NextFunction): void => {
  const { id } = req.params;
  req.findVid = videoData.find((video: Video) => video.id === id);
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
      const mainInfo = videoData.map((video: Video) => ({
        id: video.id,
        title: video.title,
        channel: video.channel,
        image: video.image,
      }));
      res.status(200).send(mainInfo);
    } catch (e) {
      res.status(404).send(`Error retrieving videos: ${e}`);
    }
  })
  .post((req, res) => {
    const { title, description, image } = req.body;

    if (!title || !description || !image) {
      res
        .status(400)
        .send(
          `Unable to add video. Information missing: ${title}, ${description}, ${image}`
        );
    }
    const newVid: Video = {
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
    try {
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
    res
      .status(400)
      .send(`Comment information is incomplete: ${{ name, comment }}`);
  }

  const newComment: Comment = {
    id: uuid(),
    name,
    comment,
    likes: 0,
    timestamp: Date.now(),
  };

  const videoComments = req.findVid.comments;
  videoComments.push(newComment);
  updateData();
  const findComment = videoComments.find(
    (comment) => comment.id === newComment.id
  );
  res.status(200).send(`Comment posted: ${findComment}}`);
});

router.delete("/:id/comments/:commentId", validate, (req, res) => {
  const { commentId } = req.params;
  const commentArray = req.findVid.comments;
  const commentIndex = commentArray.findIndex(
    (comment) => comment.id === commentId
  );
  commentArray.splice(commentIndex, 1);
  updateData();
  res.status(200).send(`Comment deleted`);
});

export default router;
