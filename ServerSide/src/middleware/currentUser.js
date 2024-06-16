const jwt = require("jsonwebtoken")
const dotenv = require('dotenv').config();
const currentUser = (req, res, next) => {
    console.log("session", req.session)
    if (req.session?.jwt) {
        try {
            const payload = jwt.verify(req.session.jwt, process.env.JWT_KEY);

            req.currentUser = payload;
            console.log(JSON.stringify(req.currentUser));
        } catch (err) { }

    }
    next();
};

module.exports = currentUser;