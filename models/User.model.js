const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    default:
      "https://res.cloudinary.com/dzwl5teme/image/upload/v1654780342/playHack/default_avatar_avgoiz.jpg",
  },
  bio: { type: String },
  cohort: { type: String },
  linkedin: { type: String },
  github: { type: String },
  campus: {
    type: String,
    enum: [
      "",
      "Lisbon",
      "Berlin",
      "London",
      "Barcelona",
      "Madrid",
      "Amsterdam",
      "Miami",
      "New York City",
      "Tampa",
      "Mexico City",
      "São Paulo",
    ],
  },
  likedGames: [{ type: Schema.Types.ObjectId, ref: "Game" }],
  games: [{ type: Schema.Types.ObjectId, ref: "Game" }],
});

const User = model("User", userSchema);

module.exports = User;
