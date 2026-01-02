import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/audio");
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random()}${ext}`);
  },
});

export const uploadAudio = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
