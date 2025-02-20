// const firebaseAdmin = require("firebase-admin");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const resumeModel = require("../models/resumeModel");
const mileStoneModel = require("../models/mileStone.js");
const authService = require("../config/authService.js");
const { ErrorHandler } = require("../helper/error");
const { textExtraction } = require("../helper/resumeTextParser.js");
const { uploadResume } = require("./resumeController.js");
const { AIResume } = require("../helper/OpenAiHelper.js");
const { promptFormat } = require("../config/prompt.js");

const userRegister = async (req, res) => {
  try {
    const {
      firstname,
      lastname,
      email,
      password,
      age,
      phone_no,
      gender,
      currency,
      desiredCurrency,
      current_employer,
      desired_employer,
      current_country,
      current_state,
      education,
      yearOfCompletion,
      specialization,
      desired_country,
      desired_state,
      professionalDomain,
      currentRole,
      currentSalary,
      desiredRole,
      desiredSalary,
      linkedinUrl,
      fileLocation,
    } = req.body;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !age ||
      !phone_no ||
      !gender ||
      !current_employer ||
      !desired_country ||
      !desired_state ||
      !desired_employer ||
      !current_country ||
      !current_state ||
      !education ||
      !yearOfCompletion ||
      !desired_country ||
      !desired_state ||
      !professionalDomain ||
      !currentRole ||
      !currentSalary ||
      !desiredRole ||
      !desiredSalary ||
      !linkedinUrl
    ) {
      return res.status(400).json({
        status: 400,
        message: "All fields are required!",
        success: false,
        missingFields: {
          firstname: !firstname ? "First name is required" : null,
          lastname: !lastname ? "Last name is required" : null,
          email: !email ? "Email is required" : null,
          // password: !password ? "Password is required" : null,
          age: !age ? "Age is required" : null,
          phone_no: !phone_no ? "Phone number is required" : null,
          gender: !gender ? "Gender is required" : null,
          current_employer: !current_employer
            ? "Current employer is required"
            : null,
          desired_employer: !desired_employer
            ? "Desired employer is required"
            : null,
          current_country: !current_country
            ? "Current location is required"
            : null,
          education: !education ? "Education is required" : null,
          yearOfCompletion: !yearOfCompletion
            ? "Year of completion is required"
            : null,
          desired_country: !desired_country
            ? "Desired location country is required"
            : null,
          desired_state: !desired_state
            ? "Desired location city is required"
            : null,
          professionalDomain: !professionalDomain
            ? "Professional domain is required"
            : null,
          currentRole: !currentRole ? "Current role is required" : null,
          currentSalary: !currentSalary ? "Current salary is required" : null,
          desiredRole: !desiredRole ? "Desired role is required" : null,
          desiredSalary: !desiredSalary ? "Desired salary is required" : null,
          linkedinUrl: !linkedinUrl ? "LinkedIn URL is required" : null,
        },
      });
    }
    if (!fileLocation) {
      if (!req.files.fileUpload) {
        return res.json({
          status: 400,
          message: "Resume is required !",
          success: false,
        });
      }
    }
    if (!req.files.headshot) {
      return res.json({
        status: 400,
        message: "Profile picture is required !",
        success: false,
      });
    }
    // Email format validations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid email format",
        success: false,
      });
    }

    // Phone number validation (assuming 10 digits)
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone_no)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid phone number format. Must be 10 digits",
        success: false,
      });
    }

    // LinkedIn URL validation
    const linkedinRegex = /^https:\/\/[a-z]{2,3}\.linkedin\.com\/.*$/;
    if (!linkedinRegex.test(linkedinUrl)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid LinkedIn URL format",
        success: false,
      });
    }

    // Salary validation
    if (currentSalary <= 0 || desiredSalary <= 0) {
      return res.status(400).json({
        status: 400,
        message: "Salary must be greater than 0",
        success: false,
      });
    }

    // Year of completion validation
    const currentYear = new Date().getFullYear();
    if (yearOfCompletion < 1950 || yearOfCompletion > currentYear) {
      return res.status(400).json({
        status: 400,
        message: "Invalid year of completion",
        success: false,
      });
    }

    // Enum validations
    const validAgeRanges = [
      "Below 18",
      "18 – 25",
      "26 – 34",
      "35 – 45",
      "45 – 55",
      "56 and above",
    ];
    if (!validAgeRanges.includes(age)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid age range",
        success: false,
      });
    }

    const validGenders = ["Male", "Female", "Rather not specify"];
    if (!validGenders.includes(gender)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid gender selection",
        success: false,
      });
    }

    // const validEducation = ["Undergrad", "Bachelors", "Masters", "Doctorate"];
    // if (!validEducation.includes(education)) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Invalid education level",
    //     success: false,
    //   });
    // }

    const validProfessionalDomains = [
      "Technology",
      "Management",
      "Finance",
      "Content Creator",
      "Entrepreneurship",
      "Business Intelligence",
      "Venture Capital",
    ];
    if (!validProfessionalDomains.includes(professionalDomain)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid professional domain",
        success: false,
      });
    }

    const validRoles = [
      "Undergrad / Not Employed",
      "Entry Level / Intern",
      "Individual Contributor (Jr. Level)",
      "Individual Contributor (Sr. Level)",
      "Manager",
      "Sr. Manager",
      "Director / Assistant Vice President",
      "Vice President",
      "C-Suite (CEO/CFO/CMO & Similar)",
      "Chairperson / Board of Directors",
    ];

    // if (!validRoles.includes(currentRole)) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Invalid current role",
    //     success: false,
    //   });
    // }

    // if (!validRoles.includes(desiredRole)) {
    //   return res.status(400).json({
    //     status: 400,
    //     message: "Invalid desired role",
    //     success: false,
    //   });
    // }

    // File validation (assuming you want to check file type)
    // const fileUpload = req.files.fileUpload[0];
    const uploadFileLocation = fileLocation
      ? fileLocation
      : `/public/resume_files/${req.files.fileUpload[0].originalname}`;
    const headshotLocation = `/public/resume_files/${req.files.headshot[0].originalname}`;
    // console.log("headshot", headshotLocation, "file loac", uploadFileLocation);
    // console.log("$image", headshot);
    const allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!fileLocation) {
      if (!allowedFileTypes.includes(req.files.fileUpload[0].mimetype)) {
        return res.status(400).json({
          status: 400,
          message: "Invalid file type. Please upload PDF or Word document",
          success: false,
        });
      }
    }
    const allowedImageTypes = ["image/jpg", "image/jpeg", "image/png"];
    const maxImageSize = 5 * 1024 * 1024; // 5MB

    if (!allowedImageTypes.includes(req.files.headshot[0].mimetype)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid image format. Please upload JPG, JPEG or PNG",
        success: false,
      });
    }
    if (req.files.headshot[0].size > maxImageSize) {
      return res.status(400).json({
        status: 400,
        message: "Image size should be less than 5MB",
        success: false,
      });
    }
    console.log("test work");
    // If all validations pass, proceed with user creation
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({
        status: 409,
        message: "User with this email already exists",
        success: false,
      });
    }
    // console.log("exist");
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new userModel({
      desiredCurrency,
      currency,
      firstname,
      lastname,
      email,
      password: hashedPassword,
      headshot: headshotLocation,
      desired_country,
      desired_state,
      age,
      phone_no,
      gender,
      current_employer,
      desired_employer,
      current_country,
      current_state,
      education,
      yearOfCompletion,
      specialization,
      professionalDomain,
      currentRole,
      currentSalary,
      desiredRole,
      desiredSalary,
      linkedinUrl,
      fileUpload: fileLocation ? fileLocation : uploadFileLocation,
    });

    // console.log("uploadFileLocation",ss);
    const resumeText = await uploadResume(req, res);
    // console.log("Resume Text", resumeText.extractedText.pages);
    const prompt = `Extract all the key details from resume text ${
      resumeText.extractedText?.pages
    } 
    and give and give all the resume details in the following JSON format: ${JSON.stringify(
      promptFormat,
      null,
      2
    )}. in json data keep all technical skills in a array and 
    non technical skills in a array and all other skills in a array all within skills section  `;

    const response = await AIResume(prompt);

    const J_data = await JSON.parse(response);
    console.log("#Json DATA", J_data);
    const resumeData = {
      personal_info: {
        name: `${J_data?.personal_info?.first_name || "Unknown"} ${J_data?.personal_info?.last_name || "Unknown"}`,
        email:
          J_data?.personal_info?.email ||
          J_data["Personal Information"]?.email ||
          "Not provided",
        phone:
          J_data?.personal_info?.phone ||
          J_data["Personal Information"]?.phone ||
          "Not provided",
        location:
          J_data?.personal_info?.location.city ||
          J_data["Contact Information"]?.address ||
          "Not provided", // Assuming address is available here
        linkedin:
          J_data?.personal_info?.linkedin ||
          J_data.linkedinUrl ||
          "Not provided", // If available
        github: J_data.github || "Not provided", // If available
        portfolio: J_data.portfolio || "Not provided", // If available
      },
      summary: J_data.summary || "No summary available", // Ensure there is always a fallback summary
      skills: {
        frontend:
          J_data["Technical Skills"]?.filter((skill) =>
            ["HTML", "CSS", "JavaScript"].includes(skill)
          ) || [],
        backend:
          J_data["Technical Skills"]?.filter((skill) =>
            ["C", "C++", "C#"].includes(skill)
          ) || [],
        database: [], // Add database skills if available
        devops_tools: [], // Add DevOps tools if mentioned
        other: [], // Add other skills if available
      },
      experience:
        J_data["Internships & Trainings"]?.map((exp) => ({
          title: exp.Title || "Unknown Title",
          company: exp.Company || "Unknown Company",
          location: "", // Add location if available
          start_date: new Date(), // Map with actual date if mentioned
          end_date: null, // Map with actual end date if mentioned
          responsibilities: [], // Add responsibilities if available
        })) || [],
      education:
        J_data["Education"]?.map((edu) => ({
          degree: edu.Degree || "Unknown Degree",
          university: edu.Institution || "Unknown University",
          year: edu.Year || "Unknown Year",
        })) || [],
      projects: [], // Add projects if available
      certifications: [], // Add certifications if available
      interests: [], // Add interests if available
      declaration: J_data.Declaration || "No declaration provided", // Ensure the declaration is included
    };

    console.log("Prepared resume data:", resumeData);

    // Now, save the resume data to the database
    const resume = new resumeModel(resumeData);
    resume
      .save()
      .then(() => {
        console.log("Resume saved successfully:", resume);
      })
      .catch((error) => {
        console.error("Error saving resume:", error);
      });

    // Save the resume to the database

    console.log("resume starts here");
    console.dir(J_data, { depth: null });
    // resume.save();
    const data = {
      resumeData: J_data,
      desired_employer,
      desired_country,
      desired_state,
    };

    const mileStone = await mileStones(data);
    // Check if mileStone is already a string and needs parsing
    if (typeof mileStone === "string") {
      try {
        // If it's a string, we can parse it
        const sanitized = mileStone
          .trim()
          .replace(/[\r\n\t]/g, "") // Remove newlines, tabs
          .replace(/:\s*X/g, ': "Unknown"') // Replace invalid `X` values
          .replace(/'/g, '"'); // Convert single to double quotes if needed
        const mileStoneData = JSON.parse(sanitized); // Parse sanitized JSON data
        for (const milestoneKey in mileStoneData) {
          if (mileStoneData.hasOwnProperty(milestoneKey)) {
            const milestoneDetails = mileStoneData[milestoneKey];

            // Use Mongoose model to save the data
            const newMilestone = new MileStone({
              milestone: milestoneKey,
              timeline: milestoneDetails.Timeline,
              goals: milestoneDetails.Goals,
              kpis: milestoneDetails.KPIs,
              techVerse: milestoneDetails.TechVerse,
              provision: milestoneDetails.ProVision,
              bookVault: milestoneDetails.BookVault,
              skillForge: milestoneDetails.SkillForge,
              jobSphere: milestoneDetails.JobSphere,
              eventPulse: milestoneDetails.EventPulse,
              mentorLoop: milestoneDetails.MentorLoop,
              netX: milestoneDetails.NetX,
            });

            // Save to the database
            newMilestone
              .save()
              .then(() => {
                console.log(`${milestoneKey} saved successfully!`);
              })
              .catch((err) => {
                console.error(`Error saving ${milestoneKey}:`, err);
              });
          }
        }
      } catch (error) {
        console.error("Error parsing JSON:", error);
      }
    } else {
      // If mileStone is already an object, just use it directly
      console.log("mileStone starts here");
      console.dir(mileStone, { depth: null });
    }
    newUser.save();

    return res.json({
      status: 201,
      message: "User Registered success",
      success: true,
      data: newUser,
    });
  } catch (error) {
    console.log("error", error);
    return res.json({
      status: 500,
      message: "Internal server error",
      success: false,
    });
  }
};

const mileStones = async (data) => {
  try {
<<<<<<< HEAD
    // const prompt = `Create a detailed career growth plan for an individual with the current resume and current skill set in the following json format –
    // ${data.resumeData},
    // This individual aspires to have a desired job in the desired location and with the desired employer in the following variables:
    // role ${data.desired_employer} in ${data.desired_employer} in location ${data.desiredLocationCountry},${data.desiredLocationCity}.
    // The career path should be detailed and must be broken down into exact 12 milestones. Each milestone should represent significant
    // steps in the user's professional development, including skill enhancement, certifications, learning activities, key actions, and job role progression,
    // non-technical skill enhancement also, book reading, professional courses, or anything needed to achieve the desired career. Also, tell us the realistic
    // target date (tentative also would be fine) by when the individual can achieve the desired career.
    // Goal will be achieved by: Date
    // Milestones: [
    //   {
    //     "Milestone 1": {
    //       "Timeline": {
    //         "Start Date": "Month YYYY",
    //         "End Date": "Month YYYY",
    //         "Duration (Months)": X
    //       },
    //       "Goals": {
    //         "Primary Goal": "Gain foundational knowledge in {desired_role} through structured learning.",
    //         "Measurable Goals": [
    //           "Complete 5 technical courses",
    //           "Earn 1 beginner-level certification",
    //           "Read 2 industry-related books",
    //           "Improve resume and LinkedIn profile"
    //         ]
    //       },
    //       "KPIs": {
    //         "Technical Course Completion Rate": "80%+",
    //         "Certification Achievement": "1 foundational certification earned",
    //         "Book Reading Progress": "2 books completed",
    //         "LinkedIn Profile Optimization": "Profile strength: All-Star level"
    //       },
    //       "TechVerse": {
    //         "What it Covers": "Expert-led video courses on tech stacks, frameworks, and industry tools.",
    //         "Focus Areas": ["List relevant technologies from resume & industry standards"],
    //         "Top 5 Relevant Technical Courses": ["List beginner-friendly courses"]
    //       },
    //       "ProVision": {
    //         "What it Covers": "Communication, leadership, negotiation, and personal branding.",
    //         "Focus Areas": ["Public Speaking, Collaboration, Leadership"],
    //         "Top 5 Relevant Non-Technical Courses": ["List relevant soft skills courses"]
    //       },
    //       "BookVault": {
    //         "What it Covers": "Industry-relevant books on coding, leadership, problem-solving, and career growth.",
    //         "Focus Areas": ["Software Development, Problem-Solving, Leadership"],
    //         "Recommended Books": {
    //           "Technical Books": ["List 2 beginner-level books"],
    //           "Non-Technical Book": "List 1 career development book"
    //         }
    //       },
    //       "SkillForge": {
    //         "What it Covers": "Global certifications like AWS, Google Cloud, PMP, CFA, etc.",
    //         "Focus Areas": ["Cloud Computing, Web Development, DevOps"],
    //         "Top 3 Certifications": ["List beginner-friendly certifications"]
    //       },
    //       "JobSphere": {
    //         "What it Covers": "Real-time interview simulations, resume feedback, and personalized job-matching.",
    //         "Focus Areas": ["Resume Building, LinkedIn Profile, Networking"],
    //         "Key Activities": [
    //           "Draft and refine resume",
    //           "Create a LinkedIn profile",
    //           "Attend career workshops",
    //           "Research job market for {desired_role}",
    //           "Practice self-introduction for interviews"
    //         ]
    //       },
    //       "EventPulse": {
    //         "What it Covers": "Industry talks, hackathons, networking events, and career fairs.",
    //         "Focus Areas": ["Tech Conferences, Webinars, Hackathons"],
    //         "Top 5 Events/Webinars": ["List 5 relevant industry events"]
    //       },
    //       "MentorLoop": {
    //         "What it Covers": "Direct guidance from industry mentors, career coaching, and roadmap planning.",
    //         "Focus Areas": ["1:1 Mentorship, Career Roadmap, Resume Review"],
    //         "Key Activities": [
    //           "Find and connect with an industry mentor",
    //           "Schedule monthly mentorship sessions",
    //           "Review career roadmap and receive feedback",
    //           "Discuss long-term career strategy"
    //         ]
    //       },
    //       "NetX": {
    //         "What it Covers": "LinkedIn engagement, professional group participation, and collaborations.",
    //         "Focus Areas": ["Networking, Blogging, Community Building"],
    //         "Key Activities": [
    //           "Increase LinkedIn connections by 50%",
    //           "Engage with posts from industry experts",
    //           "Join relevant tech groups and communities",
    //           "Write 1 blog on a tech topic",
    //           "Collaborate on an open-source project"
    //         ]
    //       }
    //     },

    //     "Milestone 2": {
    //       "Timeline": { "...": "Advance to intermediate-level skills." },
    //       "Goals": { "...": "Improve problem-solving and earn advanced certifications." },
    //       "KPIs": { "...": "Measure certification completions and hands-on project progress." },
    //       "TechVerse": { "...": "Include intermediate-level courses." },
    //       "ProVision": { "...": "Develop strong leadership and communication skills." },
    //       "BookVault": { "...": "Introduce problem-solving and system design books." },
    //       "SkillForge": { "...": "Earn certifications in cloud & full-stack development." },
    //       "JobSphere": { "...": "Start applying for internships & refining interview skills." },
    //       "EventPulse": { "...": "Attend hackathons & industry networking events." },
    //       "MentorLoop": { "...": "Deepen mentorship connections & resume feedback." },
    //       "NetX": { "...": "Enhance LinkedIn engagement & write a second blog." }
    //     },

    //     "Milestone 3": {
    //       "...": "Focus on project-based learning, hackathons, and networking."
    //     },

    //     "Milestone 4": {
    //       "...": "Apply for real-world job opportunities and master technical interview prep."
    //     },

    //     "Milestone 5": {
    //       "...": "Advance into specialized certifications and finalize job applications."
    //     },

    //     "Milestone 6": {
    //       "...": "Target top employers and prepare for final interviews."
    //     },

    //     "Milestone 7": {
    //       "...": "Negotiate job offers and finalize job readiness strategies."
    //     },

    //     "Milestone 8": {
    //       "...": "Develop long-term career growth strategy and leadership mindset."
    //     }
    //   },

    //   all 8 milestones without missing any single milestone in json format also give me an estimate date of when can I achieve my goal in json format`;
    const prompt = `Generate a structured JSON career roadmap with *minimum and maximum 8 Milestones*, ensuring alignment with the candidate's resume data and dream career aspirations. 
=======
    const prompt = `Generate a structured JSON career roadmap with *8 Milestones*, ensuring alignment with the candidate's resume data and dream career aspirations. 
>>>>>>> b7cc5cee252b4e1c526f759cb5e9f5f83c8f9060
        ### *📌 Input Parameters:*
        - *Resume Data:* ${data.resumeData} (Full parsed resume text)
        - *Career Goals:*
          - *Desired Role:* ${data.desiredRole}
          - *Desired Employer:*${data.desired_employer} 
          - *Desired Salary:* ${data.desiredSalary}
<<<<<<< HEAD
          - *Desired Location:* ${data.desired_country},${data.desired_state}
=======
          - *Desired Location:* ${data.desiredLocationCity}
>>>>>>> b7cc5cee252b4e1c526f759cb5e9f5f83c8f9060
        ---
        ### *🛠 Output Format (DO NOT CHANGE JSON STRUCTURE)*
        {
          "Milestone 1": {
            "Timeline": {
              "Start Date": "Month YYYY",
              "End Date": "Month YYYY",
              "Duration (Months)": X
            },
            "Goals": {
              "Primary Goal": "Gain foundational knowledge in {desired_role} through structured learning.",
              "Measurable Goals": [
                "Complete 5 technical courses",
                "Earn 1 beginner-level certification",
                "Read 2 industry-related books",
                "Improve resume and LinkedIn profile"
              ]
            },
            "KPIs": {
              "Technical Course Completion Rate": "80%+",
              "Certification Achievement": "1 foundational certification earned",
              "Book Reading Progress": "2 books completed",
              "LinkedIn Profile Optimization": "Profile strength: All-Star level"
            },
            "TechVerse": {
              "What it Covers": "Expert-led video courses on tech stacks, frameworks, and industry tools.",
              "Focus Areas": ["List relevant technologies from resume & industry standards"],
              "Top 5 Relevant Technical Courses": ["List beginner-friendly courses"]
            },
            "ProVision": {
              "What it Covers": "Communication, leadership, negotiation, and personal branding.",
              "Focus Areas": ["Public Speaking, Collaboration, Leadership"],
              "Top 5 Relevant Non-Technical Courses": ["List relevant soft skills courses"]
            },
            "BookVault": {
              "What it Covers": "Industry-relevant books on coding, leadership, problem-solving, and career growth.",
              "Focus Areas": ["Software Development, Problem-Solving, Leadership"],
              "Recommended Books": {
                "Technical Books": ["List 2 beginner-level books"],
                "Non-Technical Book": "List 1 career development book"
              }
            },
            "SkillForge": {
              "What it Covers": "Global certifications like AWS, Google Cloud, PMP, CFA, etc.",
              "Focus Areas": ["Cloud Computing, Web Development, DevOps"],
              "Top 3 Certifications": ["List beginner-friendly certifications"]
            },
            "JobSphere": {
              "What it Covers": "Real-time interview simulations, resume feedback, and personalized job-matching.",
              "Focus Areas": ["Resume Building, LinkedIn Profile, Networking"],
              "Key Activities": [
                "Draft and refine resume",
                "Create a LinkedIn profile",
                "Attend career workshops",
                "Research job market for {desired_role}",
                "Practice self-introduction for interviews"
              ]
            },
            "EventPulse": {
              "What it Covers": "Industry talks, hackathons, networking events, and career fairs.",
              "Focus Areas": ["Tech Conferences, Webinars, Hackathons"],
              "Top 5 Events/Webinars": ["List 5 relevant industry events"]
            },
            "MentorLoop": {
              "What it Covers": "Direct guidance from industry mentors, career coaching, and roadmap planning.",
              "Focus Areas": ["1:1 Mentorship, Career Roadmap, Resume Review"],
              "Key Activities": [
                "Find and connect with an industry mentor",
                "Schedule monthly mentorship sessions",
                "Review career roadmap and receive feedback",
                "Discuss long-term career strategy"
              ]
            },
            "NetX": {
              "What it Covers": "LinkedIn engagement, professional group participation, and collaborations.",
              "Focus Areas": ["Networking, Blogging, Community Building"],
              "Key Activities": [
                "Increase LinkedIn connections by 50%",
                "Engage with posts from industry experts",
                "Join relevant tech groups and communities",
                "Write 1 blog on a tech topic",
                "Collaborate on an open-source project"
              ]
            }
          },

          "Milestone 2": {
            "Timeline": { "...": "Advance to intermediate-level skills." },
            "Goals": { "...": "Improve problem-solving and earn advanced certifications." },
            "KPIs": { "...": "Measure certification completions and hands-on project progress." },
            "TechVerse": { "...": "Include intermediate-level courses." },
            "ProVision": { "...": "Develop strong leadership and communication skills." },
            "BookVault": { "...": "Introduce problem-solving and system design books." },
            "SkillForge": { "...": "Earn certifications in cloud & full-stack development." },
            "JobSphere": { "...": "Start applying for internships & refining interview skills." },
            "EventPulse": { "...": "Attend hackathons & industry networking events." },
            "MentorLoop": { "...": "Deepen mentorship connections & resume feedback." },
            "NetX": { "...": "Enhance LinkedIn engagement & write a second blog." }
          },

          "Milestone 3": {
            "...": "Focus on project-based learning, hackathons, and networking."
          },

          "Milestone 4": {
            "...": "Apply for real-world job opportunities and master technical interview prep."
          },

          "Milestone 5": {
            "...": "Advance into specialized certifications and finalize job applications."
          },

          "Milestone 6": {
            "...": "Target top employers and prepare for final interviews."
          },

          "Milestone 7": {
            "...": "Negotiate job offers and finalize job readiness strategies."
          },

          "Milestone 8": {
            "...": "Develop long-term career growth strategy and leadership mindset."
          }
        }

        ---

        ### *📢 Instructions for Output Generation:*
        1. Extract *relevant technical skills, certifications, and experiences* from {resume_data}.
        2. Align *learning areas, books, certifications, events, and mentorship* with {desired_role} and {desired_employer}.
        3. Ensure *progression across 8 milestones* — from learning *fundamentals* to *securing a job*.
        4. Include a *single timeline per milestone* and ensure *measurable goals & KPIs* for tracking progress.
        5. Format output in *exactly the same JSON structure* as defined.

        🚀 *The output should be fully structured and ready for career tracking!*
        `;
    const mileStoneData = await AIResume(prompt);
    return mileStoneData;
  } catch (error) {
    console.error(`Milestone Error: ${error}`);
    return {
      success: false,
      message: "Internal server error during resume parsing",
    };
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await userModel.findOne({ email: email.toLowerCase() }); // Ensure case-insensitive matching
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const verify = await bcrypt.compare(password, user.password);
    if (!verify) {
      return res.status(401).json({
        success: false,
        message: "Invalid password",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User login successful",
      data: user,
    });
  } catch (error) {
    console.error(`Login Error: ${error}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const googleLogin = async (req, res, next) => {
  try {
    const { email, firstname, lastname } = req.body; // Extract email from the frontend request
    console.log("Google Login Request Email:", email);

    let user = await authService.googleLogin(email);

    if (!user) {
      // If user is not found, create a new user automatically
      user = await authService.createGoogleUser(email, firstname, lastname);
    }

    // Generate JWT tokens
    res.header("auth-token", user.token);
    res.cookie("refreshToken", user.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json(user);
  } catch (err) {
    console.error("Google Login Error:", err); // Log the error for debugging
    next(err); // Pass the error to the global error handler instead of crashing
  }
};

module.exports.userRegister = userRegister;
module.exports.userLogin = userLogin;
module.exports.googleLogin = googleLogin;
