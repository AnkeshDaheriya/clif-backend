const { mileStonePrompt } = require("../config/mileStonePrompt");
const { AIResume } = require("../helper/OpenAiHelper");
const Milestone = require("../models/mileStoneModel");
// const jsonRepair = require("jsonrepair");

const getMileStones = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }
  try {
    const mileStone = await Milestone.findOne({
      user_id: userId,
    });
    if (mileStone) {
      return res.json({
        success: true,
        message: "MileStones fetched successfully",
        data: mileStone,
      });
    } else {
      return res.json({
        success: false,
        message: "No milestone found for this user",
      });
    }
  } catch (err) {
    console.log("Error fetching mileStones: ", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

const mileStones = async (data) => {
  try {
    const prompt = mileStonePrompt(data);
    const mileStoneData = await AIResume(prompt);

    // Use jsonRepair synchronously (no need for await)
    // const repairedJson = jsonRepair(mileStoneData); // Repair the malformed JSON
    console.dir(mileStoneData, { depth: null });

    try {
      const structuredJson = JSON.parse(mileStoneData); // Parse the repaired JSON
      console.dir(structuredJson, { depth: null }); // Log for debugging

      return structuredJson; // Return the structured JSON data
    } catch (parseError) {
      console.error("Error parsing repaired JSON:", parseError);
      return "Error parsing the repaired JSON";
    }
  } catch (error) {
    console.error(`Milestone Error: ${error}`);
    return "Internal server error during resume parsing";
  }
};

module.exports.getMileStones = getMileStones;
module.exports.mileStones = mileStones;
