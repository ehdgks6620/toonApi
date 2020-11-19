var express = require("express");
const router = express.Router();
const multer = require("multer");
const User = require("../mongo/User");
const Toon = require("../mongo/toonDB");
const Scene = require("../mongo/Scene");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");
const path = require("path");
const fs = require("fs");
const { Schema } = require("mongoose");
AWS.config.loadFromPath(__dirname + "/../config/awsconfig.json");

//var s3Bucket = new AWS.S3({ params: { Bucket: "toonmaker-s3" } });
var s3 = new AWS.S3({ params: { Bucket: "toonmaker-s3" } });
let upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: "toonmaker-s3",
    acl: "public-read",
    key: function (req, file, cb) {
      cb(null, file.originalname);
    },
  }),
});

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express", uri: "a" });
  console.log();
});

router.post("/image", upload.single("file"), (req, res, next) => {
  try {
    buf = Buffer.from(
      req.body.file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var data = {
      Key: `${req.body.name}.jpg`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
    s3.putObject(data, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("successfully uploaded the image!");
      }
    });

    const toon = new Toon({
      id: Number(req.body.id),
      title: req.body.title,
      data: `https://toonmaker-s3.s3.ap-northeast-2.amazonaws.com/${req.body.name}.jpg`,
      num: Number(req.body.num),
      nickname: req.body.nickname,
    });
    toon
      .save()
      .then(() => {
        console.log(toon);
      })
      .catch((err) => {
        console.log("Error : " + err);
      });
    res.json({ result: 1 });
  } catch (err) {
    console.log(err);
    res.json({ result: 0 });
  }
});
//Scene S3에 넣기 & DB에 넣기
router.post("/createScene", async (req, res) => {
  try {
    buf = Buffer.from(
      req.body.file.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    var data = {
      Key: `${req.body.name}.jpg`,
      Body: buf,
      ContentEncoding: "base64",
      ContentType: "image/jpeg",
    };
    s3.putObject(data, function (err, data) {
      if (err) {
        console.log(err);
        console.log("Error uploading data: ", data);
      } else {
        console.log("successfully uploaded the image!");
      }
    });
    const Scene = new Scene({
      image_url: `https://toonmaker-s3.s3.ap-northeast-2.amazonaws.com/${req.body.image}.jpg`,
      background_url: `https://toonmaker-s3.s3.ap-northeast-2.amazonaws.com/${req.body.background}.jpg`,
      sticker_url: `https://toonmaker-s3.s3.ap-northeast-2.amazonaws.com/${req.body.sticker}.jpg`,
      User: req.body.user_id, //해결 해야 할 부분
    });
    Scene.save()
      .then(() => {
        console.log("success");
        res.json({ result: 1 });
      })
      .catch((e) => {
        console.log(e);
        res.json({ result: 0 });
      });
    //scene _id 생김 -> user_id에 맞는 User 찾아서 scene id 넣어주기
    let user = User.findeOneByUserid(req.body.user_id);
    user.Scenes.push(Scene);
  } catch (err) {
    res.json({ result: 0 });
  }
});

router.get("/showMainToon", async (req, res) => {
  try {
    const allToon = await Toon.find({ num: 0 }).limit(6).sort("view");
    res.json({ result: 1, allToon: allToon });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});

router.get("/showAllToon", async (req, res) => {
  try {
    const allToon = await Toon.find({ num: 0 }).sort("view");
    res.json({ result: 1, allToon: allToon });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});

router.post("/showMyToon", async (req, res) => {
  try {
    const allToon = await Toon.find({ num: 0, id: req.body.id }).sort("view");
    res.json({ result: 1, allToon: allToon });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});

router.delete("/deleteToon/:title", async (req, res) => {
  try {
    Toon.remove({ title: req.params.title }, function (err, output) {
      if (err) return res.status(500).json({ error: "database failure" });
    });
    res.json({ result: 1 });
  } catch (e) {
    res.json({ result: 0 });
  }
});

router.post("/createToon", async (req, res) => {
  try {
    console.log(req.body.scene);
    const toon = new Scene({
      Scene_id: req.body.scene,
      User_id: req.body.user,
      image_url: "asdfsdf",
      Scene_name: req.body.name,
    });

    scene
      .save()
      .then(() => {
        console.log("success");
        res.json({ result: 1 });
      })
      .catch((e) => {
        console.log(e);
        res.json({ result: 0 });
      });
  } catch (e) {
    res.json({ result: 0 });
  }
});

//클릭한 웹툰 페이지 정보 불러오기
router.get("/showOneToon/:title", async (req, res) => {
  try {
    console.log("success");
    const oneToon = await Toon.find({ title: req.params.title }).sort("num");
    res.json({
      result: 1,
      oneToon: oneToon,
    });
  } catch (e) {}
});

module.exports = router;
