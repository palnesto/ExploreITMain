const { timeStamp } = require("console");
const mongoose = require("mongoose");
const SubService = new mongoose.Schema(
    {
        id: {
            type: String
        },
        Photo1: {
            type: String,
        },
        SubServiceName: {
            type: String
        },
        Photo2: {
            type: String,
        },
        SubServiceDes: {
            type: String
        },
        Photo3: {
            type: String,
        },
        FeatureDes: {
            type: String
        },
        AddFeatures: {
            type: [String]
        },
        Photo4: {
            type: [String]

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
module.exports = mongoose.model("Subservice", SubService)