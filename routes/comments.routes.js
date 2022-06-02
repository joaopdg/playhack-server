const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");


router.post("/game/:gameId/comments", isAuthenticated, async (req, res, next) => {
    const { gameId } = req.params;
    const { content } = req.body;

try {
    let game = await Game.findById(gameId)


    const newComment = await Comment.create({
        user: req.payload._id,
        game: game._id,
        content
    })

    const savedComment = await newComment.save()

    const pushComment = await game.comments.push(savedComment)

    const updateGame = await game.save()

    res.json(updateGame)



} catch (error) {
    res.json(error)
}

  

  });




  router.delete("/game/:commentid", isAuthenticated, (req, res, next) => {
    const { commentid } = req.params;
  
    Comment.findById(commentid)
      .then((comment) => {
        if (comment.user != req.payload._id) {
            throw new Error("You're not the owner of this comment!")
        } else {
          Comment.findByIdAndRemove(commentid).then((comment) => {
            res.json(comment)
          });
        }
      })
      .catch((err) => next(err));
  });




  module.exports = router;