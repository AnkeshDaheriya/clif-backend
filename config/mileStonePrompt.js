const mileStonePrompt = (data) => {
  const currentYear = new Date().getFullYear();
  return `Generate a structured JSON career roadmap with up to 8 milestones, ensuring alignment with the candidate's Resume Data and Career Goals:
### Input Parameters:
- Resume Data: ${data.resumeData}
- Career Goals:
  - Desired Role: ${data.desiredRole} 
  - Desired Employer: ${data.desired_employer} 
  - Desired Salary: ${data.desired_salary} 
  - Desired Location: ${data.desired_country}

### Output Format (DO NOT CHANGE JSON STRUCTURE AND GENERATE EXACT 8 MILESTONES)
### **Output Requirements:**  
- **Ensure up to 8 meaningful milestones based on complexity.**  
- **For each milestone, include:**  
  - **Timeline:** Auto-generate start and end dates based on logical progressions.  
  - **Primary Goal & Measurable Goals** (Ensure goals are actionable).  
  - **KPIs:** Define key performance indicators (e.g., "Skill Development", "Practical Projects", "Networking & Visibility").  
  - **TechVerse:** Suggest top 5 relevant **technical** courses.  
  - **ProVision:** Suggest top 5 relevant **non-technical** courses (e.g., leadership, soft skills).  
  - **BookVault:** Recommend relevant books (both **technical** and **non-technical**).  
  - **SkillForge:** Provide top 3 relevant certifications.  
  - **EventPulse:** List top 5 tech conferences or webinars.  
  - **NetX:** Suggest networking strategies (e.g., open-source contributions, LinkedIn branding).
  ### **Output Format (DO NOT MODIFY STRUCTURE)**  
 {
  "Milestone 1": {
    "Timeline": {
      "Start Date": "Month YYYY",// **from currant date**
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 3": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 4": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 5": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 6": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 7": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  "Milestone 8": {
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
      "Top 5 Relevant Technical Courses": []
    },
    "ProVision": {
      "What it Covers": "",
      "Focus Areas": [],
      "Top 5 Relevant Non-Technical Courses": []
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
  }
}
### 📢 Instructions for Output Generation:
1. Extract relevant technical skills, certifications, and experiences from {resume_data}.
2. Align learning areas, books, certifications, events, and mentorship with {desired_role} and {desired_employer}.
3. Ensure progression across 8 milestones — from learning fundamentals to securing a job.
4. Include a single timeline per milestone in all 8 milestones and ensure measurable goals & KPIs for tracking progress.
5. Format output in exactly the same JSON structure as defined.
**give complete response and complete terminated string** .
**give in JSON FORMAT please without any extra character**.
**assign start date and end date in each milestone from today's date.**.
The output should be fully structured and ready for career tracking!
- **Ensure each milestone follows this exact format.**  
- **Adapt roadmap dynamically to match candidate’s goals.**
`;
};
module.exports.mileStonePrompt = mileStonePrompt;
