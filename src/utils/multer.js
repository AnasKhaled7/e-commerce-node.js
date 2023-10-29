const multer = require("multer");

const filter = {
  image: ["image/png", "image/jpeg"],
};

const upload = (filterArr) => {
  const fileFilter = (req, file, cb) => {
    if (filterArr.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid file type", { cause: 400 }), false);
    }
  };

  return multer({ storage: multer.diskStorage({}), fileFilter });
};

module.exports = { upload, filter };
