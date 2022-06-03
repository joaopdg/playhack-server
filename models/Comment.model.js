const { Schema, model } = require("mongoose");

const commentSchema = new Schema({
  content: { type: String },
  game: { type: Schema.Types.ObjectId, ref: "Game" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
},
{ timestamps: true }
);

const Comment = model("Comment", commentSchema);

module.exports = Comment;
