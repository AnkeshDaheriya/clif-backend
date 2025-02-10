// const firebaseAdmin = require("firebase-admin");
const bcrypt = require("bcrypt");
const userModel = require("../models/users");
const authService = require("../config/authService.js");
const { ErrorHandler } = require("../helper/error");

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
          password: !password ? "Password is required" : null,
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
    console.log("headshot", headshotLocation, "file loac", uploadFileLocation);
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

      if (req.files.headshot[0].size > maxImageSize) {
        return res.status(400).json({
          status: 400,
          message: "Image size should be less than 5MB",
          success: false,
        });
      }
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
    console.log("exist");
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
      // specialization,
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

    console.log("before save");
    newUser.save();
    console.log("after save");
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
