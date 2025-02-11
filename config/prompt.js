const prompt = {
  personal_info: {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91-XXXXXXXXXX",
    location: "Mumbai, Maharashtra, India",
    linkedin: "https://linkedin.com/in/johndoe",
    github: "https://github.com/johndoe",
    portfolio: "https://johndoe.dev",
  },
  summary:
    "Software Developer with 3+ years of experience specializing in web development, Node.js, React.js, and cloud services.",
  skills: {
    frontend: ["HTML", "CSS", "JavaScript", "React.js", "Angular"],
    backend: ["Node.js", "Express", "Python", "Django"],
    database: ["MySQL", "PostgreSQL", "MongoDB"],
    devops_tools: ["Git", "Docker", "Jenkins", "Nginx"],
    other: ["API Development", "Web Scraping", "Cloud Hosting"],
  },
  experience: [
    {
      title: "Software Engineer",
      company: "Tech Solutions Inc.",
      location: "Delhi",
      start_date: "2023-05-01",
      end_date: "Present",
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

module.exports.promptFormat = prompt