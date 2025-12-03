import express from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// uploads directory
const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });

// upload route
router.post(
  '/products',
  authMiddleware,
  adminOnly,
  upload.array('images', 6),
  async (req, res) => {
    const files = req.files || [];
    const host = req.protocol + '://' + req.get('host');
    const urls = files.map(f => host + '/uploads/' + path.basename(f.path));
    res.json({ urls });
  }
);

export default router;
