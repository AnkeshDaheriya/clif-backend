const { textExtraction } = require("../helper/resumeTextParser.js");

const resumeUpload = async (req, res) => {
  if (!req.file) {
    return res.json({
      status: 400,
      message: "No file were uploaded!",
      success: false,
    });
  }
  const fileLocation = `public/resume_files/${req.file.filename}`;
  console.log("$fileName", fileLocation);
  const extractedText = await textExtraction(fileLocation);
  return res.json({
    status: 200,
    message: "Extracted text",
    extractedText: extractedText,
    success: true,
  });
};

module.exports.uploadResume = resumeUpload;
