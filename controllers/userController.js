const bcrypt = require("bcrypt");
const userModel = require("../models/users");

const userRegister = async (req, res) => {
  try {
    const { email, username, password, contact_no } = req.body;
    if (!email || !username || !password || !contact_no) {
      return res.json({
        status: 400,
        message: "All fields are required!",
        success: false,
      });
    }
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        status: 409,
        message: "User with this email already exists",
        success: false,
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      email: email,
      userName: username,
      password: hashedPassword,
      contact_no: contact_no,
    });
    newUser.save();
    return res.json({
      status: 201,
      message: "User Registered success",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({
        status: 404,
        message: "User not found",
        success: false,
      });
    }
    const verify = await bcrypt.compare(password, user.password);
    // console.log("$Verify", verify);
    if (!verify) {
      return res.json({
        status: 401,
        message: "Invalid password",
        success: false,
      });
    }
    return res.json({
      status: 200,
      message: "user login successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    console.log(`error ${error}`);
    return res.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
