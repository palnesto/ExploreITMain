const loginModel = require("../Models/loginModel");
const jwt = require("jsonwebtoken");
const dotenv = require('dotenv').config();

const createJWT = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.Email,
      role: "PALNESTO_ADMIN",
    },
    process.env.JWT_KEY,
    { expiresIn: '2h' }
  );
};

const userLogin = async (req, res) => {
  try {
    const { Email, Password } = req.body;

    if (!Email || !Password) {
      return res.status(400).send({
        status: false,
        message: "Both email and password are required",
      });
    }

    const user = await loginModel.findOne({ Email });
    if (!user) {
      return res.status(401).send({
        status: false,
        message: "No user found with this email",
      });
    }
    if (user.Password !== Password) {
      return res.status(401).send({
        status: false,
        message: "Invalid email or password",
      });
    }

    const userJwt = createJWT(user);

    // Send the token in the response
    return res.status(200).send({ status: "login successfully", token: userJwt });
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message });
  }
};

const logout = async (req, res) => {
  req.session = null;
  res.status(200).send({
    status: true,
    message: "No active session or already logged out.",
  });
};

const getusersData = async (req, res) => {
  try {
    const Data = await loginModel.find();
    res.status(200).send({
      status: true,
      msg: "Data retrieved successfully",
      data: Data,
    });
  } catch (err) {
    return res
      .status(500)
      .send({ status: false, msg: "Server error", error: err.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const result = await loginModel.deleteMany({});
    res.send(`Deleted ${result.deletedCount} users`);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
}


module.exports = {
  // createUser,
  userLogin,
  logout,
  getusersData,
  deleteUser,
};
