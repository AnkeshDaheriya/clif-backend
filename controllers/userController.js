// const firebaseAdmin = require("firebase-admin");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const resumeModel = require("../models/resumeModel");
const Milestone = require("../models/mileStoneModel.js");
const authService = require("../config/authService.js");
const { ErrorHandler } = require("../helper/error");
const { textExtraction } = require("../helper/resumeTextParser.js");
const { uploadResume } = require("./resumeController.js");
const { AIResume } = require("../helper/OpenAiHelper.js");
const { promptFormat } = require("../config/prompt.js");
const { mileStones, getMileStones } = require("./mileStoneController.js");

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
          currentRole: !currentRole ? "Current role is required" : null,
          currentSalary: !currentSalary ? "Current salary is required" : null,
          desiredRole: !desiredRole ? "Desired role is required" : null,
          desiredSalary: !desiredSalary ? "Desired salary is required" : null,
          linkedinUrl: !linkedinUrl ? "LinkedIn URL is required" : null,
        },
      });
    }

    console.log("$file", req.file, req.files);
    // console.log(fileLocation);
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

    const validProfessionalDomains = [
      "Technology",
      "Management",
      "Finance",
      "Content Creator",
      "Entrepreneurship",
      "Business Intelligence",
      "Venture Capital",
    ];
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
    const uploadFileLocation = fileLocation
      ? fileLocation
      : `/public/resume_files/${req.files.fileUpload[0].originalname}`;
    const headshotLocation = `/public/resume_files/${req.files.headshot[0].originalname}`;
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
        name: `${J_data?.personal_info?.first_name || "Unknown"} ${
          J_data?.personal_info?.last_name || "Unknown"
        }`,
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
    const data = {
      resumeData: J_data,
      desired_employer,
      desired_country,
      desired_state,
    };

    const mileStone = await mileStones(data);
    // console.log("userController line 405");
    // console.dir(mileStone, { depth: null });

    newUser.save();

    try {
      const saveMileStones = new Milestone({
        user_id: newUser._id,
        milestones: mileStone,
      });
      // console.log("aa gaya ", saveMileStones);
      await saveMileStones.save();
      console.log("saved");
    } catch (error) {
      console.log("$error", error);
    }

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
      // If the user doesn't exist, return an error with a message to sign up
      return res
        .status(403)
        .json({ message: "User not found. Please sign up." });
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
