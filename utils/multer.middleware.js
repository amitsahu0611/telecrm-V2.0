const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

const currentModulePath = __dirname;
const projectRootPath = path.resolve(currentModulePath, "../");
const publicDocImagesPath = path.join(projectRootPath, "public", "docimages");

const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      await fs.mkdir(publicDocImagesPath, { recursive: true });
      cb(null, publicDocImagesPath);
    } catch (err) {
      console.error("Error creating directory:", err);
      cb(err, null);
    }
  },
  filename: (req, file, cb) => {
    const originalName = path.parse(file.originalname).name;
    const extension = path.extname(file.originalname);
    const newFilename = `${originalName}${extension}`;
    cb(null, newFilename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
  ];

  if (allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Allowed file types are: png, jpeg, jpg, pdf, doc, docx, xls, xlsx, csv."
      )
    );
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB file size limit
  fileFilter: fileFilter,
});

const singleFileUpload = upload.single("image");
const MultiFileUpload = upload.array("image");

module.exports = {
  upload,
  singleFileUpload,
  MultiFileUpload,
};
