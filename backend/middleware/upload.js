import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Local uploads root: C:\B I T\Project\Code Base\Uploads (a sibling of the project folder).
// Resolved relative to this file so it keeps working even if the project is moved.
export const UPLOADS_ROOT = path.resolve(__dirname, "..", "..", "..", "Uploads");

const PROFILES_DIR = path.join(UPLOADS_ROOT, "profiles");
const COMPLAINTS_DIR = path.join(UPLOADS_ROOT, "complaints");

// Ensure the folders exist before multer tries to write into them.
for (const dir of [PROFILES_DIR, COMPLAINTS_DIR]) {
  fs.mkdirSync(dir, { recursive: true });
}

// Public URL prefixes (what gets stored in MongoDB and served by express.static).
export const PROFILES_URL = "/uploads/profiles";
export const COMPLAINTS_URL = "/uploads/complaints";

const makeStorage = (dir) =>
  multer.diskStorage({
    destination: (req, file, cb) => cb(null, dir),
    filename: (req, file, cb) => {
      const safeName = file.originalname.replace(/\s+/g, "_");
      cb(null, `${Date.now()}-${safeName}`);
    },
  });

const imageOnly = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"));
  }
};

const limits = { fileSize: 5 * 1024 * 1024 }; // 5 MB

// Driver/Officer/Admin profile pictures -> Uploads/profiles
export const profileUpload = multer({
  storage: makeStorage(PROFILES_DIR),
  fileFilter: imageOnly,
  limits,
});

// Complaint evidence images -> Uploads/complaints
export const complaintUpload = multer({
  storage: makeStorage(COMPLAINTS_DIR),
  fileFilter: imageOnly,
  limits,
});
