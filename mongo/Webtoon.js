const mongoose = require("mongoose");
const { Schema } = mongoose;

const Webtoon = new Schema({
  title: { type: String },
  date: { type: Date, default: Date.now },
  view: { type: Number, default: 0 },
  Scene: [
    {
      type: Schema.Types.ObjectId,
      ref: "Scene",
    },
  ],
  User: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = mongoose.model("Webtoon", Webtoon);
