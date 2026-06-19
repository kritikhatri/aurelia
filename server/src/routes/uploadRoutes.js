import express from 'express';
import multer from 'multer';
import os from 'os';
import { uploadImage } from '../config/cloudinary.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Multer storage in OS temp directory
const upload = multer({ dest: os.tmpdir() });

router.post('/', protect, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  try {
    const imageUrl = await uploadImage(req.file.path);
    return res.json({ imageUrl });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Upload failed', error: error.message });
  }
});

export default router;
