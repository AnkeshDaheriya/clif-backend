require("dotenv").config();
const OpenAI = require("openai");
const { textExtraction } = require("../helper/resumeTextParser.js");
const fs = require("fs");

const resumeUpload = async (req, res) => {
  if (
    !req.files ||
    !req.files.fileUpload ||
    req.files.fileUpload.length === 0
  ) {
    return res.status(400).json({
      message: "No file was uploaded!",
      success: false,
    });
  }

  const fileLocation = `public/resume_files/${req.files.fileUpload[0].originalname}`;

  try {
    // Extract text from resume
    const extractedText = await textExtraction(fileLocation);

    // OpenAI Setup with API Key from Environment Variables
    const openai = new OpenAI({
      apiKey:
        "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", // Use environment variable
      dangerouslyAllowBrowser: true,
    });

    // Structured Prompt for AI to analyze 1-year career growth plan
    const prompt = `
      Based on the following extracted resume text, generate a career growth plan for the next 1 year.
      
      **Resume Text:** 
      ${extractedText}

      **Expected Output in JSON Format:**
      {
        "Career_Goals": "What should be the key focus areas for the candidate in the next 1 year?",
        "Skill_Enhancement": "Which new skills should they learn to stay competitive?",
        "Certifications": "Recommended certifications for career advancement.",
        "Industry_Trends": "Latest trends relevant to their field.",
        "Networking_Strategy": "How should they expand their professional network?",
        "Job_Opportunities": "Potential job roles they should target.",
        "Workshops_And_Conferences": "Recommended events for learning & networking."
      }
    `;

    // Calling OpenAI API
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
      max_tokens: 1500,
    });

    let careerPlan = null;

    if (response.choices && response.choices.length > 0) {
      careerPlan = JSON.parse(response.choices[0].message.content);
    } else {
      return res.status(500).json({
        message: "No response from OpenAI API.",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Resume analyzed successfully.",
      extractedText: extractedText,
      careerPlan: careerPlan,
      success: true,
    });
  } catch (error) {
    console.log("OpenAI API Key:", process.env.OPENAI_API_KEY);

    console.error("Error processing resume:", error);
    return res.status(500).json({
      message: "Error processing resume",
      success: false,
    });
  }
};

module.exports.uploadResume = resumeUpload;
