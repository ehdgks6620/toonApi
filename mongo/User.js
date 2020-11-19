const mongoose = require("mongoose");
const { Schema } = mongoose;

const User = new Schema({
  id: { type: Number, require: true },
  nickname: { type: String, require: true },
  Scenes: [
    {
      type: Schema.Types.ObjectId,
      ref: "Scene",
    },
  ],

  Webtoons: [
    {
      type: Schema.Types.ObjectId,
      ref: "Webtoon",
    },
  ],
});

// const Scene = new Schema({
//   image_url: { type: String, required: true },
//   background_url: { type: String },
//   sticker_url: { type: String },
//   User: {
//     type: Schema.Types.ObjectId,
//     ref: "User",
//   },
//   Webtoon: {
//     type: Schema.Types.ObjectId,
//     ref: "Webtoon",
//   },
// });

// const Webtoon = new Schema({
//   title: { type: String },
//   date: { type: Date, default: Date.now },
//   view: { type: Number, default: 0 },
//   Scene: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: "Scene",
//     },
//   ],
//   User: {
//     type: Schema.Types.ObjectId,
//   },
// });

User.statics.create = function (payload) {
  // this === Model
  const user = new this(payload);
  // return Promise
  return user.save();
};

// Find All
User.statics.findAll = function () {
  // return promise
  // V4부터 exec() 필요없음
  return this.find({});
};

// Find One by todoid
User.statics.findOneByUserid = function (user_id) {
  return this.findOne({ user_id });
};

// Update by todoid
User.statics.updateByUserid = function (user_id, payload) {
  // { new: true }: return the modified document rather than the original. defaults to false
  return this.findOneAndUpdate({ user_id }, payload, { new: true });
};

// Delete by todoid
User.statics.deleteByTodoid = function (user_id) {
  return this.remove({ user_id });
};

module.exports = mongoose.model("User", User);
// module.exports = mongoose.model("Webtoon", Webtoon);
// module.exports = mongoose.model("Scene", Scene);
