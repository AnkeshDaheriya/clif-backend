const axios = require("axios");
require("dotenv").config();
const client_id = process.env.LINKEDIN_CLIENT_ID;
const client_secret = process.env.LINKEDIN_CLIENT_SECRET;
const redirect_uri = process.env.LINKEDIN_REDIRECT_URI;
exports.fetchLinkedInProfileData = async (req, res) => {
  const profileUrl = req.body.profileUrl;
  if (!profileUrl) {
    return res
      .status(400)
      .json({ message: "LinkedIn profile URL is required!" });
  }
  try {
    const accessToken =
      "AQVDipaoMLuWJS7YoPapm19wR4CZycqwcIBtOIRiaq8OcIR6SONeaH4neLgGdUcUozISDX9rv-T4TwchmT7uxvqJtO5nkAJ-SBtU53VA9UUJWcAOb6XMe_10sKoUt3rZ_NVhrEZIEgNUjWDKBCwwnEX7shy75qibykxY9XcszX8siSHQj3M5z37ePkREO2Z2jgP_g5CronNXt-X7UUA7loJjEaoNpHotN9C4o9-khOgjTbUKOsram1ck4weTF61t8qejF8bR0_7TYaR6-l2or1xYVbJpzwl8aLXCn_5VtDr_9cqz-jqPwTU8vw4jtxdlD5gA7VurP96czdrYgV0CTx8lrTMj0w";
    const response = await axios.get("https://api.linkedin.com/v2/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    // Return the fetched profile data
    return res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching LinkedIn profile:",
      error.response ? error.response.data : error.message
    );
    return res.status(500).json({ message: "Error fetching profile data" });
  }
};
