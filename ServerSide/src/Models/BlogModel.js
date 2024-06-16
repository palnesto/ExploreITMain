const { timeStamp } = require("console");
const mongoose = require("mongoose");
const Blog = new mongoose.Schema(
    {
        id: {
            type: String
        },
        BlogName: {
            type: String
        },
        photo1: {
            type: String
        },
        servDescription: {
            type: String,
        },
        Active: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },

    }, { timestamps: true }

);
module.exports = mongoose.model("Blogs", Blog)