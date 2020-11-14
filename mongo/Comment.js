const mongoose = require("mongoose");
const { Schema } = mongoose;

const Comment = new Schema({
  Webtoon_Webtoon_id: { type: Number, required: true, unique: true },
  User_nickname: { type: String, required: true },
  date: { type: Date, default: Date.now },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
});

module.exports = mongoose.model("Comment", Comment);
