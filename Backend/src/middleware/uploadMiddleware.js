import multer from "multer";
import fs from "fs";
import os from "os";

const uploadPath = process.env.VERCEL ? os.tmpdir() : "uploads/";

if (!process.env.VERCEL && !fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

export default upload;