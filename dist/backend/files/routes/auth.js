"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const oauth_1 = require("../services/oauth");
const router = express_1.default.Router();
router.post('/token', async (req, res) => {
    try {
        const { code } = req.body;
        if (!code) {
            return res.status(400).json({ error: 'Authorization code is required' });
        }
        const tokenData = await (0, oauth_1.exchangeCodeForToken)(code);
        res.json(tokenData);
    }
    catch (error) {
        console.error('Error in token exchange:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.default = router;
