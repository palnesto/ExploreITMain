const mongoose = require("mongoose");
const userformSchema = new mongoose.Schema(
  {
    id: {
      type: String,
    },

    Name: {
      type: String,
    },

    Email: {
      type: String,
    },
    Number: {
      type: Number
    },

    Message: {
      type: String,
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("UserformData", userformSchema);
