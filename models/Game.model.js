const { Schema, model } = require("mongoose");

const gameSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    gameUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "https://i.ibb.co/DVCmg1k/download-2.jpg",
    },
    category: {
      type: [String],
      required: true,
      enum: [
        "Action",
        "Arcade",
        "Adventure",
        "Racing",
        "Puzzle",
        "Shooting",
        "Sports",
        "Other",
      ],
    },
    user: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    timesPlayed: { type: Number },
    likes: { type: Number },
  },
  { timestamps: true }
);

const Game = model("Game", gameSchema);

module.exports = Game;
