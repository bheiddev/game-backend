import express from 'express';
import { exchangeCodeForToken } from '../services/oauth';

const router = express.Router();

router.post('/token', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ error: 'Authorization code is required' });
    }

    const tokenData = await exchangeCodeForToken(code);
    res.json(tokenData);
  } catch (error) {
    console.error('Error in token exchange:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router; 