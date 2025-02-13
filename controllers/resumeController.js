const { textExtraction } = require("../helper/resumeTextParser.js");
const resumeUpload = async (req, res) => {
  if (!req.file) {
    return res.json({
      status: 400,
      message: "No file was uploaded!",
      success: false,
    });
  }
  // console.log(req.file);
  const fileLocation = `public/resume_files/${req.file.originalname}`; // Add a slash before the filename
  // console.log("$fileName", fileLocation);

  try {
    const extractedText = await textExtraction(fileLocation);
    // console.log(extractedText);
    const prompt = `Extract all the key details from resume text ${extractedText?.pages} 
                    and give all the resume details in ${promptFormat} in json data keep all technical skills in a array and 
                    non technical skills in a array and all other skills in a array all within skills section  `;

    const response = await AIResume(prompt);

    const J_data = await JSON.parse(response);
    console.log("resume starts here");
    console.dir(J_data, { depth: null });
    return res.json({
      message: "Extracted text",
      extractedText: J_data,
      success: true,
    });
  } catch (error) {
    console.error("Error extracting text:", error);
    return res.json({
      status: 500,
      message: "Error extracting text",
      success: false,
    });
  }
};

module.exports.uploadResume = resumeUpload;
