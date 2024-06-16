const { timeStamp } = require("console");
const mongoose = require("mongoose");
const Service = new mongoose.Schema(
    {
        id: {
            type: String
        },
        ServiceName: {
            type: String
        },
        Description: {
            type: String
        },
        Active: {
            type: Boolean,
            default: false,
        },
        Photos: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    }, { timestamps: true }

);
module.exports = mongoose.model("Service", Service)