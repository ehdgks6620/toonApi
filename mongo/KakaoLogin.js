const mongoose = require("mongoose");
const { Schema } = mongoose;

const KakaoLogin = new Schema({
  id: { type: Number, required: true },
  name: { type: String, required: true },
  profile_image_url: { type: String, required: true },
});

module.exports = mongoose.model("KakaoLogin", KakaoLogin);
