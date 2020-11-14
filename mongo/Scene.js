const mongoose = require("mongoose");
const { Schema } = mongoose;

const Scene = new Schema({
  Scene_id: { type: Number, required: true },
  Scene_name: { type: String },
  User_id: { type: Number, required: true },
  image_url: { type: String, required: true },
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Scene", Scene);
