const { OpenAI } = require("openai");
require("dotenv").config();

const openAi = new OpenAI({
  apiKey: process.env.OPEN_API_KEY,
  dangerouslyAllowBrowser: true,
});

const GenerateResumeData = async (prompt) => {
  try {
    const resp = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: prompt }],
    });
    // console.log(resp.choices[0].message.content);
    return resp.choices[0].message.content;
  } catch (error) {
    console.error("Error with OpenAI:", error);
    return { error: error };
  }
};

module.exports.AIResume = GenerateResumeData;
