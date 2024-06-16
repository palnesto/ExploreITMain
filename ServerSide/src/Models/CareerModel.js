const { timeStamp } = require("console");
const mongoose = require("mongoose");
const Career = new mongoose.Schema(
    {
        id: {
            type: String
        },
        CareerName: {
            type: String
        },
        CareerDesc: {
            type: String
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
module.exports = mongoose.model("Careers", Career)