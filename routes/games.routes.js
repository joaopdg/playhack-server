const router = require("express").Router();
const res = require("express/lib/response");
const fileUploader = require("../config/cloudinary.config");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const fileUploader = require("../config/cloudinary.config");

router.post(
  "/games/:userId",
  fileUploader.single("thumbnail"),
  (req, res, next) => {
    const { title, gameUrl, description, thumbnail, category } = req.body;
    const { userId } = req.params;

    if (req.file) {
      Game.create({
        title,
        gameUrl,
        description,
        thumbnail: req.file.path,
        category,
        creator: userId,
        comments: [],
        timesPlayed: 0,
        likes: 0,
      })
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
    } else {
      Game.create({
        title,
        gameUrl,
        description,
        category,
        creator: userId,
        comments: [],
        timesPlayed: 0,
        likes: 0,
      })
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
    }
  }
);

router.get("/games", (req, res, next) => {
  Game.find({})
    .then((allGames) => res.json(allGames))
    .catch((err) => res.json(err));
});

router.get("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  Game.findById(gameId)
    .populate("comments")
    .populate("creator")
    .then((thisGame) => res.json(thisGame))
    .catch((err) => res.json(err));
});

router.put(
  "/games/:gameId",
  fileUploader.single("thumbnail"),
  (req, res, next) => {
    const { gameId } = req.params;
    const { title, gameUrl, description, thumbnail, category } = req.body;

    if (req.file) {
      Game.findByIdAndUpdate(
        gameId,
        { title, gameUrl, description, thumbnail: req.file.path, category },
        { new: true }
      )
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
    } else {
      Game.findByIdAndUpdate(
        gameId,
        { title, gameUrl, description, category },
        { new: true }
      )
        .then((response) => res.json(response))
        .catch((err) => res.json(err));
    }
  }
);

router.delete("/games/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  Game.findByIdAndRemove(gameId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
