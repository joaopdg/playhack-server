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
      throw new Error("You are not allowed to edit this content");
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
    
    await thisUser.populate("games");
    
    const userGames = await thisUser.games;
    
    await userGames.forEach((game) => {
      game.comments.forEach((comment) => Comment.findByIdAndRemove(comment));
    
      if (game.comments.length === 0) {
        Game.findByIdAndRemove(game);
      }
    });
    
    await User.findByIdAndRemove(userId)
      res.json(response)
    
} catch (error) {
    res.json(error)
}


   
});

module.exports = router;
