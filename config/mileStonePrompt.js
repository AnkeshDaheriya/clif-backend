const mileStonePrompt = (data) => {
  const currentYear = new Date().getFullYear();
  return `Generate a structured JSON career roadmap with exactly 8 milestones based on:

### Input Parameters:
- Resume Data: ${data.resumeData}
- Desired Role: ${data.desiredRole} 
- Desired Employer: ${data.desiredEmployer}
- Desired Salary: ${data.desiredSalary} 
- Desired Location: ${data.desiredLocation}

### Output Format Requirements:
- 
- Return valid, complete JSON without formatting errors
- Include exactly 8 milestones with progression from skill-building to job acquisition
- Start dates should begin from current date (March 2025)
- Each milestone should be 2-3 months in duration
- Follow the exact JSON structure below without modification

\`\`\`json
{
  "Milestone 1": {
    "Timeline": {
      "Start Date": "Month YYYY",
      "End Date": "Month YYYY",
      "Duration (Months)": "X"
    },
    "Goals": {
      "Primary Goal": "",
      "Measurable Goals": []
    },
    "KPIs": {},
    "TechVerse": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 2 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 2 Relevant Non-Technical Courses": []
    },
    "BookVault": {
      "What it Covers": "",
      "Focus Areas": [],
      "Recommended Books": {
        "Technical Books": [],
        "Non-Technical Book": ""
      }
    },
    "SkillForge": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 3 Certifications": []
    },
    "EventPulse": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Events/Webinars": []
    },
    "NetX": {
      "What it Covers": "",
      "Focus Areas": [],
      "Key Activities": []
    }
  },
  "Milestone 2": {
    /* Same structure as Milestone 1 */
  },
  /* Continue with identical structure for Milestones 3-8 */
}
\`\`\`

Important: Ensure all JSON keys and values are properly quoted with double quotes, arrays are properly terminated, and objects have matching closing braces. Do not include any explanatory text outside the JSON structure.`;
};
module.exports.mileStonePrompt = mileStonePrompt;
