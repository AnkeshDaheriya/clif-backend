const { textExtraction } = require("../helper/resumeTextParser.js");

const resumeUpload = async (req, res) => {
  const {fileLocation} = req.body
  if(!fileLocation){
  if (!req.files) {
    return {
      status: 400,
      message: "No file was uploaded!",
      success: false,
    };
  }
}

  const file_Location = fileLocation ? fileLocation : `public/resume_files/${req.files.fileUpload[0].originalname}`; // Add a slash before the filename
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

module.exports.uploadResume = resumeUpload;
