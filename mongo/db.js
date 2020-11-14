const mongoose = require("mongoose");

const connect = () => {
  mongoose.connect(
    "mongodb+srv://donghan_25:sa200325@cluster0.qyemm.mongodb.net/smallToon?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useCreateIndex: true,
    },
    (error) => {
      if (error) {
        console.log("에러가 낫습니다.");
      } else {
        console.log("연결 성공");
      }
    }
  );
};

mongoose.connection.on("error", (error) => {
  console.error("몽고디비 연결 에러", error);
});

mongoose.connection.on("disconnected", () => {
  connect();
});

require("./profile");
require("./toonDB");
require("./KakaoLogin");
require("./Scene");
require("./User");
require("./Webtoon");
require("./Comment");
require("./Community");

module.exports = connect;
