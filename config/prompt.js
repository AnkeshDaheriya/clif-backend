const prompt = {
  personal_info: {
    first_name: "John",
    last_name : "Doe",
    email: "john.doe@example.com",
    phone: "Without country code",
    country_code: "extract from phone number",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
      country: "India",
    },
    DOB: "01/01/2001",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
  summary:
    "Software Developer with 3+ years of experience specializing in web development, Node.js, React.js, and cloud services.",
  skills: {
    technical_skills: ["all technical skills go here"],
    nontechnical_skills: ["all nontechnical skills go here"],
    other: ["all other skills go here"],
  },
  experience: [
    {
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "Delhi",
      start_date: "2023-05-01",
      end_date: "Present/ if present in resume ",
      responsibilities: [
        "Developed scalable APIs and microservices using Node.js.",
        "Optimized web app performance by refactoring existing codebase.",
        "Led a team of junior developers for front-end implementation.",
        "Deployed applications on AWS using EC2 and S3.",
      ],
    },
    {
      title: "Junior Developer",
      company: "Startup Ltd.",
      location: "Bengaluru",
      start_date: "2021-08-01",
      end_date: "2023-04-30",
      responsibilities: [
        "Collaborated on the development of an e-commerce platform.",
        "Implemented front-end features using React.js and Redux.",
        "Worked with MongoDB and Express for backend services.",
      ],
    },
  ],
  highestEducation: {
    degree: "Master of Technology (M.Tech) in Computer Science",
    university: "PQR University",
    year: "2023",
  },
  education: [
    {
      degree: "Bachelor of Technology (B.Tech) in Computer Science",
      university: "XYZ University",
      year: "2021",
    },
    {
      degree: "High School",
      university: "ABC School",
      year: "2017",
    },
    "education details in descending order",
  ],
  projects: [
    {
      title: "Personal Finance Tracker",
      technologies: ["React.js", "Node.js", "MongoDB"],
      description:
        "Developed a web application to track personal finances, including income, expenses, and budgets.",
    },
    {
      title: "Real-Time Chat App",
      technologies: ["Node.js", "Socket.io", "Express"],
      description:
        "Built a real-time chat application with socket communication for instant messaging.",
    },
  ],
  certifications: [
    {
      name: "Certified Kubernetes Administrator",
      platform: "Cloud Academy",
      status: "Completed",
    },
    {
      name: "Google Cloud Associate",
      platform: "Google Cloud",
      status: "In Progress",
    },
  ],
  interests: ["Photography", "Gaming", "Traveling"],
};

module.exports.promptFormat = prompt;
