import express from 'express';
import { getSuspiciousUser, getSuspiciousUserPosts } from '../controllers/suspiciousController.js';


const router = express.Router();

router.get('/', getSuspiciousUser);
router.get('/posts/:id', getSuspiciousUserPosts);

export default router;
