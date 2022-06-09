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
      default: "https://res.cloudinary.com/dzwl5teme/image/upload/v1654780507/playHack/default_game_akeadj.jpg",
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
    likes:[{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Game = model("Game", gameSchema);

module.exports = Game;
