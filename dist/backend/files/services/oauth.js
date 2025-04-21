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
exports.exchangeCodeForToken = void 0;
function exchangeCodeForToken(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const clientId = process.env.IGDB_CLIENT_ID;
        const clientSecret = process.env.IGDB_CLIENT_SECRET;
        const redirectUri = process.env.OAUTH_REDIRECT_URI || 'http://localhost:3000';
        if (!clientId || !clientSecret) {
            throw new Error('Client ID or Client Secret is not configured');
        }
        const response = yield fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });
        if (!response.ok) {
            const errorText = yield response.text();
            console.error('OAuth Token Error:', {
                status: response.status,
                statusText: response.statusText,
                error: errorText,
            });
            throw new Error(`Failed to exchange code for token: ${errorText}`);
        }
        return yield response.json();
    });
}
exports.exchangeCodeForToken = exchangeCodeForToken;
