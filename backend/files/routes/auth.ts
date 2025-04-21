import express, { Request, Response, Router } from 'express';

const router: Router = express.Router();

router.post('/token', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;

    if (!code) {
      res.status(400).json({ error: 'Authorization code is required' });
      return;
    }

    // Dummy response for testing
    res.json({ message: 'Token received', code });
  } catch (error) {
    console.error('Error in token exchange:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
