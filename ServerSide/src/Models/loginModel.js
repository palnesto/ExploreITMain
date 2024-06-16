const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema(
  {
    Email: {
      type: String,
    },
    Password: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Login", loginSchema);
