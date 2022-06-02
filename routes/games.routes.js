const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const mongoose = require("mongoose");

router.post(
  "/game-submit/:userId",
  isAuthenticated,
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
        user: userId,
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
        user: userId,
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

router.get("/game/:gameId", (req, res, next) => {
  const { gameId } = req.params;

  Game.findById(gameId)
    .populate("user")
    .populate("comments")
    .then((thisGame) => res.json(thisGame))
    .catch((err) => res.json(err));
});

router.put(
  "/game/:gameId",
  isAuthenticated,
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

router.delete("/game/:gameId", isAuthenticated, (req, res, next) => {
  const { gameId } = req.params;

  Game.findByIdAndRemove(gameId)
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

module.exports = router;
