const express = require("express");
const bodyParser = require("body-parser");
const route = require("./Route/route");
const { default: mongoose } = require("mongoose");
const { Route } = require("express");
const cors = require("cors");
const app = express();
const multer = require("multer");
const cookieSession = require("cookie-session");
// Enable All CORS Requests for development use


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:444",
      "http://localhost:80",
      "http://localhost:3000",
    ],
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 200,
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "Origin", "Cookie"],
  })
);
app.use(multer().any());
require('dotenv').config()
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

mongoose
  .connect(
    "mongodb+srv://dxv42198:KVLcA1bWcl3KXmuZ@cluster0.qnt5rum.mongodb.net/ExportITMain",
    // "mongodb+srv://qjoxqciedfjvrzyeyh:oVDaqdgLGKDxYT58@cluster0.kczadan.mongodb.net/ExportIT",
    {
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("MongoDb is connected"))
  .catch((err) => console.log(err));
app.use(
  cookieSession({
    signed: false,

    secure: false,

    sameSite: "strict",
  })
);
app.use("/", route);

app.listen(process.env.PORT || 3000, function () {
  console.log("Express app running on port " + (process.env.PORT || 3000));
});