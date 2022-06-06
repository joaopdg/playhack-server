const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

router.get("/game/:gameId/comments", (req, res, next) => {
  const { gameId } = req.params;

  Comment.find({ game: gameId })
    .populate("user")
    .then((allComments) => {
      res.json(allComments);
    })
    .catch((err) => res.json(err));
});

router.post(
  "/game/:gameId/comments",
  isAuthenticated,
  async (req, res, next) => {
    const { gameId } = req.params;
    const { content } = req.body;

    try {
      let game = await Game.findById(gameId);

      const newComment = await Comment.create({
        user: req.payload._id,
        game: game._id,
        content,
      });

      const savedComment = await newComment.save();

      const pushComment = await game.comments.push(savedComment);

      const updateGame = await game.save();

      res.json(updateGame);
    } catch (error) {
      res.json(error);
    }
  }
);

router.delete(
  "/comment/:commentId",
  isAuthenticated,
  async (req, res, next) => {
    try {
      const { commentId } = req.params;
      const currentUser = req.payload._id;

      const thisComment = await Comment.findById(commentId);

      const thisGameId = await thisComment.game;

      if (thisComment.user != currentUser) {
        throw { errorMessage: "This content doesn't belong to you" };
      } else {
        await Game.findByIdAndUpdate(thisGameId, {
          $pull: { comments: commentId },
        });

        const deletedComment = await Comment.findByIdAndRemove(commentId);

        res.status(200).json(deletedComment);
      }
    } catch (error) {
      res.json(error);
    }
  }
);

module.exports = router;
