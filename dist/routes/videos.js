"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const router = express_1.default.Router();
const FILE_PATH = "./src/data/videos.json";
const videoData = JSON.parse(fs_1.default.readFileSync(FILE_PATH, "utf-8"));
const updateData = () => fs_1.default.writeFileSync(FILE_PATH, JSON.stringify(videoData));
const validate = (req, res, next) => {
    const { id } = req.params;
    req.findVid = videoData.find((video) => video.id === id);
    if (req.findVid) {
        next();
    }
    else {
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
    }
    catch (e) {
        res.status(404).send(`Error retrieving videos: ${e}`);
    }
})
    .post((req, res) => {
    const { title, description, image } = req.body;
    if (!title || !description || !image) {
        res
            .status(400)
            .send(`Unable to add video. Information missing: ${title}, ${description}, ${image}`);
    }
    const newVid = {
        id: (0, uuid_1.v4)(),
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
    }
    catch (e) {
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
    const newComment = {
        id: (0, uuid_1.v4)(),
        name,
        comment,
        likes: 0,
        timestamp: Date.now(),
    };
    const videoComments = req.findVid.comments;
    videoComments.push(newComment);
    updateData();
    const findComment = videoComments.find((comment) => comment.id === newComment.id);
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
exports.default = router;
