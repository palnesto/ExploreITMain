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

    Service: {
      type: String,
    },
    Designation: {
      type: String,
    },
    Website: {
      type: String
    },
    ServiceInterested: {
      type: String,
    },
    ProjectTitle: {
      type: String,
    },
    Budget: {
      type: String
    },
    Description: {
      type: String
    },
    Timeline: {
      type: Date
    },
    Technologies: {
      type: String
    },
    Requirments: {
      type: String
    },
    Platform: {
      type: String
    },

    Contraints: {
      type: String
    },
    Area: {
      type: String
    },
    Experience: {
      type: String
    },
    Reference: {
      type: String
    },
    AddiInfo: {
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
