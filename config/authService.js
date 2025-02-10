const userModel = require("../models/users"); // Import the User model
const jwt = require("jsonwebtoken");

// Function to check if a user exists using Google login
const googleLogin = async (email) => {
  // Find user by email in the database
  const user = await userModel.findOne({ email });

  if (user) {
    // Generate JWT and Refresh Token if user exists
    const token = generateAuthToken(user);
    const refreshToken = generateRefreshToken(user);

    return {
      token,
      refreshToken,
      user,
    };
  }

  return null; // Return null if no user is found
};

// Function to create a new user when they login with Google for the first time
const createGoogleUser = async (email, firstName, lastName) => {
  const newUser = new userModel({
    email,
    firstName,
    lastName,
    password: "", // No password required for Google login
  });

  await newUser.save(); // Save user to database

  // Generate JWT and Refresh Token for the new user
  const token = generateAuthToken(newUser);
  const refreshToken = generateRefreshToken(newUser);

  return {
    token,
    refreshToken,
    user: newUser,
  };
};

// Function to generate JWT Token
const generateAuthToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
};

// Function to generate Refresh Token
const generateRefreshToken = (user) => {
  return jwt.sign({ userId: user._id }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: "7d",
  });
};

// Export all functions including `createGoogleUser`
module.exports = { googleLogin, createGoogleUser };
