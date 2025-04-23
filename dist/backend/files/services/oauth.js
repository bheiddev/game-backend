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
exports.getTwitchAccessToken = exports.IGDB_BASE_URL = void 0;
let accessToken = null;
let tokenExpiry = null;
exports.IGDB_BASE_URL = 'https://api.igdb.com/v4';
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
exports.getTwitchAccessToken = getTwitchAccessToken;
