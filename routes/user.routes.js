const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const mongoose = require("mongoose");

router.get("/user/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId)
      .populate("games")
      .populate("likedGames");

    const userInfo = {
      name: user.name,
      email: user.email,
      bio: user.bio,
      cohort: user.cohort,
      cohortType: user.cohortType,
      imageUrl: user.imageUrl,
    };

    res.status(200).json(userInfo);
  } catch (error) {
    res.json(error);
  }
});

router.put("/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;
    const currentUser = req.payload._id;
    const { name, email, password, cohort, cohortType, imageUrl, bio } =
      req.body;

    if (userId != currentUser) {
      throw { errorMessage: "This content doesn't belong to you" };
    } else {
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { name, email, password, bio, cohort, cohortType, imageUrl },
        { new: true }
      );
      res.status(200).json(updatedUser);
    }
  } catch (error) {
    res.json(error);
  }
});

router.delete("/user/:userId", isAuthenticated, async (req, res, next) => {
  try {
    const { userId } = req.params;

    const thisUser = await User.findById(userId);
    const userToDeleteComment = await User.findById(userId).populate("games");

    const gamesToDeleteComments = await userToDeleteComment.games;

    for (let i = 0; i < gamesToDeleteComments.length; i++) {
      await Comment.findByIdAndDelete(gamesToDeleteComments[i].comments);
    }

    const games = await thisUser.games;

    for (let i = 0; i < games.length; i++) {
      await Game.findByIdAndRemove(games[i]);
    }

    const deleteUser = await User.findByIdAndRemove(userId);

  
    res.status(200).json(deleteUser);
  } catch (error) {
    res.json(error);
  }
});

router.get("/test/:userId", async (req, res, next) => {
  try {
    const { userId } = req.params;

    //Current User
    const thisUser = await User.findById(userId);
    const userToDeleteComment = await User.findById(userId).populate("games");

    const gamesToDeleteComments = await userToDeleteComment.games;

    for (let i = 0; i < gamesToDeleteComments.length; i++) {
      await Comment.findByIdAndDelete(gamesToDeleteComments[i].comments);
    }
    /* const commentToDelete = await gamesToDeleteComments.comments; */

    // Array dos jogos do user
    const games = await thisUser.games;

    for (let i = 0; i < games.length; i++) {
      await Game.findByIdAndRemove(games[i]);
    }

    // const deleteGames =
    // Ids dos comentarios
    /* const gamesComments = await games.map((game) => {
      return game.comments;
    });

    const comments = await gamesComments.map((el) => {
      return el;
    }); */

    /* const deletedUser = await User.findByIdAndRemove(userId); */
    res.status(200).json(deleteUser);
  } catch (error) {
    res.status(400).json(error);
  }
});

module.exports = router;
