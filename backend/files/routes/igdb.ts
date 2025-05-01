import express from 'express';
import { getTopRatedGames } from '../services/games';
import { getNewGames } from '../services/upcominggames';

const router = express.Router();

router.get('/top-rated', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 36, 36); 
    const offset = parseInt(req.query.offset as string) || 0;
    const games = await getTopRatedGames(limit, offset);
    res.json(games);
  } catch (error) {
    console.error('Error fetching top rated games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

router.get('/upcoming', async (req, res) => {
  try {
    const limit = Math.min(parseInt(req.query.limit as string) || 36, 36);
    const offset = parseInt(req.query.offset as string) || 0;
    const games = await getNewGames(limit, offset);
    res.json(games);
  } catch (error) {
    console.error('Error fetching upcoming games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

export default router; 