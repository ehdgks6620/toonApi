const mongoose = require("mongoose");
const { Schema } = mongoose;

const Scene = new Schema({
  image_url: { type: String },
  background_url: { type: String },
  sticker_url: { type: String },
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  Webtoon: {
    type: Schema.Types.ObjectId,
    ref: "Webtoon",
  },
});

module.exports = mongoose.model("Scene", Scene);
