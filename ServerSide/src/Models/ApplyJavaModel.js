const mongoose = require("mongoose");
const applyJavaSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },

        Name: {
            type: String,
        },
        LastName: {
            type: String,
        },

        Email: {
            type: String,
        },
        Number: {
            type: Number
        },

        Country: {
            type: String,
        },
        State: {
            type: String,
        },
        City: {
            type: String
        },
        Gender: {
            type: String,
        },
        Experience: {
            type: String,
        },
        NoticePeriod: {
            type: String
        },
        Currentctc: {
            type: String
        },
        Pay: {
            type: Date
        },
        Expected: {
            type: String
        },
        Interestedlevel: {
            type: String
        },
        Shift: {
            type: String
        },

        PositionApply: {
            type: String
        },
        Linkedin: {
            type: String
        },
        Portfolio: {
            type: String
        },
        JoininiDate: {
            type: String
        },
        HereAbout: {
            type: String,
        },
        AddInfo: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("ApplyJavaSchema", applyJavaSchema);
