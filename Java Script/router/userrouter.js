const express = require("express");

const router = express.Router();
const User = require("../model/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const multer = require("multer");

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/img");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

///*******************************  *********************************///

router.get("/", (req, resp) => {
  resp.render("registraion");
});

router.get("/login", (req, resp) => {
  resp.render("login");
});

router.post("/addUser", upload.single("file"), async (req, resp) => {
  try {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      pass: req.body.pass,
      img: req.file.filename,
    });

    const data = await user.save();

    resp.render("registraion", { msg: "registration successfully" });
  } catch (error) {
    console.log(error);
  }
});

router.post("/userLogin", async (req, resp) => {
  try {
    const useremail = req.body.email;
    const userpass = req.body.pass;

    const userdata = await User.findOne({ email: useremail });

    const isValid = await bcrypt.compare(userpass, userdata.pass);

    if (isValid) {
      resp.render("home", { udata: userdata });
    } else {
      resp.render("login", { err: "Invalid credentials !!!" });
    }
  } catch (error) {
    resp.render("login", { err: "Invalid credentials !!!" });
  }
});

router.get("/home", async (req, resp) => {
  try {
    const userdata = await User.find();
    resp.render("home", { udata: userdata });
  } catch (error) {}
});

module.exports = router;
