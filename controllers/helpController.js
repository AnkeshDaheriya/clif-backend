const HelpCenter = require("../models/helpDesk"); // Importing the model
const { helpEmail } = require("../helper/emailService");

const helpCenterController = async (req, res) => {
  try {
    const { email, firstName, lastName, message, userId } = req.body;

    // Validate input data
    if (!email || !firstName || !lastName || !message || !userId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // Create a new help desk request
    const newRequest = new HelpCenter({
      email,
      firstName,
      lastName,
      message,
      userId,
    });

    await newRequest.save();
    await helpEmail(newRequest);

    return res.status(201).json({
      success: true,
      message: "Help request submitted successfully.",
      data: newRequest,
    });
  } catch (err) {
    console.error("Error submitting help request: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = helpCenterController;
