const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const jwt = require("jsonwebtoken");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;

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
      linkedin: user.linkedin,
      github: user.github,
      campus: user.campus,
      imageUrl: user.imageUrl,
      likedGames: user.likedGames,
      games: user.games,
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
    const {
      name,
      email,
      password,
      cohort,
      linkedin,
      github,
      bio,
      campus,
      imageUrl,
    } = req.body;

    if (userId != currentUser) {
      throw { errorMessage: "This content doesn't belong to you" };
    } else {
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          name,
          email,
          password: hashedPassword,
          bio,
          cohort,
          campus,
          linkedin,
          github,
          imageUrl,
        },
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

module.exports = router;
