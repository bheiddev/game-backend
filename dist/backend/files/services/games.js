"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTopRatedGames = void 0;
let accessToken = null;
let tokenExpiry = null;
const IGDB_BASE_URL = 'https://api.igdb.com/v4';
function getTwitchAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.IGDB_CLIENT_ID;
        const clientSecret = process.env.IGDB_CLIENT_SECRET;
        if (!clientId || !clientSecret) {
            throw new Error('Client ID or Client Secret is not configured');
        }
        // Check if we have a valid token
        if (accessToken && tokenExpiry && Date.now() < tokenExpiry) {
            return accessToken;
        }
        const response = yield fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
            }),
        });
        if (!response.ok) {
            throw new Error('Failed to get access token');
        }
        const data = yield response.json();
        accessToken = data.access_token;
        // Set expiry to 1 hour from now (minus 5 minutes buffer)
        tokenExpiry = Date.now() + (data.expires_in - 300) * 1000;
        if (!accessToken) {
            throw new Error('Access token is null after successful response');
        }
        return accessToken;
    });
}
function getTopRatedGames() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = yield getTwitchAccessToken();
            const clientId = process.env.IGDB_CLIENT_ID;
            if (!clientId) {
                throw new Error('Client ID is not configured');
            }
            const currentTimestamp = Math.floor(Date.now() / 1000);
            const response = yield fetch(`${IGDB_BASE_URL}/games`, {
                method: 'POST',
                headers: {
                    'Client-ID': clientId,
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'text/plain',
                },
                body: `
        fields name, cover.image_id, rating, first_release_date, genres.name, platforms.name, summary;
        where first_release_date <= ${currentTimestamp} & rating > 80 & genres = (32) & platforms = (6, 14, 48, 49, 130, 167, 169);
        sort first_release_date desc;
        limit 500;
      `
            });
            if (!response.ok) {
                throw new Error(`IGDB API error: ${response.statusText}`);
            }
            const games = yield response.json();
            console.log(`Fetched ${games.length} games from IGDB`);
            return games.map((game) => {
                var _a, _b;
                console.log('Processing game:', {
                    id: game.id,
                    name: game.name,
                    first_release_date: game.first_release_date,
                    formatted_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null
                });
                return {
                    id: game.id,
                    name: game.name,
                    coverUrl: game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg` : undefined,
                    rating: game.rating,
                    releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : undefined,
                    summary: game.summary,
                    genres: (_a = game.genres) === null || _a === void 0 ? void 0 : _a.map((genre) => genre.name),
                    platforms: (_b = game.platforms) === null || _b === void 0 ? void 0 : _b.map((platform) => platform.name)
                };
            });
        }
        catch (error) {
            console.error('Error fetching games from IGDB:', error);
            throw error;
        }
    });
}
exports.getTopRatedGames = getTopRatedGames;
