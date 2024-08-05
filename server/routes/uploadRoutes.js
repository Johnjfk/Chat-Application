import express from 'express';
import { uploadProfilePicMiddleware, uploadProfilePicture, Auth } from '../controllers/user.js';
const router = express.Router();
router.post('/upload-profile-pic', Auth, uploadProfilePicMiddleware, uploadProfilePicture);
export default router;
