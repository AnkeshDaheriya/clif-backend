const { mileStonePrompt } = require("../config/mileStonePrompt");
const { AIResume } = require("../helper/OpenAiHelper");
const Milestone = require("../models/mileStoneModel");
const BookTask = require("../models/books");
// const jsonRepair = require("jsonrepair");

// const getMileStones = async (req, res) => {
//   const { userId } = req.body;
//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: "User ID is required",
//     });
//   }
//   try {
//     const mileStone = await Milestone.findOne({
//       user_id: userId,
//     });
//     if (mileStone) {
//       return res.json({
//         success: true,
//         message: "MileStones fetched successfully",
//         data: mileStone,
//       });
//     } else {
//       return res.json({
//         success: false,
//         message: "No milestone found for this user",
//       });
//     }
//   } catch (err) {
//     console.log("Error fetching mileStones: ", err);
//     return res.status(500).json({
//       success: false,
//       message: "Internal Server Error",
//     });
//   }
// };


// mileStone with books from book task
const getMileStones = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "User ID is required",
    });
  }

  try {
    // Step 1: Fetch milestone data based on userId
    const mileStone = await Milestone.findOne({
      user_id: userId,
    });

    if (mileStone && mileStone.milestones) {
      // Step 2: Fetch books from the BookTask collection
      const books = await BookTask.find({
        uid: userId,
      });

      if (books && books.length > 0) {
        // Step 3: Organize books by milestone
        const booksByMilestone = {};
        
        // Create an initial structure for each milestone
        for (const milestoneKey in mileStone.milestones) {
          const milestoneNumber = parseInt(milestoneKey.split(' ')[1]);
          booksByMilestone[milestoneNumber] = {
            technicalBooks: [],
            nonTechnicalBooks: []
          };
        }
        
        // Categorize books by milestone and type
        books.forEach((book) => {
          if (!book.milestone) return; // Skip if no milestone assigned
          
          const bookData = {
            book_name: book.book_name,
            book_id: book.bid,
            isRead: book.isRead,
            type: book.type,
            mileStone: book.milestone
          };
          
          const milestoneNum = parseInt(book.milestone);
          
          if (booksByMilestone[milestoneNum]) {
            if (book.type === "techBook") {
              booksByMilestone[milestoneNum].technicalBooks.push(bookData);
            } else if (book.type === "nonTechBook") {
              booksByMilestone[milestoneNum].nonTechnicalBooks.push(bookData);
            }
          }
        });

        // Step 4: Update each milestone's BookVault with its respective books
        for (const milestoneKey in mileStone.milestones) {
          const milestoneNumber = parseInt(milestoneKey.split(' ')[1]);
          
          // Keep original BookVault structure but replace the Recommended Books
          const originalBookVault = mileStone.milestones[milestoneKey].BookVault || {};
          
          mileStone.milestones[milestoneKey].BookVault = {
            "What it Covers": originalBookVault["What it Covers"],
            "Focus Areas": originalBookVault["Focus Areas"],
            "Recommended Books": {
              "Technical Books": booksByMilestone[milestoneNumber]?.technicalBooks.map(book => book) || [],
              "Non-Technical Book": booksByMilestone[milestoneNumber]?.nonTechnicalBooks.map(book => book)[0] || ""
            }
          };
        }
      }
      
      return res.json({
        success: true,
        message: "MileStones fetched and books updated successfully",
        data: mileStone
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
