const router = require("express").Router();
const mongoose = require("mongoose");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");


router.post("/game/:gameId/comments", (req, res, next) => {
    const { gameId } = req.params;
    const { content } = req.body;

    Game.findById(gameId)
    .populate('user')
    .then((game) => {
        let newComment = new Comment({
            user: game.user._id,
            game: game._id,
            content
        })

        newComment.save()
        .then((savedComment) => {
            game.comments.push(savedComment._id)
        })

        game.save()
        .then((updateGame) => res.json(updateGame._id))
    })
  
    .catch((err) => res.json(err));
  });