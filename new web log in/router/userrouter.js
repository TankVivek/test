const express = require("express");
const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");

router.get("/", (req, resp) => {
  resp.render("index");
});

router.get("/registration", (req, resp) => {
  resp.render("registration");
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post("/AddUser", async (req, resp) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      pass: req.body.pass,
    });
    const data = await user.save();
    resp.render("registration", { msg: "registration successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/UserLogin", async (req, resp) => {
  try {
    const email = req.body.email;
    const pass = req.body.pass;

    const userdata = await User.findOne({ email: email });
    const isVerify = await bcrypt.compare(pass, userdata.pass);
    if (isVerify) {
      resp.render("index", { User: "Welcome " + userdata.name + " " });
    } else {
      resp.render("login", { loginmsg: "Invalide User or pass" });
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;
