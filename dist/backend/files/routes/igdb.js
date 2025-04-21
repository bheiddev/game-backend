"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const games_1 = require("../services/games");
const router = express_1.default.Router();
router.get('/top-rated', async (req, res) => {
    try {
        const games = await (0, games_1.getTopRatedGames)();
        res.json(games);
    }
    catch (error) {
        console.error('Error fetching top rated games:', error);
        res.status(500).json({ error: 'Failed to fetch games' });
    }
});
exports.default = router;
