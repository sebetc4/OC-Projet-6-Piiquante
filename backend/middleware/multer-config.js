// Import
const multer = require("multer");

// Middleware de multer
const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, "images");
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(" ").join("_");
        callback(null, Date.now() + name);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpg" || file.mimetype === "image/jpeg") {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(new Error('Seul les formats .png, .jpg and .jpeg sont acceptés!'));
    }
  }

module.exports = multer({ storage, fileFilter }).single("image");
