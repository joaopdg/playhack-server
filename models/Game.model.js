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
    thumbnail: {
      type: String,
      default: "linklinklinklink.link",
    },
    category: {
      type: String,
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
    creator: { type: Schema.Types.ObjectId, ref: "User" },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comments" }],
    timesPlayed: { type: Number },
    likes: { type: Number },
  },
  { timestampes: true }
);

const Game = model("Game", gameSchema);

module.exports = Game;
