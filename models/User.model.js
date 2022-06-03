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
    default: "https://i.pinimg.com/736x/5c/a1/42/5ca142d34fd1903773b4f4e6f43d9045.jpg",
  },
  bio: { type: String },
  cohort: { type: String },
  cohortType: {
    type: String,
    enum: ["","In person", "Remote"],
  },
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
