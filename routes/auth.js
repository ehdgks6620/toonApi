let express = require("express");
const router = express.Router();
const KakaoLogin = require("../mongo/KakaoLogin.js");
const User = require("../mongo/User.js");
const { route } = require("./index.js");

router.post("/save", async function (req, res, next) {
  try {
    let kakao = new KakaoLogin({
      id: req.body.id,
      name: req.body.nickname,
      profile_image_url: req.body.profile_image_url,
    });
    let user = new User({
      id: req.body.id,
      nickname: req.body.nickname,
    });
    KakaoLogin.findOne({ id: req.body.id }, (err, result) => {
      if (err) {
        console.log(err);

        res.json({ result: "error" });
        return;
      } else {
        if (!result) {
          kakao
            .save()
            .then(() => {
              user
                .save()
                .then(async () => {
                  console.log("success");
                  await user.save();
                })
                .catch((err) => {
                  console.log(err);
                });
            })
            .catch((err) => {
              console.log(err);
            });

          res.json({ result: "save the user" });
          return;
        } else {
          res.json({ result: "have user" });
          return;
        }
      }
    });

    console.log("1");
  } catch (err) {
    console.log(err);
    res.json({ result: 0 });
  }
});

router.get("/getProfile/:id", async (req, res) => {
  try {
    const kakao = await KakaoLogin.findOne({ id: req.params.id });
    const user = await User.findOne({ id: req.params.id });

    res.json({
      kakao: kakao,
      user: user,
    });
  } catch (err) {}
});

module.exports = router;
