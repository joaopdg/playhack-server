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
  async (req, res, next) => {
    try {
      const { title, gameUrl, description, category } = req.body;
      const { userId } = req.params;
      let createdGame;

      if (req.file) {
        createdGame = await Game.create({
          title,
          gameUrl,
          description,
          thumbnail: req.file.path,
          category,
          user: userId,
          comments: [],
          timesPlayed: 0,
          likes: 0,
        });
      } else {
        createdGame = await Game.create({
          title,
          gameUrl,
          description,
          category,
          user: userId,
          comments: [],
          timesPlayed: 0,
          likes: 0,
        });
      }

      const savedGame = await createdGame.save();

      const gameCreator = await User.findById(userId);

      await gameCreator.games.push(createdGame);
      await gameCreator.save();
      res.json(savedGame);
    } catch (error) {
      res.json(error);
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
  async (req, res, next) => {
    try {
      const { gameId } = req.params;
      const { title, gameUrl, description, thumbnail, category } = req.body;
      const currentUser = req.payload._id;
      let updatedGame;

      const thisGame = await Game.findById(gameId);

      if (thisGame.user != currentUser) {
        throw { errorMessage: "This content doesn't belong to you" };
      } else {
        if (req.file) {
          updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { title, gameUrl, description, thumbnail: req.file.path, category },
            { new: true }
          );
        } else {
          updatedGame = await Game.findByIdAndUpdate(
            gameId,
            { title, gameUrl, description, category },
            { new: true }
          );
        }
        res.json(updatedGame);
      }
    } catch (error) {
      res.json(error);
    }
  }
);

router.delete("/game/:gameId", isAuthenticated, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const currentUser = req.payload._id;

    const thisGame = await Game.findById(gameId);

    if (thisGame.user != currentUser) {
      throw { errorMessage: "This content doesn't belong to you" };
    } else {
      await User.findByIdAndUpdate(currentUser, { $pull: { games: gameId } });

      const deletedGame = await Game.findByIdAndRemove(gameId);

      res.json(deletedGame);
    }
  } catch (error) {
    res.json(error);
  }
});

router.put("/game/:gameId/like", isAuthenticated, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const currentUser = req.payload._id;

    const thisUser = await User.findByIdAndUpdate(currentUser, {
      $push: { likedGames: gameId },
    });

    res.json(thisUser);
  } catch (error) {
    res.json(error);
  }
});

router.put("/game/:gameId/dislike", isAuthenticated, async (req, res, next) => {
  try {
    const { gameId } = req.params;
    const currentUser = req.payload._id;

    const thisUser = await User.findByIdAndUpdate(currentUser, {
      $pull: { likedGames: gameId },
    });

    res.json(thisUser);
  } catch (error) {
    res.json(error);
  }
});

module.exports = router;
