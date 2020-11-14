const mongoose = require("mongoose");

//Define Schemes
const profileSchema = new mongoose.Schema({
  id: { type: String, required: true },
  data: { type: Object, default: false },
});

module.exports = mongoose.model("Profile", profileSchema);
