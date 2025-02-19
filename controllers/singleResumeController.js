const { textExtraction } = require("../helper/resumeTextParser.js");
const { AIResume } = require("../helper/OpenAiHelper.js");
const { promptFormat } = require("../config/prompt.js");

const singleResumeUpload = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      message: "No file was uploaded!",
      success: false,
    });
  }

  const fileLocation = `public/resume_files/${req.file.originalname}`;
  try {
    const extractedText = await textExtraction(fileLocation);

    const prompt = `Extract all the key details from resume text: ${
      extractedText?.pages
    } 
    and give all the resume details in the following JSON format: ${JSON.stringify(
      promptFormat,
      null,
      2
    )}. 
    Ensure that all technical skills are in an array, non-technical skills are in an array, 
    and all other skills are in an array within the skills section.`;

    const response = await AIResume(prompt);
    const parsedData = JSON.parse(response);

    console.log("Extracted Resume Data:", parsedData);

    return res.json({
      message: "Resume details extracted successfully",
      extractedText: parsedData,
      fileLocation : fileLocation,
      success: true,
    });
  } catch (error) {
    console.error("Error extracting text:", error);
    return res.status(500).json({
      message: "Error extracting text",
      success: false,
      error: error.message,
    });
  }
};

module.exports.singleResumeUpload = singleResumeUpload;
