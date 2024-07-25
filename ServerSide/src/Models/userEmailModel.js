const mongoose = require("mongoose");
const userEmailSchema = new mongoose.Schema(
    {
        id: {
            type: String,
        },
        Email: {
            type: String,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);
module.exports = mongoose.model("UserEmail", userEmailSchema);
