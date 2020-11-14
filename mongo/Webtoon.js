const mongoose = require("mongoose");
const { Schema } = mongoose;

const Webtoon = new Schema({
  Webtoon_id: { type: Number, required: true },
  User_id: { type: Number, required: true },
  Webtooncol: { type: String, required: true },
});

module.exports = mongoose.model("Webtoon", Webtoon);
