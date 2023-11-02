import multer from "multer";

export const filter = {
  image: ["image/png", "image/jpeg"],
};

export const upload = (filterArr) => {
  const fileFilter = (req, file, cb) => {
    if (filterArr.includes(file.mimetype)) {
      return cb(null, true);
    } else {
      return cb(new Error("Invalid file type", { cause: 400 }), false);
    }
  };

  return multer({ storage: multer.diskStorage({}), fileFilter });
};
