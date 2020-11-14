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
      id: "donghan",
      title: req.body.title,
      data: `https://toonmaker-s3.s3.ap-northeast-2.amazonaws.com/${req.body.name}.jpg`,
      num: Number(req.body.num),
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

router.get("/showAllToon", async (req, res) => {
  try {
    const allToon = await Toon.find({ num: 0 }).limit(6).sort("view");
    res.json({ result: 1, allToon: allToon });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});
router.post("/createToon", async (req, res) => {
  try {
    console.log(req.body.scene);
    const scene = new Scene({
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

router.post("/showProfile1/:id", async (req, res) => {
  //개인정보에서 제작자 정보 불러오기=id는 number
  try {
    console.log("success");
    const profile = await User.find({ id: Number(req.params.id) });
    res.json({ result: 1, profile: profile });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});

router.post("/showProfile2/:id", async (req, res) => {
  //개인정보에서 제작 웹툰 정보 불러오기-id는 string
  try {
    console.log("success");
    const toonProfile = await Toon.find({ id: req.params.id });
    res.json({ result: 1, toonproFile: toonProfile });
  } catch (e) {
    console.log(e);
    res.json({ result: 0 });
  }
});

router.get("/showOneToon/:title", async (req, res) => {
  //클릭한 웹툰 페이지 정보 불러오기
  try {
    console.log("success");
    const oneToon = await Toon.find({ title: req.params.title });
    res.json({
      result: 1,
      oneToon: oneToon,
    });
  } catch (e) {}
});

router.get("/:id", (req, res) => {
  Profile.find({ id: req.params.id }, (err, profile) => {
    console.log(profile);
    res.send("a");
  });
});

module.exports = router;
