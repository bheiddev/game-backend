import express from 'express';
import { getTopRatedGames } from '../services/games';

const router = express.Router();

router.get('/top-rated', async (req, res) => {
  try {
    const games = await getTopRatedGames();
    res.json(games);
  } catch (error) {
    console.error('Error fetching top rated games:', error);
    res.status(500).json({ error: 'Failed to fetch games' });
  }
});

export default router; 