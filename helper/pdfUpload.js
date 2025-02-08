const multer = require("multer");
const path = require("path");

const filePath = path.join(__dirname, "..", "public", "resume_files");

const storage = multer.diskStorage({
  // file destination
  destination: (req, file, cb) => {
    cb(null, filePath);
  },
  // filename (current date (in ms) + file's originalname)
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

module.exports.upload = upload;
