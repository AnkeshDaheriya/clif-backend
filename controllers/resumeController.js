const { textExtraction } = require("../helper/resumeTextParser.js");
const resumeModel = require("../models/resumeModel.js");

const resumeUpload = async (req, res) => {
  const { fileLocation } = req.body;
  if (!fileLocation) {
    if (!req.files) {
      return {
        status: 400,
        message: "No file was uploaded!",
        success: false,
      };
    }
  }
  const file_Location = fileLocation
    ? fileLocation
    : `public/resume_files/${req.files.fileUpload[0].originalname}`; // Add a slash before the filename
  // console.log("$fileName", fileLocation);
  try {
    const extractedText = await textExtraction(file_Location);
    // console.log(extractedText);
    return {
      message: "Extracted text",
      extractedText: extractedText,
      success: true,
    };
  } catch (error) {
    console.error("Error extracting text:", error);
    return {
      status: 500,
      message: "Error extracting text",
      success: false,
    };
  }
};
const getResume = async (req, res) => {
  const { userId } = req.body;
  console.log("userId", userId);

  // Input validation
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    // Fetch resume data with lean() for better performance if you don't need Mongoose documents
    const resume = await resumeModel.findOne({ user_id: userId });

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found for the specified user",
      });
    }
    console.log(resume);
    return res.status(200).json({
      success: true,
      message: "Resume fetched successfully",
      data: resume,
    });
  } catch (err) {
    // Log error with more context
    console.error("Error fetching resume:", {
      error: err.message,
      userId,
      stack: err.stack,
    });

    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching the resume",
      // Consider removing error details in production
      ...(process.env.NODE_ENV === "development" && { error: err.message }),
    });
  }
};

module.exports.uploadResume = resumeUpload;
module.exports.getResumedata = getResume;
