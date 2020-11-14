const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  id: { type: Number, require: true },
  nickname: { type: String, require: true },
});

module.exports = mongoose.model("User", User);
