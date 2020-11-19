const mongoose = require("mongoose");
const { Schema } = mongoose;
const toonSchema = new Schema({
  id: { type: Number, require: true },
  nickname: { type: String, require: true },
  title: String,
  data: String,
  num: { type: Number, require: true },
  date: { type: Date, default: Date.now },
  view: { type: Number, default: 0 },
});

const Toon = mongoose.model("Toon", toonSchema);
module.exports = Toon;
