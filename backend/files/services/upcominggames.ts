import { Game } from '../types/game';
import { getTwitchAccessToken } from './oauth';
import { IGDB_BASE_URL } from './oauth';

//Call to pull in the top rated games
export async function getNewGames(limit: number = 36, offset: number = 0): Promise<Game[]> {
  try {
    //Get the token from the oauth service
    const token = await getTwitchAccessToken();
    //Get the client id from the environment file
    const clientId = process.env.IGDB_CLIENT_ID;

    //If the client id is not there, throw an error
    if (!clientId) {
      throw new Error('Client ID is not configured');
    }
    
    //get the current time stamp and two weeks from now
    const currentTimestamp = Math.floor(Date.now() / 1000);
    const twoWeeksFromNow = currentTimestamp + (14 * 24 * 60 * 60); // 14 days in seconds
    
    const response = await fetch(`${IGDB_BASE_URL}/games`, {
      method: 'POST',
      headers: {
        'Client-ID': clientId,
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'text/plain',
      },
      body: `
        fields name, cover.image_id, rating, first_release_date, genres.name, platforms.name, summary;
        where first_release_date >= ${currentTimestamp} 
        & first_release_date <= ${twoWeeksFromNow}
        & genres = (32) 
        & platforms = (6, 14, 48, 49, 130, 167, 169);
        sort first_release_date asc;
        limit ${limit};
        offset ${offset};
      `
    });

    //if there is no response then throw an error
    if (!response.ok) {
      throw new Error(`IGDB API error: ${response.statusText}`);
    }

    //create a game json object for all the games
    const games = await response.json();
    console.log(`Fetched ${games.length} games from IGDB`);

    //create a game map for each game with its ID, name, cover URL, rating, release date, and summary
    return games.map((game: any) => {
      console.log('Processing game:', {
        id: game.id,
        name: game.name,
        first_release_date: game.first_release_date,
        formatted_date: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : null
      });

      

      //return the game object with id, name, cover URL, rating, release date, and summary
      return {
        id: game.id,
        name: game.name,
        coverUrl: game.cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${game.cover.image_id}.jpg` : undefined,
        rating: game.rating,
        releaseDate: game.first_release_date ? new Date(game.first_release_date * 1000).toISOString() : undefined,
        summary: game.summary,
        genres: game.genres?.map((genre: any) => genre.name),
        platforms: game.platforms?.map((platform: any) => platform.name)
      };
    });
  } catch (error) {
    console.error('Error fetching games from IGDB:', error);
    throw error;
  }
} 