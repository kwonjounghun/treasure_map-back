const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const crypto = require("crypto");
require("dotenv").config();

const User = new Schema({
  username: String,
  userEmail: String,
  password: String,
  admin: {
    type: Boolean,
    default: false
  },
  social: {
    types: {
      type: String,
      default: null
    },
    social_id: {
      type: String,
      default: null
    }
  },
  UserInfo: { type: String, default: null },
  placeList: Array,
  createDate: { type: Date, default: Date.now },
  updateDate: { type: Date, default: null }
});

User.statics.create = function (username, userEmail, password) {
  const encrypted = crypto.createHmac("sha1", process.env.SECRET_CODE)
    .update(password)
    .digest("base64");

  const user = new this({
    username,
    userEmail,
    password: encrypted
  });

  return user.save();
};

User.statics.findOneByUsername = function (userEmail) {
  return this.findOne({
    userEmail
  }).exec();
};

User.methods.verify = function (password) {
  const encrypted = crypto.createHmac("sha1", process.env.SECRET_CODE)
    .update(password)
    .digest("base64");

  return this.password === encrypted;
};

User.methods.assignAdmin = function () {
  this.admin = true;
  return this.save();
};

module.exports = mongoose.model("User", User);
