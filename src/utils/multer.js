import multer from "multer";

export const filter = {
  image: ["image/png", "image/jpeg"],
};

export const upload = (filterArr) => {
  const fileFilter = (req, file, cb) => {
    return filterArr.includes(file.mimetype)
      ? cb(null, true)
      : cb(new Error("Invalid file type", { cause: 400 }), false);
  };

  return multer({ storage: multer.diskStorage({}), fileFilter });
};
