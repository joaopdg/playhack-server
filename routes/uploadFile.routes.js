const router = require("express").Router();
const fileUploader = require("../config/cloudinary.config");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const User = require("../models/User.model");
const Game = require("../models/Game.model");
const Comment = require("../models/Comment.model");
const mongoose = require("mongoose");



router.post("/upload", fileUploader.single("imageUrl"), (req,res,next) =>{

if(!req.file){
    next(new Error("No file uploaded"))
    return
}
res.json({fileUrl: req.file.path})
})





module.exports = router;