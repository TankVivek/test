const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express();

// Configure bodyParser to parse JSON data
app.use(bodyParser.json());

// Connect to MongoDB Atlas
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Error connecting to MongoDB Atlas", err));

// Define the user schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
});

// Define the post schema
const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  title: String,
  content: String,
  date: { type: Date, default: Date.now },
});

// Define the user model
const User = mongoose.model("User", userSchema);

// Define the post model
const Post = mongoose.model("Post", postSchema);

// Define a middleware to authenticate requests
const authenticate = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).send("Unauthorized");
  }
};

// Define a route to register a new user
app.post("/api/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(400).send("Email is already registered");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new User({ name, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).send("User registered successfully");
  } catch (err) {
    console.error("Error registering user", err);
    res.status(500).send("Error registering user");
  }
});

// Define a route to log in a user and generate a JWT token
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send("Missing required fields");
  }

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).send("Invalid credentials");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return res.status(401).send("Invalid credentials");
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.send({ token });
});

// Define a route to create a new post
app.post("/api/posts", authenticate, async (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res.status(400).send("Missing required fields");
  }

  const post = new Post({ author: req.user.id, title, content });

  try {
    await post.save();
    res.status(201).send("Post created successfully");
  } catch (err) {
    console.error("Error creating post", err);
    res.status(500).send("Error creating post");
  }
});
