export interface Game {
  id: number;
  name: string;
  coverUrl: string | null;
  rating: number;
  releaseDate: Date | null;
  genres: string[];
  platforms: string[];
  summary: string;
  first_release_date: number | null;
  cover: { image_id: string } | null;
} 