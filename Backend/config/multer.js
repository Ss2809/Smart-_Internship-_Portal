const multer = require("multer");

const stroage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/") || file.mimetype === "application/pdf")
    cb(null, true);
  else cb(new Error("only images allowes"));
};

module.exports = multer({ stroage, fileFilter });
