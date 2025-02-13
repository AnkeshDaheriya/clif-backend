// const firebaseAdmin = require("firebase-admin");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const resumeModel = require("../models/resumeModel");

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
      current_employer,
      desired_employer,
      current_location,
      education,
      yearOfCompletion,
      specialization,
      desiredLocationCountry,
      desiredLocationCity,
      professionalDomain,
      currentRole,
      currentSalary,
      desiredRole,
      desiredSalary,
      linkedinUrl,
    } = req.body;
    if (
      !firstname ||
      !lastname ||
      !email ||
      !age ||
      !phone_no ||
      !gender ||
      !current_employer ||
      !desired_employer ||
      !current_location ||
      !education ||
      !yearOfCompletion ||
      !desiredLocationCountry ||
      !desiredLocationCity ||
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
          current_location: !current_location
            ? "Current location is required"
            : null,
          education: !education ? "Education is required" : null,
          yearOfCompletion: !yearOfCompletion
            ? "Year of completion is required"
            : null,
          desiredLocationCountry: !desiredLocationCountry
            ? "Desired location country is required"
            : null,
          desiredLocationCity: !desiredLocationCity
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
    if (!req.files.fileUpload) {
      return res.json({
        status: 400,
        message: "Resume is required !",
        success: false,
      });
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

    const validEducation = ["Undergrad", "Bachelors", "Masters", "Doctorate"];
    if (!validEducation.includes(education)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid education level",
        success: false,
      });
    }

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

    if (!validRoles.includes(currentRole)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid current role",
        success: false,
      });
    }

    if (!validRoles.includes(desiredRole)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid desired role",
        success: false,
      });
    }

    // File validation (assuming you want to check file type)
    // const fileUpload = req.files.fileUpload[0];
    const uploadFileLocation = `/public/resume_files/${req.files.fileUpload[0].originalname}`;
    const headshotLocation = `/public/resume_files/${req.files.headshot[0].originalname}`;
    // console.log("headshot", headshotLocation, "file loac", uploadFileLocation);
    // console.log("$image", headshot);
    const allowedFileTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowedFileTypes.includes(req.files.fileUpload[0].mimetype)) {
      return res.status(400).json({
        status: 400,
        message: "Invalid file type. Please upload PDF or Word document",
        success: false,
      });
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
      firstname,
      lastname,
      email,
      password: hashedPassword,
      headshot: headshotLocation,
      age,
      phone_no,
      gender,
      current_employer,
      desired_employer,
      current_location,
      education,
      yearOfCompletion,
      specialization,
      desiredLocationCountry,
      desiredLocationCity,
      professionalDomain,
      currentRole,
      currentSalary,
      desiredRole,
      desiredSalary,
      linkedinUrl,
      fileUpload: uploadFileLocation,
    });

    // console.log("uploadFileLocation",ss);
    const resumeText = await uploadResume(req, res);
    // console.log("Resume Text", resumeText.extractedText.pages);
    const prompt = `Extract all the key details from resume text ${resumeText.extractedText?.pages} 
                    and give all the resume details in ${promptFormat} in json data keep all technical skills in a array and 
                    non technical skills in a array and all other skills in a array all within skills section  `;

    const response = await AIResume(prompt);

    const J_data = await JSON.parse(response);
    const resumeData = {
      personal_info: {
        name: `${J_data["Personal Information"]?.Name || "Unknown"} ${
          J_data["Personal Information"]?.Name ? "" : "Unknown"
        }`,
        email: J_data["Personal Information"]?.Email || "Not provided",
        phone: J_data["Personal Information"]?.Phone || "Not provided",
        location: J_data["Contact Information"]?.Address || "Not provided", // Assuming address is available here
        linkedin: J_data.linkedinUrl || "Not provided", // If available
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
      desiredLocationCountry,
      desiredLocationCity,
    };

    const mileStone = await mileStones(data);
    // console.log(mileStone);
    const mileStoneData = await JSON.parse(mileStone.trim(" "));
    console.log("mileStone starts here");
    console.dir(mileStoneData, { depth: null });

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
    const prompt = `Create a detailed career growth plan for an individual with the current resume and current skill set in the following json format – 
${data.resumeData},
This individua, aspires to have a desired job in desired location and with desired employer in the following variables 
role ${data.desired_employer} in ${data.desired_employer} in location ${data.desiredLocationCountry},${data.desiredLocationCity}.
The career path should be detaild and must be broken down into exact 12 milestones. Each milestone should represent significant 
steps in the user's professional development, including skill enhancement, certifications, learning activities, key actions, and job role progression, 
non technical skill inhancement also, book reading, professional course, or anything needed needed to achieve the desired career.  Also tell us the realistic 
target date (tentative also would be fine) by when the individual can achive the desired career.,
goal will be achieved by : Date 
mileStoes : [
  "Milestone 1": {
    "timeline": {
      "startDate": "DD-MM-YYYY",
      "endDate": "DD-MM-YYYY",
      "durationMonths": number
    },
    "focusArea": "Skill Development - Frontend and Backend",
    "goal": "Master React.js, Laravel, and Full-stack Development",
    "keyActivities": [
      "Complete advanced React.js and Laravel courses",
      "Build a personal project integrating React and Laravel",
      "Learn state management with Redux"
    ],
    "measurableOutcomes": [
      "Complete 3 React projects",
      "Build a full-stack web application with authentication"
    ],
    "learningResources": {
      "courses": ["React - Advanced Concepts", "Master Laravel"],
      "books": ["Learning React", "Laravel Up & Running"],
      "tools": ["VS Code", "GitHub", "Docker"]
    },
    "kpis": ["Complete 2 major React applications", "Learn and apply Redux in a project"],
    "jobRoleDevelopment": {
      "role": "Full Stack Developer",
      "responsibilities": [
        "Develop advanced user interfaces",
        "Work with backend and frontend integration"
      ]
    }
  },
  "Milestone 2": {
    "timeline": {
      "startDate": "01-04-2025",
      "endDate": "01-05-2025",
      "durationMonths": 1
    },
    "focusArea": "Backend Development and API Integration",
    "goal": "Strengthen skills in API development and backend technologies",
    "keyActivities": [
      "Learn advanced API development with Laravel",
      "Work on integrating third-party APIs",
      "Start a personal project that involves complex backend systems"
    ],
    "measurableOutcomes": [
      "Create a RESTful API in Laravel",
      "Integrate a payment gateway API (Stripe)"
    ],
    "learningResources": {
      "courses": ["Advanced Laravel API Development", "Building APIs with Laravel"],
      "books": ["API Design Patterns", "Modern PHP"],
      "tools": ["Postman", "XAMPP", "Stripe API"]
    },
    "kpis": ["Complete 2 API integrations", "Develop a robust authentication system for APIs"],
    "jobRoleDevelopment": {
      "role": "Backend Developer",
      "responsibilities": [
        "Develop and maintain server-side logic",
        "Integrate third-party APIs"
      ]
    }
  },
  "Milestone 3": {
    "timeline": {
      "startDate": "01-05-2025",
      "endDate": "01-06-2025",
      "durationMonths": 1
    },
    "focusArea": "Cloud Deployment and DevOps",
    "goal": "Enhance skills in cloud deployment and DevOps tools like Docker and AWS",
    "keyActivities": [
      "Deploy applications on AWS EC2 and S3",
      "Learn Docker and containerize existing projects",
      "Explore AWS Lambda and serverless architecture"
    ],
    "measurableOutcomes": [
      "Successfully deploy an app on AWS",
      "Containerize 2 existing applications"
    ],
    "learningResources": {
      "courses": ["AWS Certified Solutions Architect", "Docker for Developers"],
      "books": ["AWS Up & Running", "Docker in Action"],
      "tools": ["AWS CLI", "Docker Desktop"]
    },
    "kpis": ["Deploy 3 apps to AWS", "Successfully containerize 3 applications using Docker"],
    "jobRoleDevelopment": {
      "role": "Cloud Engineer",
      "responsibilities": [
        "Ensure smooth cloud deployment",
        "Monitor and maintain cloud infrastructure"
      ]
    }
  },
  "Milestone 4": {
    "timeline": {
      "startDate": "01-06-2025",
      "endDate": "01-07-2025",
      "durationMonths": 1
    },
    "focusArea": "Leadership and Mentorship",
    "goal": "Start taking on leadership responsibilities and mentoring junior developers",
    "keyActivities": [
      "Lead small team projects",
      "Mentor junior developers in your team",
      "Organize knowledge-sharing sessions"
    ],
    "measurableOutcomes": [
      "Successfully lead 2 small projects",
      "Mentor at least 2 junior developers"
    ],
    "learningResources": {
      "courses": ["Leadership for Developers", "Agile Project Management"],
      "books": ["Radical Candor", "The Lean Startup"],
      "tools": ["Trello", "Slack", "Jira"]
    },
    "kpis": ["Lead 2 successful projects", "Mentor at least 3 junior developers"],
    "jobRoleDevelopment": {
      "role": "Team Lead",
      "responsibilities": [
        "Guide junior team members",
        "Manage project timelines and deliverables"
      ]
    }
  },
  "Milestone 5": {
    "timeline": {
      "startDate": "01-07-2025",
      "endDate": "01-08-2025",
      "durationMonths": 1
    },
    "focusArea": "Advanced Database Management",
    "goal": "Master advanced database design and optimization techniques",
    "keyActivities": [
      "Optimize database queries for better performance",
      "Learn about indexing, joins, and advanced SQL features",
      "Work on a project with MongoDB or Firebase"
    ],
    "measurableOutcomes": [
      "Optimize 5 SQL queries for performance",
      "Create an efficient MongoDB database schema"
    ],
    "learningResources": {
      "courses": ["Advanced SQL for Developers", "MongoDB for Developers"],
      "books": ["SQL Performance Explained", "MongoDB in Action"],
      "tools": ["MySQL Workbench", "MongoDB Atlas"]
    },
    "kpis": ["Optimize 10 database queries", "Create and deploy a MongoDB database project"],
    "jobRoleDevelopment": {
      "role": "Database Developer",
      "responsibilities": [
        "Design efficient database schemas",
        "Ensure database optimization and scaling"
      ]
    }
  },
all 8 milestones without missing any single milestone in json format also give me an estimate date of when can i achieve my goal in json format`;
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
