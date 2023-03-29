const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: true,
  },
  pass: {
    type: String,
    require: true,
  },
  Created: {
    type: Date,
    default: Date.now(),
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("pass")) {
      this.pass = await bcrypt.hash(this.pass, 10);
    }
  } catch (error) {
    console.log(error);
  }
});
module.exports = new mongoose.model("User", UserSchema);
