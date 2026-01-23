const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const uploadCloud = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "posts",
       
       
      },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      },
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

module.exports = uploadCloud;
