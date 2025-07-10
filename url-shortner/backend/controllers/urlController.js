import Url from '../models/Url.js';
import { generateShortUrl } from '../utils/generateShortUrl.js';
import bcrypt from 'bcrypt';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, password } = req.body;
    
    if (!originalUrl) {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    const shortUrl = generateShortUrl();
    
    // Create URL object with password protection if password is provided
    const urlData = { 
      originalUrl, 
      shortUrl, 
      userId: req.user._id,
      isPasswordProtected: !!password
    };
    
    // Hash password if provided
    if (password) {
      const saltRounds = 10;
      urlData.password = await bcrypt.hash(password, saltRounds);
    }
    
    const url = new Url(urlData);
    await url.save();

    // Generate the full URL based on environment
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? process.env.BACKEND_URL || process.env.APP_URL
      : `http://localhost:${process.env.PORT || 5000}`;
    
    res.json({
      originalUrl,
      shortUrl: `${baseUrl}/${shortUrl}`,
      id: url._id,
      isPasswordProtected: url.isPasswordProtected
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find({ userId: req.user._id })
      .select('-password') // Don't return password in the response
      .sort({ createdAt: -1 });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const verifyPassword = async (req, res) => {
  try {
    const { shortUrl, password } = req.body;
    
    if (!shortUrl || !password) {
      return res.status(400).json({ error: 'Short URL and password are required' });
    }
    
    const url = await Url.findOne({ shortUrl });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check if URL is active
    if (!url.isActive) {
      return res.status(403).json({ error: 'This link has been disabled' });
    }
    
    if (!url.isPasswordProtected) {
      return res.status(400).json({ error: 'URL is not password protected' });
    }
    
    // Check if password matches
    const isValidPassword = await bcrypt.compare(password, url.password);
    
    if (!isValidPassword) {
      // Increment password attempts
      url.passwordAttempts += 1;
      
      // Auto-disable link after 5 failed attempts
      if (url.passwordAttempts >= 5) {
        url.isActive = false;
      }
      
      await url.save();
      
      return res.status(401).json({ 
        error: 'Invalid password',
        attempts: url.passwordAttempts,
        disabled: url.passwordAttempts >= 5
      });
    }
    
    // Password is correct, increment clicks and return original URL
    url.clicks += 1;
    await url.save();
    
    res.json({ 
      originalUrl: url.originalUrl,
      success: true 
    });
    
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const toggleUrlStatus = async (req, res) => {
  try {
    const { urlId } = req.params;
    
    const url = await Url.findOne({ _id: urlId, userId: req.user._id });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    // Toggle active status
    url.isActive = !url.isActive;
    
    // If re-enabling, reset password attempts
    if (url.isActive) {
      url.passwordAttempts = 0;
    }
    
    await url.save();
    
    res.json({
      success: true,
      isActive: url.isActive,
      passwordAttempts: url.passwordAttempts,
      message: url.isActive ? 'Link enabled' : 'Link disabled'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const resetPasswordAttempts = async (req, res) => {
  try {
    const { urlId } = req.params;
    
    const url = await Url.findOne({ _id: urlId, userId: req.user._id });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }
    
    url.passwordAttempts = 0;
    await url.save();
    
    res.json({
      success: true,
      passwordAttempts: url.passwordAttempts,
      message: 'Password attempts reset'
    });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const redirectUrl = async (req, res) => {
  try {
    const url = await Url.findOne({ shortUrl: req.params.shortUrl });
    
    if (!url) {
      return res.status(404).json({ error: 'URL not found' });
    }

    // Check if URL is active
    if (!url.isActive) {
      return res.status(403).json({ error: 'This link has been disabled' });
    }

    // Check if URL is password protected
    if (url.isPasswordProtected) {
      // Serve the password prompt HTML page
      return res.sendFile(path.join(__dirname, '../public/password-prompt.html'));
    }

    // If not password protected, proceed with normal redirect
    url.clicks++;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
}; 