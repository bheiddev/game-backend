export interface Game {
  id: number;
  name: string;
  coverUrl: string | null;
  rating: number;
  releaseDate: Date | null;
  genres: string[];
  platforms: string[];
  summary: string;
} 