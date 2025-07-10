import express from 'express';
import { shortenUrl, getAllUrls, redirectUrl, verifyPassword, toggleUrlStatus, resetPasswordAttempts } from '../controllers/urlController.js';
import { authenticate } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/shorten', authenticate, shortenUrl);
router.get('/urls', authenticate, getAllUrls);
router.post('/verify-password', verifyPassword);
router.put('/toggle/:urlId', authenticate, toggleUrlStatus);
router.put('/reset-attempts/:urlId', authenticate, resetPasswordAttempts);
router.get('/:shortUrl', redirectUrl);

export default router; 